import { createChannelManager } from './channels/manager.js';
import { createWhatsAppPlugin } from './channels/whatsapp/plugin.js';
import { createLarkPlugin } from './channels/lark/plugin.js';
import {
  assertOutboundAllowed,
  sendComposing,
  sendMessageWhatsApp,
  type WhatsAppInboundMessage,
} from './channels/whatsapp/index.js';
import {
  replyMessageLark,
  type LarkInboundMessage,
} from './channels/lark/index.js';
import { resolveRoute } from './routing/resolve-route.js';
import { resolveSessionStorePath, upsertSessionMeta } from './sessions/store.js';
import { loadGatewayConfig, type GatewayConfig } from './config.js';
import { runAgentForMessage } from './agent-runner.js';
import { getSetting } from '../utils/config.js';
import { resolveProvider } from '../providers.js';
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from '../model/llm.js';
import { appendFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

function resolveGatewayModel(): { model: string; modelProvider: string } {
  const model = getSetting('modelId', null) as string | null ?? DEFAULT_MODEL;
  const provider = getSetting('provider', null) as string | null ?? resolveProvider(model).id;
  return { model, modelProvider: provider };
}

const LOG_PATH = join(homedir(), '.dexter', 'gateway-debug.log');
function debugLog(msg: string) {
  appendFileSync(LOG_PATH, `${new Date().toISOString()} ${msg}\n`);
}

export type GatewayService = {
  stop: () => Promise<void>;
  snapshot: () => Record<string, { accountId: string; running: boolean; connected?: boolean }>;
};

function elide(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

/**
 * Clean up markdown for WhatsApp compatibility.
 * - Converts `**text**` (markdown bold) to `*text*` (WhatsApp bold)
 * - Merges adjacent bold sections to prevent literal asterisks showing
 */
function cleanMarkdownForWhatsApp(text: string): string {
  let result = text;
  // Convert markdown bold (**text**) to WhatsApp bold (*text*)
  result = result.replace(/\*\*([^*]+)\*\*/g, '*$1*');
  // Merge adjacent bold sections: `*foo* *bar*` -> `*foo bar*`
  result = result.replace(/\*([^*]+)\*\s+\*([^*]+)\*/g, '*$1 $2*');
  return result;
}

async function handleInbound(cfg: GatewayConfig, inbound: WhatsAppInboundMessage): Promise<void> {
  const bodyPreview = elide(inbound.body.replace(/\n/g, ' '), 50);
  console.log(`Inbound message ${inbound.from} (${inbound.chatType}, ${inbound.body.length} chars): "${bodyPreview}"`);
  debugLog(`[gateway] handleInbound from=${inbound.from} body="${inbound.body.slice(0, 30)}..."`);
  
  const route = resolveRoute({
    cfg,
    channel: 'whatsapp',
    accountId: inbound.accountId,
    peer: { kind: inbound.chatType, id: inbound.senderId },
  });

  const storePath = resolveSessionStorePath(route.agentId);
  upsertSessionMeta({
    storePath,
    sessionKey: route.sessionKey,
    channel: 'whatsapp',
    to: inbound.from,
    accountId: route.accountId,
    agentId: route.agentId,
  });

  // Start typing indicator loop to keep it alive during long agent runs
  const TYPING_INTERVAL_MS = 5000; // Refresh every 5 seconds
  let typingTimer: ReturnType<typeof setInterval> | undefined;
  
  const startTypingLoop = async () => {
    await sendComposing({ to: inbound.replyToJid, accountId: inbound.accountId });
    typingTimer = setInterval(() => {
      void sendComposing({ to: inbound.replyToJid, accountId: inbound.accountId });
    }, TYPING_INTERVAL_MS);
  };
  
  const stopTypingLoop = () => {
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = undefined;
    }
  };

  try {
    // Defense-in-depth: verify outbound destination is allowed before any messaging
    try {
      assertOutboundAllowed({ to: inbound.replyToJid, accountId: inbound.accountId });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      debugLog(`[gateway] outbound BLOCKED: ${msg}`);
      console.log(msg);
      return;
    }

    await startTypingLoop();
    console.log(`Processing message with agent...`);
    debugLog(`[gateway] running agent for session=${route.sessionKey}`);
    const startedAt = Date.now();
    const { model, modelProvider } = resolveGatewayModel();
    const answer = await runAgentForMessage({
      sessionKey: route.sessionKey,
      query: inbound.body,
      model,
      modelProvider,
    });
    const durationMs = Date.now() - startedAt;
    debugLog(`[gateway] agent answer length=${answer.length} model=${model}`);
    
    // Stop typing loop before sending reply
    stopTypingLoop();

    if (answer.trim()) {
      // Clean up markdown for WhatsApp and reply
      const cleanedAnswer = cleanMarkdownForWhatsApp(answer);
      debugLog(`[gateway] sending reply to ${inbound.replyToJid}`);
      await sendMessageWhatsApp({
        to: inbound.replyToJid,
        body: `[Dexter] ${cleanedAnswer}`,
        accountId: inbound.accountId,
      });
      console.log(`Sent reply (${answer.length} chars, ${durationMs}ms)`);
      debugLog(`[gateway] reply sent`);
    } else {
      console.log(`Agent returned empty response (${durationMs}ms)`);
      debugLog(`[gateway] empty answer, not sending`);
    }
  } catch (err) {
    stopTypingLoop();
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`Error: ${msg}`);
    debugLog(`[gateway] ERROR: ${msg}`);
  }
}

async function handleLarkInbound(cfg: GatewayConfig, inbound: LarkInboundMessage): Promise<void> {
  const bodyPreview = elide(inbound.body.replace(/\n/g, ' '), 50);
  console.log(`[lark] Inbound message ${inbound.senderId} (${inbound.chatType}, ${inbound.body.length} chars): "${bodyPreview}"`);
  debugLog(`[lark] handleInbound from=${inbound.senderId} body="${inbound.body.slice(0, 30)}..."`);

  const route = resolveRoute({
    cfg,
    channel: 'lark',
    accountId: inbound.accountId,
    peer: { kind: inbound.chatType, id: inbound.senderId },
  });

  const storePath = resolveSessionStorePath(route.agentId);
  upsertSessionMeta({
    storePath,
    sessionKey: route.sessionKey,
    channel: 'lark',
    to: inbound.chatId,
    accountId: route.accountId,
    agentId: route.agentId,
  });

  try {
    console.log(`[lark] Processing message with agent...`);
    debugLog(`[lark] running agent for session=${route.sessionKey}`);
    const startedAt = Date.now();
    const { model, modelProvider } = resolveGatewayModel();
    const answer = await runAgentForMessage({
      sessionKey: route.sessionKey,
      query: inbound.body,
      model,
      modelProvider,
    });
    const durationMs = Date.now() - startedAt;
    debugLog(`[lark] agent answer length=${answer.length} model=${model}`);

    if (answer.trim()) {
      debugLog(`[lark] replying to message ${inbound.messageId}`);
      await replyMessageLark({
        messageId: inbound.messageId,
        body: `[Dexter] ${answer}`,
        accountId: inbound.accountId,
      });
      console.log(`[lark] Sent reply (${answer.length} chars, ${durationMs}ms)`);
      debugLog(`[lark] reply sent`);
    } else {
      console.log(`[lark] Agent returned empty response (${durationMs}ms)`);
      debugLog(`[lark] empty answer, not sending`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`[lark] Error: ${msg}`);
    debugLog(`[lark] ERROR: ${msg}`);
  }
}

export type GatewayChannels = 'whatsapp' | 'lark';

export async function startGateway(params: {
  configPath?: string;
  channels?: GatewayChannels[];
} = {}): Promise<GatewayService> {
  const enabledChannels = params.channels ?? ['whatsapp'];
  const loadCfg = () => loadGatewayConfig(params.configPath);
  const managers: Array<{ startAll: () => Promise<void>; stopAll: () => Promise<void>; getSnapshot: () => Record<string, any> }> = [];

  if (enabledChannels.includes('whatsapp')) {
    const whatsappPlugin = createWhatsAppPlugin({
      loadConfig: loadCfg,
      onMessage: async (inbound) => {
        await handleInbound(loadCfg(), inbound);
      },
    });
    const whatsappManager = createChannelManager({
      plugin: whatsappPlugin,
      loadConfig: loadCfg,
    });
    managers.push(whatsappManager);
  }

  if (enabledChannels.includes('lark')) {
    const larkPlugin = createLarkPlugin({
      loadConfig: loadCfg,
      onMessage: async (inbound) => {
        await handleLarkInbound(loadCfg(), inbound);
      },
    });
    const larkManager = createChannelManager({
      plugin: larkPlugin,
      loadConfig: loadCfg,
    });
    managers.push(larkManager);
  }

  for (const m of managers) {
    await m.startAll();
  }

  return {
    stop: async () => {
      for (const m of managers) {
        await m.stopAll();
      }
    },
    snapshot: () => {
      let result: Record<string, any> = {};
      for (const m of managers) {
        result = { ...result, ...m.getSnapshot() };
      }
      return result;
    },
  };
}


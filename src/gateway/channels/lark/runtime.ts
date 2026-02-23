import * as lark from '@larksuiteoapi/node-sdk';
import { setLarkClient } from './outbound.js';
import type { LarkInboundMessage } from './types.js';

export async function monitorLarkChannel(params: {
  accountId: string;
  appId: string;
  appSecret: string;
  encryptKey?: string;
  abortSignal: AbortSignal;
  onMessage: (msg: LarkInboundMessage) => Promise<void>;
  onStatus?: (status: { connected: boolean; lastError?: string | null }) => void;
}): Promise<void> {
  const client = new lark.Client({
    appId: params.appId,
    appSecret: params.appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
  });
  setLarkClient(params.accountId, client);

  const eventDispatcher = new lark.EventDispatcher({
    encryptKey: params.encryptKey ?? '',
  }).register({
    'im.message.receive_v1': async (data) => {
      try {
        const message = data.message;
        if (!message) return;

        const content = message.content ? JSON.parse(message.content) : {};
        const text = content.text ?? '';
        if (!text.trim()) return;

        const chatType = message.chat_type === 'p2p' ? 'direct' : 'group';
        let senderId = '';
        if (data.sender?.sender_id?.open_id) {
          senderId = data.sender.sender_id.open_id;
        }

        const inbound: LarkInboundMessage = {
          messageId: message.message_id ?? '',
          accountId: params.accountId,
          chatId: message.chat_id ?? '',
          chatType,
          senderId,
          senderName: data.sender?.sender_id?.open_id,
          body: text,
          timestamp: message.create_time ? Number(message.create_time) : undefined,
        };

        await params.onMessage(inbound);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[lark] Error processing message: ${msg}`);
      }
    },
  });

  const wsClient = new lark.WSClient({
    appId: params.appId,
    appSecret: params.appSecret,
    loggerLevel: lark.LoggerLevel.info,
  });

  params.onStatus?.({ connected: true, lastError: null });

  await wsClient.start({ eventDispatcher });

  // Keep alive until abort
  await new Promise<void>((resolve) => {
    const onAbort = () => {
      params.abortSignal.removeEventListener('abort', onAbort);
      setLarkClient(params.accountId, null);
      params.onStatus?.({ connected: false, lastError: null });
      resolve();
    };
    if (params.abortSignal.aborted) {
      onAbort();
      return;
    }
    params.abortSignal.addEventListener('abort', onAbort);
  });
}

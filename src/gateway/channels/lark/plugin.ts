import type { GatewayConfig, LarkAccountConfig } from '../../config.js';
import { listLarkAccountIds, resolveLarkAccount } from '../../config.js';
import type { ChannelPlugin } from '../types.js';
import { monitorLarkChannel, type LarkInboundMessage } from './index.js';

export function createLarkPlugin(params: {
  loadConfig: () => GatewayConfig;
  onMessage: (msg: LarkInboundMessage) => Promise<void>;
}): ChannelPlugin<GatewayConfig, LarkAccountConfig> {
  return {
    id: 'lark',
    config: {
      listAccountIds: (cfg) => listLarkAccountIds(cfg),
      resolveAccount: (cfg, accountId) => resolveLarkAccount(cfg, accountId),
      isEnabled: (account, cfg) => account.enabled && cfg.channels.lark.enabled !== false,
      isConfigured: async (account) => Boolean(account.appId && account.appSecret),
    },
    gateway: {
      startAccount: async (ctx) => {
        await monitorLarkChannel({
          accountId: ctx.accountId,
          appId: ctx.account.appId,
          appSecret: ctx.account.appSecret,
          encryptKey: ctx.account.encryptKey,
          abortSignal: ctx.abortSignal,
          onMessage: params.onMessage,
          onStatus: (status) => {
            ctx.setStatus({
              connected: status.connected,
              lastError: status.lastError ?? null,
            });
          },
        });
      },
    },
    status: {
      defaultRuntime: {
        accountId: 'default',
        running: false,
        connected: false,
        lastError: null,
      },
    },
  };
}

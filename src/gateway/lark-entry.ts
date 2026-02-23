#!/usr/bin/env tsx
import { loadGatewayConfig, saveGatewayConfig } from './config.js';
import { loginLark } from './channels/lark/login.js';
import { startGateway } from './gateway.js';

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] ?? 'run';

  if (command === 'login') {
    const result = await loginLark();
    const cfg = loadGatewayConfig();

    cfg.channels.lark.accounts ??= {};
    cfg.channels.lark.accounts['default'] = {
      accountId: 'default',
      enabled: true,
      appId: result.appId,
      appSecret: result.appSecret,
      encryptKey: result.encryptKey,
    };
    cfg.channels.lark.enabled = true;

    saveGatewayConfig(cfg);
    console.log('Lark account saved to gateway config.');
    return;
  }

  const server = await startGateway({ channels: ['lark'] });
  console.log('Dexter Lark gateway running. Press Ctrl+C to stop.');

  const shutdown = async () => {
    await server.stop();
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

void run();

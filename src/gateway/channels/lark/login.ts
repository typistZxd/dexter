import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const FEISHU_TOKEN_URL =
  'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';

export type LarkLoginResult = {
  appId: string;
  appSecret: string;
  encryptKey?: string;
};

async function promptCredentials(): Promise<LarkLoginResult> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const appId = (await rl.question('Lark App ID: ')).trim();
    if (!appId) throw new Error('App ID cannot be empty');

    const appSecret = (await rl.question('Lark App Secret: ')).trim();
    if (!appSecret) throw new Error('App Secret cannot be empty');

    const encryptKey = (await rl.question('Encrypt Key (optional, press Enter to skip): ')).trim();

    return { appId, appSecret, encryptKey: encryptKey || undefined };
  } finally {
    rl.close();
  }
}

async function verifyCredentials(appId: string, appSecret: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(FEISHU_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error while connecting to Lark API: ${msg}`);
  }

  const body = (await res.json()) as { code?: number; msg?: string; tenant_access_token?: string };

  if (body.code !== 0 || !body.tenant_access_token) {
    throw new Error(
      `Lark credential verification failed: ${body.msg ?? 'unknown error'} (code ${body.code ?? 'N/A'})`,
    );
  }
}

export async function loginLark(): Promise<LarkLoginResult> {
  const creds = await promptCredentials();
  console.log('Verifying credentials with Lark API...');
  await verifyCredentials(creds.appId, creds.appSecret);
  console.log('Lark credentials verified successfully.');
  return creds;
}

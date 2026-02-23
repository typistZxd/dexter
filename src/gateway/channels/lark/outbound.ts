import * as lark from '@larksuiteoapi/node-sdk';

const clients = new Map<string, lark.Client>();

export function setLarkClient(accountId: string, client: lark.Client | null): void {
  if (!client) {
    clients.delete(accountId);
    return;
  }
  clients.set(accountId, client);
}

function getClient(accountId?: string): lark.Client {
  if (accountId) {
    const found = clients.get(accountId);
    if (found) return found;
  }
  const first = clients.values().next().value as lark.Client | undefined;
  if (!first) {
    throw new Error('No active Lark client. Check lark config in gateway.json.');
  }
  return first;
}

export async function sendMessageLark(params: {
  chatId: string;
  body: string;
  accountId?: string;
}): Promise<{ messageId: string }> {
  const client = getClient(params.accountId);
  const res = await client.im.message.create({
    params: { receive_id_type: 'chat_id' },
    data: {
      receive_id: params.chatId,
      content: JSON.stringify({ text: params.body }),
      msg_type: 'text',
    },
  });
  const messageId = (res as any)?.data?.message_id ?? 'unknown';
  return { messageId };
}

export async function replyMessageLark(params: {
  messageId: string;
  body: string;
  accountId?: string;
}): Promise<{ messageId: string }> {
  const client = getClient(params.accountId);
  const res = await client.im.message.reply({
    path: { message_id: params.messageId },
    data: {
      content: JSON.stringify({ text: params.body }),
      msg_type: 'text',
    },
  });
  const replyId = (res as any)?.data?.message_id ?? 'unknown';
  return { messageId: replyId };
}

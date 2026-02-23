export type LarkInboundMessage = {
  messageId: string;
  accountId: string;
  chatId: string;
  chatType: 'direct' | 'group';
  senderId: string;
  senderName?: string;
  body: string;
  timestamp?: number;
};

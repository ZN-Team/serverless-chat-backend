export type Action =
  | "getClients"
  | "getMessages"
  | "sendMessage"
  | "$connect"
  | "$disconnect";

export interface Client {
  connectionId: string;
  nickname: string;
};

export interface SendMessageBody {
  recipientNickname: string;
  message: string;
}

export interface GetMessagesBody {
  targetNickname: string;
  startKey: AWS.DynamoDB.DocumentClient.Key | undefined;
  limit: number;
}

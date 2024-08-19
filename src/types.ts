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

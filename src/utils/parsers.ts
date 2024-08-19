import { GetMessagesBody, SendMessageBody } from "../types";
import { NICKNAME_SEPARATOR } from "./constants";
import { HandlerError } from "./errorHandler";

export const parseSendMessageBody = (body: string | null): SendMessageBody => {
  const sendMsgBody = JSON.parse(body || "{}") as SendMessageBody;

  if (!sendMsgBody || !sendMsgBody.recipientNickname || !sendMsgBody.message) {
    throw new HandlerError("invalid SendMessageBody");
  }

  return sendMsgBody;
};

export const parseGetMessageBody = (body: string | null): GetMessagesBody => {
  const getMessagesBody = JSON.parse(body || "{}") as GetMessagesBody;

  if (!getMessagesBody || !getMessagesBody.targetNickname || !getMessagesBody.limit) {
    throw new HandlerError("invalid GetMessageBody");
  }

  return getMessagesBody;
};

export const getNicknameToNickname = (nicknames: string[]): string => {
  // Sort the nicknames alphabetically and join them with a separator
  return nicknames.sort().join(NICKNAME_SEPARATOR);
};


import { GetMessagesBody, SendMessageBody } from '../types';
import { ROOM_ID_SEPARATOR } from './constants';
import { HandlerError } from './errorHandler';

export const parseSendMessageBody = (body: string | null): SendMessageBody => {
    const sendMsgBody = JSON.parse(body || '{}') as SendMessageBody;

    if (!sendMsgBody) {
        throw new HandlerError('Request body is missing or malformed.');
    }

    if (!sendMsgBody.recipientId) {
        throw new HandlerError('Recipient ID is missing in SendMessageBody.');
    }

    if (!sendMsgBody.messageContent) {
        throw new HandlerError('Message content is missing in SendMessageBody.');
    }

    return sendMsgBody;
};

export const parseGetMessageBody = (body: string | null): GetMessagesBody => {
    const getMessagesBody = JSON.parse(body || '{}') as GetMessagesBody;

    if (!getMessagesBody) {
        throw new HandlerError('Request body is missing or malformed.');
    }

    if (!getMessagesBody.targetId) {
        throw new HandlerError('Target ID is missing in GetMessagesBody.');
    }

    if (!getMessagesBody.limit) {
        throw new HandlerError('Limit is missing in GetMessagesBody.');
    }

    return getMessagesBody;
};

export const getRoomIdFromUserIds = (userIds: string[]): string => {
    // Sort the ids alphabetically and join them with a separator
    return userIds.sort().join(ROOM_ID_SEPARATOR);
};

import { GetMessagesBody, SendMessageBody } from '../types';
import { ROOM_ID_SEPARATOR } from './constants';
import { HandlerError } from './errorHandler';

export const parseSendMessageBody = (body: string | null): SendMessageBody => {
    const sendMsgBody = JSON.parse(body || '{}') as SendMessageBody;

    if (!sendMsgBody || !sendMsgBody.recipientId || !sendMsgBody.message) {
        throw new HandlerError('invalid SendMessageBody');
    }

    return sendMsgBody;
};

export const parseGetMessageBody = (body: string | null): GetMessagesBody => {
    const getMessagesBody = JSON.parse(body || '{}') as GetMessagesBody;

    if (!getMessagesBody || !getMessagesBody.targetId || !getMessagesBody.limit) {
        throw new HandlerError('invalid GetMessageBody');
    }

    return getMessagesBody;
};

export const getRoomIdFromUserIds = (userIds: string[]): string => {
    // Sort the ids alphabetically and join them with a separator
    return userIds.sort().join(ROOM_ID_SEPARATOR);
};

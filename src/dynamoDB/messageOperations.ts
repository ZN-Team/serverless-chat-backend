import { nanoid } from 'nanoid';
import { Client, GetMessagesBody, MessageItem, SendMessageBody } from '../types';
import { docClient } from '../utils/apiGateway';
import { MESSAGES_TABLE_NAME } from '../utils/constants';
import { getRoomIdFromUserIds } from '../utils/parsers';

export const createMessageItemFromSendMessageBody = (client: Client, body: SendMessageBody): MessageItem => {
    return {
        messageId: nanoid(),
        senderId: client.userId,
        createdAt: new Date().getTime(),

        messageContent: body.messageContent,
        roomId: getRoomIdFromUserIds([client.userId, body.recipientId]),
        mediaName: body.mediaName ?? '',
        mediaType: body.mediaType ?? '',
        mediaUrl: body.mediaUrl ?? '',
    };
};

export const saveMessage = async (client: Client, body: SendMessageBody) => {
    const messageItem: MessageItem = createMessageItemFromSendMessageBody(client, body);

    await docClient
        .put({
            TableName: MESSAGES_TABLE_NAME,
            Item: messageItem,
        })
        .promise();

    return messageItem;
};

export const getMessages = async (client: Client, body: GetMessagesBody) => {
    const output = await docClient
        .query({
            TableName: MESSAGES_TABLE_NAME,
            IndexName: 'RoomIdIndex',
            KeyConditionExpression: '#roomId = :roomId',
            ExpressionAttributeNames: { '#roomId': 'roomId' },
            ExpressionAttributeValues: {
                ':roomId': getRoomIdFromUserIds([client.userId, body.targetId]),
            },
            Limit: body.limit,
            ExclusiveStartKey: body.startKey,
            ScanIndexForward: false,
        })
        .promise();

    return {
        messages: output.Items?.length ? output.Items : [],
        lastEvaluatedKey: output.LastEvaluatedKey,
    };
};

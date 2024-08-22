import { v4 } from 'uuid';
import { Client, GetMessagesBody, SendMessageBody } from '../types';
import { docClient } from '../utils/apiGateway';
import { MESSAGES_TABLE_NAME } from '../utils/constants';
import { getRoomIdFromUserIds } from '../utils/parsers';

export const saveMessage = async (client: Client, body: SendMessageBody) => {
    const roomId = getRoomIdFromUserIds([client.userId, body.recipientId]);

    await docClient
        .put({
            TableName: MESSAGES_TABLE_NAME,
            Item: {
                messageId: v4(),
                roomId,
                content: body.content,
                senderId: client.userId,
                createdAt: new Date().getTime(),
            },
        })
        .promise();
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

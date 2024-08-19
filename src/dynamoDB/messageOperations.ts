import { v4 } from 'uuid';
import { Client, GetMessagesBody, SendMessageBody } from '../types';
import { docClient } from '../utils/apiGateway';
import { MESSAGES_TABLE_NAME } from '../utils/constants';
import { getNicknameToNickname } from '../utils/parsers';

export const saveMessage = async (client: Client, body: SendMessageBody) => {
    const nicknameToNickname = getNicknameToNickname([client.nickname, body.recipientNickname]);

    await docClient
        .put({
            TableName: MESSAGES_TABLE_NAME,
            Item: {
                messageId: v4(),
                nicknameToNickname,
                message: body.message,
                sender: client.nickname,
                createdAt: new Date().getTime(),
            },
        })
        .promise();
};

export const getMessages = async (client: Client, body: GetMessagesBody) => {
    const output = await docClient
        .query({
            TableName: MESSAGES_TABLE_NAME,
            IndexName: 'NicknameToNicknameIndex',
            KeyConditionExpression: '#nicknameToNickname = :nicknameToNickname',
            ExpressionAttributeNames: { '#nicknameToNickname': 'nicknameToNickname' },
            ExpressionAttributeValues: {
                ':nicknameToNickname': getNicknameToNickname([client.nickname, body.targetNickname]),
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

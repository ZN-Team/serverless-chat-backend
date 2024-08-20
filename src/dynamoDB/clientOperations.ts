import { Client } from '../types';
import { docClient, postToConnection } from '../utils/apiGateway';
import { CLIENTS_TABLE_NAME } from '../utils/constants';

// Add getClient function here
export const getClient = async (connectionId: string): Promise<Client> => {
    const output = await docClient
        .get({
            TableName: CLIENTS_TABLE_NAME,
            Key: { connectionId },
        })
        .promise();

    if (!output.Item) {
        throw new Error('Client does not exist'); // Can replace with HandlerError if necessary
    }

    return output.Item as Client;
};

export const addClient = async (connectionId: string, userId: string) => {
    await docClient.put({ TableName: CLIENTS_TABLE_NAME, Item: { connectionId, userId } }).promise();
};

export const removeClient = async (connectionId: string) => {
    await docClient.delete({ TableName: CLIENTS_TABLE_NAME, Key: { connectionId } }).promise();
};

export const getConnectionIdByUserId = async (userId: string): Promise<string | undefined> => {
    const output = await docClient
        .query({
            TableName: CLIENTS_TABLE_NAME,
            IndexName: 'UserIdIndex',
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeNames: { '#userId': 'userId' },
            ExpressionAttributeValues: { ':userId': userId },
        })
        .promise();

    return output.Items?.length ? output.Items[0].connectionId : undefined;
};

export const getAllClients = async (): Promise<Client[]> => {
    const output = await docClient.scan({ TableName: CLIENTS_TABLE_NAME }).promise();
    return output.Items as Client[];
};

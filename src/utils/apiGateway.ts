import AWS, { AWSError } from 'aws-sdk';
import { CLIENTS_TABLE_NAME } from './constants';

export const docClient = new AWS.DynamoDB.DocumentClient();

const apigw = new AWS.ApiGatewayManagementApi({
    endpoint: process.env.WSSAPIGATEWAYENDPOINT,
});

/**
 * Send a message to a connection, and delete the connection if it is no longer active.
 */
export const postToConnection = async (connectionId: string, messageBody: string): Promise<boolean> => {
    try {
        await apigw.postToConnection({ ConnectionId: connectionId, Data: messageBody }).promise();
        return true;
    } catch (e) {
        if ((e as AWSError).statusCode === 410) {
            await docClient.delete({ TableName: CLIENTS_TABLE_NAME, Key: { connectionId } }).promise();
            return false;
        } else {
            throw e;
        }
    }
};

/**
 * Send a message to multiple connections.
 * Iterates over a list of connection IDs and sends the message to each connection.
 * If a connection is no longer active, it is removed from the database.
 */
export const postMessageToMultipleConnections = async (connections: string[], message: string): Promise<void> => {
    const postCalls = connections.map(async connectionId => {
        try {
            await apigw
                .postToConnection({
                    ConnectionId: connectionId,
                    Data: message,
                })
                .promise();
        } catch (e) {
            if ((e as AWSError).statusCode === 410) {
                console.log(`Found stale connection, deleting ${connectionId}`);
                await docClient
                    .delete({
                        TableName: CLIENTS_TABLE_NAME,
                        Key: {
                            connectionId,
                        },
                    })
                    .promise();
            } else {
                console.error(`Failed to send message to ${connectionId}`, e);
            }
        }
    });

    await Promise.all(postCalls);
};

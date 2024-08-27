import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { docClient } from './utils/apiGateway';
import { DEFAULT_LIMIT, MESSAGES_TABLE_NAME } from './utils/constants';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const roomId = event.queryStringParameters?.roomId;
    const startTime = event.queryStringParameters?.startTime;
    const endTime = event.queryStringParameters?.endTime;
    const limit = event.queryStringParameters?.limit;

    if (!roomId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing roomId parameter' }),
        };
    }

    // Initialize ExpressionAttributeValues to ensure it is defined
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: MESSAGES_TABLE_NAME,
        IndexName: 'RoomIdIndex',
        KeyConditionExpression: 'roomId = :roomId',
        ExpressionAttributeValues: {
            ':roomId': roomId,
        },
        Limit: limit ? Number(limit) : DEFAULT_LIMIT,
    };

    // Initialize ExpressionAttributeValues if it is undefined
    if (!params.ExpressionAttributeValues) {
        params.ExpressionAttributeValues = {};
    }

    if (startTime && endTime) {
        params.KeyConditionExpression += ' AND createdAt BETWEEN :startTime AND :endTime';
        params.ExpressionAttributeValues[':startTime'] = Number(startTime);
        params.ExpressionAttributeValues[':endTime'] = Number(endTime);
    } else if (startTime) {
        params.KeyConditionExpression += ' AND createdAt >= :startTime';
        params.ExpressionAttributeValues[':startTime'] = Number(startTime);
    } else if (endTime) {
        params.KeyConditionExpression += ' AND createdAt <= :endTime';
        params.ExpressionAttributeValues[':endTime'] = Number(endTime);
    }

    try {
        // Execute the DynamoDB query
        const result = await docClient.query(params).promise();

        // Return the results
        return {
            statusCode: 200,
            body: JSON.stringify({
                messages: result.Items?.length ? result.Items : [],
                lastEvaluatedKey: result.LastEvaluatedKey,
            }),
        };
    } catch (error) {
        // Handle any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve messages', details: (error as Error).message }),
        };
    }
};

import AWS from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from "aws-lambda";
import { responseOK } from "./responses";
import { Action } from "./types";
import { CLIENTS_TABLE_NAME } from "./constants";

const docClient = new AWS.DynamoDB.DocumentClient();

export const handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const connectionId = event.requestContext.connectionId as string;

  const routeKey = event.requestContext.routeKey as Action;

  switch (routeKey) {
    case "$connect":
      return handleConnect(connectionId, event.queryStringParameters);

    case "$disconnect":
      return handleDisconnect(connectionId);

    default:
      return {
        statusCode: 500,
        body: "",
      };
  }
};

const handleConnect = async (
  connectionId: string,
  queryParameters: APIGatewayProxyEventQueryStringParameters | null
): Promise<APIGatewayProxyResult> => {
  if (!queryParameters || !queryParameters['nickname']) {
    return {
      statusCode: 403,
      body: "",
    }
  }

  await docClient
    .put({
      TableName: CLIENTS_TABLE_NAME,
      Item: {
        connectionId,
        nickname: queryParameters["nickname"],
      },
    })
    .promise();

  return responseOK;
};

const handleDisconnect = async (
  connectionId: string,
): Promise<APIGatewayProxyResult> => {
  await docClient
    .delete({
      TableName: CLIENTS_TABLE_NAME,
      Item: {
        connectionId,
      },
    })
    .promise();

  return responseOK;
};


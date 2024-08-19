import AWS, { AWSError } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult
} from "aws-lambda";
import { responseOK } from "./responses";
import { Action } from "./types";
import { CLIENTS_TABLE_NAME } from "./constants";

const docClient = new AWS.DynamoDB.DocumentClient();

const apigw = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.WSSAPIGATEWAYENDPOINT,
});

export const handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const connectionId = event.requestContext.connectionId as string;

  const routeKey = event.requestContext.routeKey as Action;

  switch (routeKey) {
    case "$connect":
      return handleConnect(connectionId, event.queryStringParameters);

    case "$disconnect":
      return handleDisconnect(connectionId);

    case "getClients":
      return handleGetClients(connectionId);

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

const isConnectionNotExistError = (e: unknown) =>
  (e as AWSError).statusCode === 410;

const postToConnection = async (
  connectionId: string,
  messageBody: string,
): Promise<boolean> => {
  try {
    await apigw
      .postToConnection({
        ConnectionId: connectionId,
        Data: messageBody,
      })
      .promise();

    return true;
  } catch (e) {
    if (isConnectionNotExistError(e)) {
      await docClient
        .delete({
          TableName: CLIENTS_TABLE_NAME,
          Key: {
            connectionId: connectionId,
          },
        })
        .promise();

      return false;
    } else {
      throw e;
    }
  }
};

const handleGetClients = async (connectionId: string): Promise<APIGatewayProxyResult> => {
  const output = await docClient
    .scan({
      TableName: CLIENTS_TABLE_NAME
    })
    .promise();

  const clients = output.Items ?? [];
  await postToConnection(
    connectionId,
    JSON.stringify({ type: "clients", value: clients })
  )

  return responseOK;
}


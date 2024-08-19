import AWS, { AWSError } from "aws-sdk";
import { CLIENTS_TABLE_NAME } from "./constants";

export const docClient = new AWS.DynamoDB.DocumentClient();
const apigw = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.WSSAPIGATEWAYENDPOINT,
});

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

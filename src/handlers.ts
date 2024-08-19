import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleConnect, handleDisconnect } from "./handlers/connectionHandlers";
import { handleGetClients } from "./handlers/clientHandlers";
import { handleSendMessage, handleGetMessages } from "./handlers/messageHandlers";
import { HandlerError } from "./utils/errorHandler";
import { responseOK, responseForbidden } from "./utils/constants";

export const handle = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId as string;
  const routeKey = event.requestContext.routeKey as string;

  try {
    switch (routeKey) {
      case "$connect":
        return handleConnect(connectionId, event.queryStringParameters);
      case "$disconnect":
        return handleDisconnect(connectionId);
      case "getClients":
        return handleGetClients(connectionId);
      case "sendMessage":
        return handleSendMessage(connectionId, event.body);
      case "getMessages":
        return handleGetMessages(connectionId, event.body);
      default:
        return responseForbidden;
    }
  } catch (e) {
    if (e instanceof HandlerError) {
      await postToConnection(connectionId, JSON.stringify({ type: "error", message: e.message }));
      return responseOK;
    }

    throw e;
  }
};

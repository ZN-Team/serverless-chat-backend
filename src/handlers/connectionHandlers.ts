import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { addClient, getConnectionIdByNickname, notifyClientChange, removeClient } from '../dynamoDB/clientOperations';
import { postToConnection } from '../utils/apiGateway';
import { responseForbidden, responseOK } from '../utils/constants';

export const handleConnect = async (
    connectionId: string,
    queryParameters: APIGatewayProxyEventQueryStringParameters | null
) => {
    if (!queryParameters || !queryParameters['nickname']) {
        return responseForbidden;
    }

    // TODO: Allow multiple connections with the same nickname
    const existingConnectionId = await getConnectionIdByNickname(queryParameters['nickname']);
    if (existingConnectionId && (await postToConnection(existingConnectionId, JSON.stringify({ type: 'ping' })))) {
        return responseForbidden;
    }

    await addClient(connectionId, queryParameters['nickname']);
    await notifyClientChange(connectionId);

    return responseOK;
};

export const handleDisconnect = async (connectionId: string) => {
    await removeClient(connectionId);
    await notifyClientChange(connectionId);

    return responseOK;
};

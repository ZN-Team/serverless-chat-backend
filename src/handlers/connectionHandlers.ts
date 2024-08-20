import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { addClient, getConnectionIdByUserId, removeClient } from '../dynamoDB/clientOperations';
import { postToConnection } from '../utils/apiGateway';
import { responseForbidden, responseOK } from '../utils/constants';

const USER_ID_QUERY_PARAM = 'userId';

export const handleConnect = async (
    connectionId: string,
    queryParameters: APIGatewayProxyEventQueryStringParameters | null
) => {
    const userId = queryParameters?.[USER_ID_QUERY_PARAM];
    if (!userId) {
        return responseForbidden;
    }

    // TODO: Allow multiple connections with the same user
    const existingConnectionId = await getConnectionIdByUserId(userId);
    if (existingConnectionId && (await postToConnection(existingConnectionId, JSON.stringify({ type: 'ping' })))) {
        return responseForbidden;
    }

    await addClient(connectionId, userId);

    return responseOK;
};

export const handleDisconnect = async (connectionId: string) => {
    await removeClient(connectionId);

    return responseOK;
};

import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { addClient, removeClient } from '../dynamoDB/clientOperations';
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

    await addClient(connectionId, userId);

    return responseOK;
};

export const handleDisconnect = async (connectionId: string) => {
    await removeClient(connectionId);

    return responseOK;
};

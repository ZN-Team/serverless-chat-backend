import { getAllClients } from '../dynamoDB/clientOperations';
import { postToConnection } from '../utils/apiGateway';
import { responseOK } from '../utils/constants';

export const handleGetClients = async (connectionId: string) => {
    const clients = await getAllClients();
    await postToConnection(connectionId, JSON.stringify({ type: 'clients', value: clients }));

    return responseOK;
};

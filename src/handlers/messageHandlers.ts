import { getClient, getConnectionIdByUserId } from '../dynamoDB/clientOperations';
import { getMessages, saveMessage } from '../dynamoDB/messageOperations';
import { postToConnection } from '../utils/apiGateway';
import { responseOK } from '../utils/constants';
import { parseGetMessageBody, parseSendMessageBody } from '../utils/parsers';

export const handleSendMessage = async (connectionId: string, body: string | null) => {
    const client = await getClient(connectionId);
    const sendMessageBody = parseSendMessageBody(body);

    await saveMessage(client, sendMessageBody);
    const recipientConnectionId = await getConnectionIdByUserId(sendMessageBody.recipientId);

    if (recipientConnectionId) {
        await postToConnection(
            recipientConnectionId,
            JSON.stringify({
                type: 'message',
                value: { senderId: client.userId, message: sendMessageBody.message },
            })
        );
    }

    return responseOK;
};

export const handleGetMessages = async (connectionId: string, body: string | null) => {
    const client = await getClient(connectionId);
    const getMessagesBody = parseGetMessageBody(body);

    const messages = await getMessages(client, getMessagesBody);

    await postToConnection(
        client.connectionId,
        JSON.stringify({
            type: 'messages',
            value: messages,
        })
    );

    return responseOK;
};

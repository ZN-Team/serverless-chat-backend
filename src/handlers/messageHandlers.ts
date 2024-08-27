import { getAllConnectionsByUserId, getClient } from '../dynamoDB/clientOperations';
import { getMessages, saveMessage } from '../dynamoDB/messageOperations';
import { postMessageToMultipleConnections, postToConnection } from '../utils/apiGateway';
import { responseOK } from '../utils/constants';
import { getRoomIdFromUserIds, parseGetMessageBody, parseSendMessageBody } from '../utils/parsers';

export const handleSendMessage = async (connectionId: string, body: string | null) => {
    const client = await getClient(connectionId);
    const sendMessageBody = parseSendMessageBody(body);

    const newMessage = await saveMessage(client, sendMessageBody);
    const recipientConnectionIds = await getAllConnectionsByUserId(sendMessageBody.recipientId);
    const otherConnectionIdsOfCurrentUser = await getAllConnectionsByUserId(client.userId);

    const connectionIdsToBeNotified = recipientConnectionIds
        ? [...recipientConnectionIds, ...otherConnectionIdsOfCurrentUser]
        : [];

    const {action, recipientId, ...messageToBeSent} = {
        ...sendMessageBody,
        ...newMessage,
    }

    if (connectionIdsToBeNotified) {
        const message = JSON.stringify({
            type: 'message',
            value: { senderId: client.userId, message: messageToBeSent },
        });

        await postMessageToMultipleConnections(connectionIdsToBeNotified, message);
    }

    return responseOK;
};

export const handleGetMessages = async (connectionId: string, body: string | null) => {
    const client = await getClient(connectionId);
    const getMessagesBody = parseGetMessageBody(body);

    const messages = await getMessages(client, getMessagesBody);
    const roomId = getRoomIdFromUserIds([client.userId, getMessagesBody.targetId]);

    await postToConnection(
        client.connectionId,
        JSON.stringify({
            type: 'messages',
            roomId,
            value: {
                roomId,
                ...messages,
            },
        })
    );

    return responseOK;
};

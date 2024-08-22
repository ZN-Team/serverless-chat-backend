export type Action = 'getMessages' | 'sendMessage' | '$connect' | '$disconnect';

export interface Client {
    connectionId: string;
    userId: string;
}

export interface SendMessageBody {
    recipientId: string;
    content: string;
}

export interface GetMessagesBody {
    targetId: string;
    startKey: AWS.DynamoDB.DocumentClient.Key | undefined;
    limit: number;
}

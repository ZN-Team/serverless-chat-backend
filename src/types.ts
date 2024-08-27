export type Action = 'getMessages' | 'sendMessage' | '$connect' | '$disconnect';

export interface Client {
    connectionId: string;
    userId: string;
}

export interface FileMetadata {
    fileId: string;
    fileName: string;
    fileType: string;
    downloadUrl: string;
}

export interface MessageItem {
    id: string;
    userId: string;
    createdAt: number;

    content: string;
    roomId: string;
    fileIds: string[];
    fileMetadata: { [fileId: string]: FileMetadata };
}

export interface SendMessageBody {
    recipientId: string;
    message: Omit<MessageItem, 'id' | 'userId' | 'createdAt'>;
}

export interface GetMessagesBody {
    targetId: string;
    startKey: AWS.DynamoDB.DocumentClient.Key | undefined;
    limit: number;
}

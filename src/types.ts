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
    messageId: string;
    roomId: string;
    messageContent: string;
    senderId: string;
    createdAt: number;
    mediaName: string;
    mediaType: string;
    mediaUrl: string;
}

export interface SendMessageBody {
    recipientId: string;
    messageContent: string;
    mediaName: string;
    mediaType: string;
    mediaUrl: string;
}

export interface GetMessagesBody {
    targetId: string;
    startKey: AWS.DynamoDB.DocumentClient.Key | undefined;
    limit: number;
}

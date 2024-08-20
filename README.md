# Serverless Chat Application

## Overview
The Serverless Chat Application is a real-time chat service built using the AWS Serverless stack. It leverages AWS Lambda, DynamoDB, and API Gateway (WebSocket) to provide a scalable, low-latency messaging platform.

## Project Structure

- **`serverless.yml`**: Serverless Framework configuration file.
- **`src/types.ts`**: TypeScript interfaces and types used across the application, including `Action`, `Client`, `SendMessageBody`, and `GetMessagesBody`.
- **`src/handlers.ts`**: Main entry point for Lambda functions, routing WebSocket events to the appropriate handlers based on the event's route key.
- **`src/dynamoDB/clientOperations.ts`**: Handles operations related to the `Clients` table in DynamoDB, such as adding, removing, and retrieving clients.
- **`src/dynamoDB/messageOperations.ts`**: Manages operations related to the `Messages` table in DynamoDB, including storing and retrieving messages.
- **`src/utils/errorHandler.ts`**: Custom error handling logic used throughout the application.
- **`src/utils/apiGateway.ts`**: Utilities for interacting with API Gateway, particularly for sending messages to connected clients.
- **`src/utils/parsers.ts`**: Functions for parsing and validating incoming WebSocket requests.
- **`src/utils/constants.ts`**: Constants used across the application, including predefined responses for API Gateway.
- **`src/handlers/messageHandlers.ts`**: Handles messaging-related WebSocket events, such as sending and retrieving messages.
- **`src/handlers/connectionHandlers.ts`**: Manages WebSocket connection events, including connecting and disconnecting clients.

## Setting Up the Project

### Prerequisites
- **Node.js**: Version 12.x or higher.
- **AWS CLI**: Configured with appropriate credentials.
- **Serverless Framework**: Install globally: `npm install -g serverless`.

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Deployment
Deploy the application to AWS:
```bash
serverless deploy
```

## Usage

### Connecting a Client
Use any user ID as string, in this example, I use uuid v4.

```javascript
const ws = new WebSocket('wss://your-api-gateway-endpoint?userId=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX');
ws.onopen = () => {
    // Do something such as loading messages
};
```

### Retrieving Messages
```javascript
ws.send(JSON.stringify({
    action: 'getMessages',
    // The target audience's ID
    targetId: 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY',
    // Pick any number that you liker
    limit: 10
}));
```

### Sending Messages
```javascript
ws.send(JSON.stringify({
    action: 'sendMessage',
    recipientId: 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY',
    content: 'Hello, Bob!'
}));
```

### Handling Disconnections
```javascript
ws.onclose = () => {
    console.log('Disconnected from the chat');
};
```

## Troubleshooting

### Common Issues
- **Deployment Failures**: Ensure AWS credentials have the necessary permissions.
- **Lambda Timeout**: Check the timeout in `serverless.yml` and optimize or increase as needed.
- **WebSocket Connection Issues**: Verify the API Gateway endpoint and client connection.

### Logs and Monitoring
View Lambda logs via AWS CloudWatch:
```bash
serverless logs -f functionName
```

## Contributing

### Code Standards
- Follow existing coding style and structure.
- Ensure all changes are well-tested.
- Submit a pull request with a clear description of changes.

### Reporting Issues
- Use the GitHub issues page to report bugs or request features.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

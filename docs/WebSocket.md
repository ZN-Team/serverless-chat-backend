# WebSocket Usage Guide

## Connecting a Client

Use any user ID as string, in this example, I use uuid v4.

```javascript
const ws = new WebSocket('wss://your-api-gateway-endpoint?userId=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX');
ws.onopen = () => {
    // Do something such as loading messages
};
```

## Retrieving Messages

```javascript
ws.send(
    JSON.stringify({
        action: 'getMessages',
        // The target audience's ID
        targetId: 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY',
        // Pick any number that you liker
        limit: 10,
    })
);
```

Afterward, the server sends back another websocket message containing those
messages that you need. You can get inspiration from the following code.

```ts
ws.onmessage = event => {
    const msg = JSON.parse(event.data) as {
        type: string;
        value: unknown;
    };

    if (msg.type === 'messages') {
        const body = msg.value as {
            messages: { senderId: string; content: string }[];
            lastEvaluatedKey: unknown;
        };

        // Do something with the above data
    }
};
```

## Sending Messages

```javascript
ws.send(
    JSON.stringify({
        action: 'sendMessage',
        recipientId: 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY',
        content: 'Hello, Bob!',
    })
);
```

After handling the new message successfully, the server sends a new message to
the recipient. See the following code on how to handle it.

```ts
ws.onmessage = event => {
    const msg = JSON.parse(event.data) as {
        type: string;
        value: unknown;
    };

    if (msg.type === 'message') {
        const item = msg.value as { senderId: string; content: string };

        // Do something with the newly received message
    }
};
```

### Handling Disconnections

```javascript
ws.onclose = () => {
    console.log('Disconnected from the chat');
};
```

# API Documentation

## Endpoints

### `GET /messages`

Retrieve messages from a specific chat room within a given time range.

#### Request

**Endpoint**:  
`GET /messages`

**Query Parameters**:

-   `roomId` (string, required)
-   `startTime` (number, optional)
-   `endTime` (number, optional)
-   `limit` (number, optional)

#### Example Request

```http
GET /messages?roomId=12345&startTime=1690588800&endTime=1690675200&limit=100
```

#### Response

```json
{
  "messages": [...],
  "lastEvaluatedKey": { ... }
}
```

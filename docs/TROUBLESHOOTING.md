# Troubleshooting

## Common Issues

### Deployment Failures

Ensure AWS credentials have the necessary permissions.

### Lambda Timeout

Check the timeout in `serverless.yml` and adjust if necessary.

### WebSocket Connection Issues

Verify the API Gateway endpoint and ensure the client is correctly configured.

## Logs and Monitoring

View Lambda logs via AWS CloudWatch:

```bash
serverless logs -f functionName
```

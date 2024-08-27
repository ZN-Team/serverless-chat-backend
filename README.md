# Serverless Chat Application

## Overview

The Serverless Chat Application is a real-time chat service built using the
AWS Serverless stack. It leverages AWS Lambda, DynamoDB, and API Gateway
(WebSocket) to provide a scalable, low-latency messaging platform.

## Quick Start

### Prerequisites

-   **Node.js**: Version 20.x or higher.
-   **AWS CLI**: Configured with appropriate credentials.
-   **Serverless Framework**: Install globally: `npm install -g serverless`.

### Installation

1. Clone the repository.
2. Install dependencies:

    ```bash
    npm install
    ```

3. Deploy the stack:

    ```bash
    serverless deploy
    ```

### Documentation

-   **[API Documentation](docs/API.md)**: Learn how to interact with the API endpoints.
-   **[WebSocket Guide](docs/WebSocket.md)**: Detailed guide on using WebSocket for real-time communication.
-   **[Setup Guide](docs/SETUP.md)**: Instructions for setting up the project locally.
-   **[Contribution Guidelines](docs/CONTRIBUTING.md)**: How to contribute to this project.
-   **[Troubleshooting](docs/TROUBLESHOOTING.md)**: Common issues and how to resolve them.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

# Customer Service Automation with n8n

This project implements an automated customer service workflow using n8n, featuring both chat and voice agent capabilities.

## Overview

The workflow provides:
- A chatbot agent for text-based customer service
- A voice agent for audio-based customer service
- Interaction logging for customer requests
- Webhook endpoints for integration with your applications

## Prerequisites

- Node.js (v14 or later)
- NPM
- OpenAI API key (for the chatbot and voice agent)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your environment:
   Create a `.env` file in the root directory with:
   ```
   N8N_ENCRYPTION_KEY=your-encryption-key
   OPENAI_API_KEY=your-openai-api-key
   ```

## Running the Workflow

1. Start n8n:
   ```
   npm start
   ```
2. Open n8n in your browser at `http://localhost:5678`
3. Go to the workflows section and activate the "Customer Service Automation" workflow

## Using the Customer Service API

### Chat Interface

Send a POST request to the webhook endpoint:

```
POST /webhook/customer-support
{
  "sessionId": "unique-session-id",
  "channel": "chat",
  "query": "How do I reset my password?",
  "callbackUrl": "https://your-app.com/api/chat-response"
}
```

### Voice Interface

Send a POST request to the webhook endpoint:

```
POST /webhook/customer-support
{
  "sessionId": "unique-session-id",
  "channel": "voice",
  "query": "I need help with my order status",
  "callbackUrl": "https://your-app.com/api/voice-response"
}
```

## Extending the Workflow

You can extend this workflow by:
1. Adding more AI models or services
2. Connecting to a database for persistent storage
3. Implementing authentication for the webhook
4. Adding sentiment analysis for customer interactions
5. Creating additional branches for specialized customer queries

## License

ISC 
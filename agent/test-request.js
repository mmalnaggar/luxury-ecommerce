#!/usr/bin/env node

const http = require('http');

// Configuration
const config = {
  host: 'localhost',
  port: 5678,
  path: '/webhook/customer-support',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

// Create a mock echo server to receive webhook callbacks
const mockServer = http.createServer((req, res) => {
  console.log(`\nReceived callback request to ${req.url}`);
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    console.log('Response data:', body);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'success' }));
  });
});

// Start the mock server on port 3000
mockServer.listen(3000, () => {
  console.log('Mock callback server running on port 3000');
  
  // Choose request type from command line args
  const requestType = process.argv[2] || 'chat';
  
  // Prepare request data
  const requestData = {
    sessionId: `session-${Date.now()}`,
    channel: requestType,
    query: requestType === 'chat' 
      ? 'How do I reset my password?' 
      : 'I need help with my order status',
    callbackUrl: 'http://localhost:3000/callback'
  };
  
  console.log(`\nSending ${requestType} request to n8n workflow:`);
  console.log(JSON.stringify(requestData, null, 2));
  
  // Make the request to the n8n webhook
  const req = http.request(config, (res) => {
    console.log(`\nResponse status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      if (responseData) {
        console.log('Response body:', responseData);
      }
      console.log('\nWaiting for callback response...');
      
      // Auto-close after 30 seconds if no callback received
      setTimeout(() => {
        console.log('\nNo callback received after 30s, exiting');
        mockServer.close();
        process.exit(0);
      }, 30000);
    });
  });
  
  req.on('error', (error) => {
    console.error(`Error making request: ${error.message}`);
    mockServer.close();
    process.exit(1);
  });
  
  // Send the request
  req.write(JSON.stringify(requestData));
  req.end();
});

console.log('Test script started');
console.log('Usage: node test-request.js [chat|voice]'); 
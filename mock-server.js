#!/usr/bin/env node
/**
 * Minimal mock server using Node.js built-in http module
 * IoT Ingestion on port 4010
 * AI Vision on port 4011
 */

const http = require('http');
const url = require('url');

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', chunk => { data += chunk; });
    request.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    request.on('error', reject);
  });
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}

// IoT Ingestion Server
const iotServer = http.createServer(async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (request.method === 'GET' && pathname === '/health') {
    return sendJson(response, 200, {
      status: 'ok',
      service: 'iot-ingestion',
      version: '0.3.0'
    });
  }

  if (request.method === 'POST' && pathname === '/readings') {
    try {
      const body = await parseBody(request);
      const { device_id, metric, value, timestamp } = body;

      if (!device_id || !metric || value === undefined || !timestamp) {
        return sendJson(response, 400, {
          type: 'https://smart-campus.local/problems/validation-error',
          title: 'Validation error',
          status: 400,
          detail: 'Missing required fields',
          instance: '/readings'
        });
      }

      const validMetrics = ['temperature', 'humidity', 'motion', 'smoke'];
      if (!validMetrics.includes(metric)) {
        return sendJson(response, 400, {
          type: 'https://smart-campus.local/problems/validation-error',
          title: 'Validation error',
          status: 400,
          detail: 'Invalid metric value',
          instance: '/readings'
        });
      }

      if (metric === 'temperature' && (value < -40 || value > 80)) {
        return sendJson(response, 400, {
          type: 'https://smart-campus.local/problems/value-out-of-range',
          title: 'Value out of range',
          status: 400,
          detail: 'temperature must be between -40 and 80',
          instance: '/readings'
        });
      }

      return sendJson(response, 201, {
        reading_id: 'R-' + Date.now(),
        device_id: device_id,
        metric: metric,
        accepted: true,
        created_at: new Date().toISOString()
      });
    } catch (e) {
      return sendJson(response, 400, { error: e.message });
    }
  }

  if (request.method === 'GET' && pathname === '/readings/latest') {
    const limit = parseInt(query.limit) || 10;
    if (limit < 1 || limit > 100) {
      return sendJson(response, 400, {
        type: 'https://smart-campus.local/problems/validation-error',
        title: 'Validation error',
        status: 400,
        detail: 'limit must be between 1 and 100',
        instance: '/readings/latest'
      });
    }

    return sendJson(response, 200, {
      items: [{
        reading_id: 'R-1',
        device_id: query.device_id || 'ESP32-LAB-A01',
        metric: 'temperature',
        value: 31.5,
        unit: 'celsius',
        timestamp: new Date().toISOString()
      }]
    });
  }

  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'Not found' }));
});

// AI Vision Server
const visionServer = http.createServer(async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;

  if (request.method === 'GET' && pathname === '/health') {
    return sendJson(response, 200, {
      status: 'ok',
      service: 'ai-vision',
      version: '0.3.0'
    });
  }

  if (request.method === 'POST' && pathname === '/detect') {
    try {
      const body = await parseBody(request);
      const { camera_id, image_url, image_base64 } = body;

      if (!camera_id || (!image_url && !image_base64)) {
        return sendJson(response, 400, {
          type: 'https://smart-campus.local/problems/invalid-image',
          title: 'Invalid image',
          status: 400,
          detail: 'image_url or image_base64 is required',
          instance: '/detect'
        });
      }

      return sendJson(response, 200, {
        detection_id: 'DET-' + Date.now(),
        camera_id: camera_id,
        label: 'person',
        confidence: 0.91,
        risk_level: 'medium'
      });
    } catch (e) {
      return sendJson(response, 400, { error: e.message });
    }
  }

  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'Not found' }));
});

iotServer.listen(4010, '0.0.0.0', () => {
  console.log('IoT Ingestion mock server running on port 4010');
});

visionServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port 4011 is already in use (likely by Prism). Skipping AI Vision mock.');
  } else {
    console.error('Vision mock server error:', err);
  }
});

visionServer.listen(4011, '0.0.0.0', () => {
  console.log('AI Vision mock server running on port 4011');
});

process.on('SIGINT', () => {
  console.log('Shutting down mock servers...');
  process.exit(0);
});

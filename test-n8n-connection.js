#!/usr/bin/env node

/**
 * Test script to verify n8n connection through Flask backend
 * Tests the complete flow: Frontend -> Flask Backend (5003) -> n8n (5678)
 */

const http = require('http');

console.log('🧪 Testing MediChat Bot n8n Connection\n');
console.log('=' .repeat(50));

// Test configuration
const tests = [
  {
    name: 'n8n Direct Webhook Test',
    host: 'localhost',
    port: 5678,
    path: '/webhook/chat/swasth-ai',
    method: 'POST',
    data: { message: 'test headache' }
  },
  {
    name: 'Flask Backend analyze/text endpoint',
    host: 'localhost',
    port: 5003,
    path: '/analyze/text',
    method: 'POST',
    data: { text: 'I have headache', use_n8n: true }
  }
];

function runTest(test) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(test.data);
    
    const options = {
      hostname: test.host,
      port: test.port,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    console.log(`\n📡 ${test.name}`);
    console.log(`   URL: http://${test.host}:${test.port}${test.path}`);
    console.log(`   Payload: ${postData}`);
    
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`   ✅ SUCCESS`);
          
          if (jsonData.finalResponse) {
            console.log(`   Response preview: ${jsonData.finalResponse.substring(0, 100)}...`);
          } else if (jsonData.prediction) {
            console.log(`   Response preview: ${jsonData.prediction.substring(0, 100)}...`);
          } else {
            console.log(`   Response: ${JSON.stringify(jsonData).substring(0, 100)}...`);
          }
          
          resolve({ success: true, test: test.name });
        } catch (e) {
          console.log(`   ✅ SUCCESS (non-JSON response)`);
          console.log(`   Response preview: ${data.substring(0, 100)}...`);
          resolve({ success: true, test: test.name });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ FAILED: ${error.message}`);
      resolve({ success: false, test: test.name, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`   ⏱️  TIMEOUT (30s)`);
      resolve({ success: false, test: test.name, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function runAllTests() {
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary\n');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach(r => {
    console.log(`   ${r.success ? '✅' : '❌'} ${r.test}`);
    if (r.error) console.log(`      Error: ${r.error}`);
  });
  
  console.log(`\n   Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! MediChat bot can now connect to n8n.\n');
    console.log('📝 Next steps:');
    console.log('   1. Open your browser to http://localhost:3001/test-ai (or /medibot)');
    console.log('   2. Type a health question (e.g., "I have a headache")');
    console.log('   3. The bot should respond with AI-generated health advice\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please check:');
    console.log('   • Flask backend is running on port 5003');
    console.log('   • n8n is running on port 5678');
    console.log('   • n8n workflow webhook is configured at /webhook/chat/swasth-ai\n');
  }
}

runAllTests().catch(console.error);

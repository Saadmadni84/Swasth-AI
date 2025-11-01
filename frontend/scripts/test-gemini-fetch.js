// Simple test using fetch to test Gemini API
const fs = require('fs');

// Read .env.local file
const envPath = require('path').resolve(__dirname, '../.env.local');
let apiKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=([^\n]+)/);
  apiKey = match ? match[1].trim() : '';
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message);
  process.exit(1);
}

if (!apiKey) {
  console.error('❌ Error: GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🔑 Found GEMINI_API_KEY:', apiKey.substring(0, 10) + '...');

// Test the API key by making a direct HTTP request
async function testApiKey() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;
  
  console.log('\n🚀 Sending test request to Gemini API...');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello Gemini! Please respond with a short test message.'
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Unknown error from API');
    }
    
    console.log('\n✅ Success! Gemini Response:');
    console.log(data.candidates[0].content.parts[0].text);
    
  } catch (error) {
    console.error('\n❌ Error connecting to Gemini API:');
    console.error(error.message);
    
    if (error.response) {
      const errorData = await error.response.json();
      console.error('API Error:', errorData);
    }
  }
}

testApiKey();

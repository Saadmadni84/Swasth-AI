const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testGeminiConnection() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY is not set in .env.local');
    return;
  }

  console.log('🔑 Found GEMINI_API_KEY:', apiKey.substring(0, 10) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('\n🚀 Sending test request to Gemini API...');
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: 'Hello Gemini! Please respond with a short test message.' }]
      }]
    });

    const response = await result.response;
    console.log('\n✅ Success! Gemini Response:');
    console.log(response.text());
    
  } catch (error) {
    console.error('\n❌ Error connecting to Gemini API:');
    console.error(error.message);
    
    if (error.response) {
      console.error('\nAPI Response:', error.response.data);
    }
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
  }
}

testGeminiConnection();

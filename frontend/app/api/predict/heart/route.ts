import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'age', 'sex', 'cp', 'trestbps', 'chol',
      'fbs', 'restecg', 'thalach', 'exang',
      'oldpeak', 'slope', 'ca', 'thal'
    ];
    
    const missingFields = requiredFields.filter(field => !(field in body));
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Try to connect to the ML backend
    const mlBackendUrls = [
      'http://127.0.0.1:5000/predict/heart',
      'http://localhost:5000/predict/heart'
    ];

    let lastError = '';
    
    for (const url of mlBackendUrls) {
      try {
        console.log(`Attempting to connect to ML backend at: ${url}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          // Add timeout
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`ML prediction successful: ${JSON.stringify(data)}`);
          
          return NextResponse.json(data, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          });
        } else {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
          console.error(`ML backend responded with error: ${lastError}`);
        }
      } catch (fetchError) {
        lastError = fetchError instanceof Error ? fetchError.message : 'Network error';
        console.error(`Failed to connect to ${url}:`, lastError);
        continue;
      }
    }

    // If we get here, all attempts failed
    return NextResponse.json(
      { 
        error: 'ML backend service unavailable', 
        details: lastError,
        troubleshooting: [
          'Make sure the ML backend is running on port 5000',
          'Run: cd ml-backend && python3 app.py',
          'Check that all required Python packages are installed'
        ]
      },
      { status: 503 }
    );

  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
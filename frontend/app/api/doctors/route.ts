import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { condition, location } = await request.json();
    
    if (!condition || !location) {
      return NextResponse.json(
        { error: 'Condition and location required' },
        { status: 400 }
      );
    }

    const teamApiKey = process.env.TEAM_API_KEY;
    const docModelId = process.env.DOC_MODEL_ID;

    if (!teamApiKey || !docModelId) {
      return NextResponse.json(
        { error: 'Missing required API keys' },
        { status: 500 }
      );
    }

    // Make API call to aiXplain doctor model
    const doctorResponse = await fetch('https://models.aixplain.com/api/v1/execute', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${teamApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: docModelId,
        data: {
          condition,
          location,
        },
      }),
    });

    if (!doctorResponse.ok) {
      throw new Error('Failed to get doctor recommendations');
    }

    const doctorData = await doctorResponse.json();
    
    // Process the response (convert from bytes if needed)
    let doctorsInfo = doctorData.data;
    if (typeof doctorsInfo === 'string') {
      try {
        // Handle encoding issues if present
        doctorsInfo = Buffer.from(doctorsInfo, 'latin1').toString('utf-8');
      } catch (error) {
        console.error('Encoding conversion failed:', error);
      }
    }

    return NextResponse.json({
      doctors: doctorsInfo,
    });

  } catch (error) {
    console.error('Error in /api/doctors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

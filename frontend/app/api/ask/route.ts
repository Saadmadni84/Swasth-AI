import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

// Helper functions (converted from Python backend)
function removeMarkdown(text: string): string {
  text = text.replace(/\*\*.*?\*\*/g, '');
  text = text.replace(/[\*\-] /g, '');
  text = text.replace(/[#\*_\[\]()]/g, '');
  text = text.replace(/\n+/g, '\n').trim();
  return text;
}

function formatText(text: string): string {
  const sections = text.split('\n');
  return sections
    .map(section => section.trim())
    .filter(section => section)
    .join('\n\n');
}

async function getAiXplainResponse(question: string): Promise<{ response: string; summary: string }> {
  const teamApiKey = process.env.TEAM_API_KEY;
  const summModelId = process.env.SUMM_MODEL_ID;
  const agentModelId = process.env.AGENT_MODEL_ID;

  if (!teamApiKey || !agentModelId) {
    throw new Error('Missing aiXplain API keys');
  }

  const outputLanguage = 'english';
  const formattedQuery = `${question} Response in ${outputLanguage}`;

  // Make API call to aiXplain
  const agentResponse = await fetch('https://models.aixplain.com/api/v1/execute', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${teamApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: agentModelId,
      data: formattedQuery,
    }),
  });

  if (!agentResponse.ok) {
    throw new Error('Failed to get response from aiXplain agent');
  }

  const agentData = await agentResponse.json();
  const formattedResponse = agentData.data?.output || 'No response available';
  const formResponse = removeMarkdown(formattedResponse);
  const agentAnswer = formatText(formResponse);

  // Get summary (if summary model is available)
  let summary = agentAnswer;
  if (summModelId) {
    try {
      const summResponse = await fetch('https://models.aixplain.com/api/v1/execute', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${teamApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: summModelId,
          data: {
            question,
            response: agentAnswer.replace(/\n/g, ' ').replace(/"/g, '\\"').replace(/'/g, "\\'"),
            language: outputLanguage,
          },
        }),
      });

      if (summResponse.ok) {
        const summData = await summResponse.json();
        const correctedText = summData.data || agentAnswer;
        const corrText = removeMarkdown(correctedText);
        summary = formatText(corrText);
      }
    } catch (error) {
      console.error('Summary generation failed:', error);
    }
  }

  return { response: agentAnswer, summary };
}

export async function POST(request: NextRequest) {
  try {
    const { question, useGemini = true } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'No question provided' },
        { status: 400 }
      );
    }

    let response: string;
    let summary: string;
    let source: string;

    // Try Gemini first if configured and requested
    if (useGemini && geminiService.isReady()) {
      try {
        response = await geminiService.generateHealthResponse(question);
        
        // Generate summary if response is long
        if (response.length > 300) {
          try {
            summary = await geminiService.generateSummary(response, 200);
          } catch (summaryError) {
            console.warn('Failed to generate Gemini summary:', summaryError);
            summary = response.substring(0, 200) + '...';
          }
        } else {
          summary = response;
        }
        
        source = 'gemini-2.0-flash';
      } catch (geminiError) {
        console.error('Gemini failed, falling back to aiXplain:', geminiError);
        
        // Fallback to aiXplain
        try {
          const aiXplainResult = await getAiXplainResponse(question);
          response = aiXplainResult.response;
          summary = aiXplainResult.summary;
          source = 'aixplain-fallback';
        } catch (aiXplainError) {
          console.error('Both AI services failed:', aiXplainError);
          return NextResponse.json(
            { error: 'AI services are currently unavailable. Please try again later.' },
            { status: 503 }
          );
        }
      }
    } else {
      // Use aiXplain directly
      try {
        const aiXplainResult = await getAiXplainResponse(question);
        response = aiXplainResult.response;
        summary = aiXplainResult.summary;
        source = 'aixplain';
      } catch (aiXplainError) {
        console.error('aiXplain failed:', aiXplainError);
        return NextResponse.json(
          { error: 'AI service is currently unavailable. Please try again later.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({
      response,
      summary,
      source,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in /api/ask:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

function cleanAndFormatResponse(rawResponse: string): string {
  let response = rawResponse;
  
  if (response.includes('data=')) {
    response = response.split('data=').pop()?.trim() || response;
  }
  
  response = response.replace(/^['"]|['"]$/g, '');
  
  try {
    // Try to parse if it's a literal string
    response = eval(`\`${response}\``);
  } catch (error) {
    // If parsing fails, use the original response
  }
  
  // Look for articles and summary pattern
  const regex = new RegExp('https?:\\/\\/\\S+\\nSource:.*?\\nDate: .*?\\n\\n', 'g');
  const match = response.match(regex);
  
  if (match) {
    const articlesEnd = response.indexOf(match[0]) + match[0].length;
    const articlesSection = response.substring(0, articlesEnd).trim();
    const summarySection = response.substring(articlesEnd).trim();
    
    const formattedArticles = articlesSection.replace(/\n{3,}/g, '\n\n');
    const formattedSummary = summarySection.replace(/\n{3,}/g, '\n\n');
    
    return `${formattedArticles}\n\n${'-'.repeat(100)}\n\n${formattedSummary}`;
  }
  
  return response.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { language } = await request.json();
    
    if (!language) {
      return NextResponse.json(
        { error: 'Language selection is required' },
        { status: 400 }
      );
    }

    const teamApiKey = process.env.TEAM_API_KEY;
    const newsModelId = process.env.NEWS_MODEL_ID;

    if (!teamApiKey || !newsModelId) {
      return NextResponse.json(
        { error: 'Missing required API keys' },
        { status: 500 }
      );
    }

    // Make API call to aiXplain news model
    const newsResponse = await fetch('https://models.aixplain.com/api/v1/execute', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${teamApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: newsModelId,
        data: {
          language,
        },
      }),
    });

    if (!newsResponse.ok) {
      throw new Error('Failed to get news');
    }

    const newsData = await newsResponse.json();
    const rawNews = newsData.data || newsData.toString();
    const formattedNews = cleanAndFormatResponse(rawNews);

    return NextResponse.json({
      news: formattedNews,
    });

  } catch (error) {
    console.error('Error in /api/news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

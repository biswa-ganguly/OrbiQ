import { NextResponse } from 'next/server';

export async function GET(request) {
  // Get the search query from the URL params
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('q');

  // Debug environment variables (remove in production)
  console.log('API Key exists:', !!process.env.GOOGLE_API_KEY);
  console.log('Search Engine ID exists:', !!process.env.GOOGLE_SEARCH_ENGINE_ID);

  if (!searchQuery) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // Using the environment variable names from your .env.local
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !cx) {
      return NextResponse.json({
        error: 'Google Search API key or Search Engine ID is not configured'
      }, { status: 500 });
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(searchQuery)}`;

    const response = await fetch(url);

    if (response.status === 429) {
      const errorData = await response.json();
      return NextResponse.json({
        error: 'API quota exceeded. Please try again later.',
        details: errorData.error?.message,
      }, { status: 429 });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google API error response:', errorData);
      throw new Error(`Google API returned ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Return the items array directly to match your existing component expectations
    return NextResponse.json(data.items || []);

  } catch (error) {
    console.error('Google Search API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch search results' }, { status: 500 });
  }
}

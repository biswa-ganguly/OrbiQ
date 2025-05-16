import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { searchInput, searchType } = await req.json();

    if (!searchInput) {
      return NextResponse.json(
        { error: "Please pass a search query" },
        { status: 400 }
      );
    }

    const encodedQuery = encodeURIComponent(searchInput);

    const result = await axios.get(
      `https://api.search.brave.com/res/v1/web/search?q=${encodedQuery}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": process.env.BRAVE_API_KEY,
        },
      }
    );

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}

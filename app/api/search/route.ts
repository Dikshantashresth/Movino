'use server';
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`, // keep secret
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Generic error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

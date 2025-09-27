"use server";

import axios from "axios";

export async function getSearchedMovie(name: string) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;

  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
}

// server/actions/getMovies.ts
import axios from "axios";

export const getMovies = async (endpoint: string) => {
  try {
    const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN; // server-side only

    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${endpoint}`,{params:{
        page:1,
        language:'en-us'
      },
      
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      }}
    );

    return res.data;
  } catch (err) {
    console.error("TMDB fetch error:", err);
    return null;
  }
};

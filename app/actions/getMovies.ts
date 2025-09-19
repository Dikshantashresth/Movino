// server/actions/getMovies.ts
import axios from "axios";
export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres?: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const getMovies = async (endpoint: string): Promise<MoviesResponse> => {
 
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

};

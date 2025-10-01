// server/actions/getMovies.ts
'use server'
import axios from "axios";
import { revalidatePath } from "next/cache";
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
  total_pages?: number;
  total_results?: number;
}

export const getMovies = async (endpoint: string): Promise<MoviesResponse> => {
 
    const token = process.env.TMDB_ACCESS_TOKEN; // server-side only

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
    revalidatePath(`/home/${endpoint}`);
    return res.data;

};

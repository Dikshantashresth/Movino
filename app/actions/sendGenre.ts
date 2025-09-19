

import axios from "axios";

const GENRE_MAP: Record<string, number> = {
  Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
  Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
  Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749,
  "Science Fiction": 878, "TV Movie": 10770, Thriller: 53,
  War: 10752, Western: 37
};

export async function sendMovies(genres:string[]){
    const genreIds = genres.map(g=>GENRE_MAP[g]).filter(Boolean).join(',');
    if (!genreIds) return [];
    console.log(genreIds)
    try{
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie',{
            params:{
                with_genres:genreIds,
                sort_by:"popularity.desc",
            },
            headers:{
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
                "Content-Type":"application/json"

            }
        })
        return response.data.results

    }catch(err){
        console.log(err)
    }
}
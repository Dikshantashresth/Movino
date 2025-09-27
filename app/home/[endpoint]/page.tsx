"use client";
import React, { useEffect, useState } from "react";
import { getMovies } from "@/app/actions/getMovies";
import MovieCard from "@/components/MovieCard";
import { useParams } from "next/navigation";
import { SkeletonCard } from "@/components/SkeletonCard";
export interface Genre {
  name: string;
  id: number;
}


export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres?: Genre[];
}

const Show = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setloading] = useState(false);
  const params = useParams();
  const endpoint = params.endpoint as string;

  useEffect(() => {
    if (endpoint === "now_playing") {
      setTitle("Latest");
    } else {
      setTitle(endpoint.charAt(0).toUpperCase() + endpoint.slice(1));
    }

    const fetchMovies = async () => {  
      setloading(true);
      try {
      
        const data = await getMovies(endpoint);
        if (data) {
        
          setMovies(data.results);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };

    fetchMovies();
  }, [endpoint]);

  if (loading) return <SkeletonCard/>;

  return (
    <div className="flex  flex-col">
      <div className="flex flex-wrap flex-col   h-full  ">
        <h1 className="text-2xl font-bold ">{title}</h1>
        <div className="gap-4 flex flex-row flex-wrap justify-center mt-4 ">
          {movies &&
            movies.map((movie) => (
              <div key={movie.id} className="w-[292px] ">
                <MovieCard item={movie} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Show;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import Backbutton from "@/components/Backbutton";
import {useRouter, useSearchParams } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
}

const Page = () => {
  const [query, setQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const router = useRouter();
  const [searchedMovie, setSearchedMovie] = useState<Movie[] | null>(null);

  const fetchMovies = async (q:string) => {
  

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSearchedMovie(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchedMovie([]);
    }
  };
  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(query)}`);
    fetchMovies(query);
  }
  useEffect(()=>{
    if(initialQuery){
      fetchMovies(initialQuery);
      
    }
  },[initialQuery])

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full">
        {/* Form wrapper */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 p-3 w-full sticky top-0 z-10"
        >
          <Backbutton />
          <Input
            placeholder="Search a movie..."
            className="flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">
            <Search />
          </Button>
        </form>
        <h1 className="ml-4">
          Showing results for:
          {searchedMovie && <span> {query}</span>}
        </h1>

        {/* Content */}
        <div className="text-white text-lg py-10 flex justify-center flex-row flex-wrap gap-4">
          {searchedMovie &&
            searchedMovie.map((i) => (
              <div key={i.id} className="w-[260px]">
                <MovieCard item={i} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;

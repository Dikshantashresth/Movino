'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { getSearchedMovie } from "../actions/getSearchMovie";
import MovieCard from "@/components/MovieCard";
import Backbutton from "@/components/Backbutton";

const Page = () => {
  const [query, setQuery] = useState<string>('');
  const [searchedMovie, setSearchedMovie] = useState<any[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page refresh
    const response = await getSearchedMovie(query);
    if (response) {
      setSearchedMovie(response.results);
      console.log(response.results);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full">
        {/* Form wrapper */}
        <form 
          onSubmit={handleSubmit} 
          className="flex items-center gap-3 p-3 w-full sticky top-0 z-10"
        >
          <Backbutton/>
          <Input 
            placeholder="Terminator" 
            className="flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)} 
          />
          <Button type="submit">
            <Search />
          </Button>
        </form>
        <h1 className="ml-4">Showing results for: {searchedMovie&&(query)}</h1>
        {/* Content */}
        <div className="text-white text-lg py-10 flex justify-center  flex-row flex-wrap gap-4">
          {searchedMovie && (searchedMovie.map((i)=>(
            <div key={i.id} className="w-[260px]">
            <MovieCard item={i}/></div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Page;

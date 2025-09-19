"use client";

import { useState, useEffect } from "react";
import { sendMovies } from "@/app/actions/sendGenre";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MovieData {
  id: number;
  backdrop_path: string;
  title: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
}

export default function MovieCarousel() {
  const searchParams = useSearchParams();
  const data = searchParams.get("genres");

  const [recommendations, setRecommendations] = useState<MovieData[]>([]);

  let genresArray: string[] = [];
  if (typeof data === "string") {
    try {
      genresArray = JSON.parse(data);
    } catch {
      genresArray = [];
    }
  }

  useEffect(() => {
    const fetchMovies = async () => {
      if (genresArray.length === 0) return;
      const response = await sendMovies(genresArray);
      if (response) {
        setRecommendations(response);
      }
    };
    fetchMovies();
  }, [data,genresArray]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Carousel className="w-full">
        <CarouselContent>
          {recommendations.map((i: MovieData) => (
            <CarouselItem key={i.id} className="basis-full">
              <Card className="overflow-hidden rounded-2xl relative">
                {/* Movie Image */}
                {i.backdrop_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/original${i.backdrop_path}`}
                    alt={i.title}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">No Image</span>
                  </div>
                )}

                {/* Overlay with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10 flex flex-col justify-end p-4 sm:p-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-white drop-shadow-md">
                    {i.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-200">
                    {i.release_date && <p>📅 {i.release_date}</p>}
                    {i.vote_average && (
                      <p>⭐ {i.vote_average.toFixed(1)} / 10</p>
                    )}
                  </div>
                  {i.overview && (
                    <p className="mt-2 text-sm sm:text-base text-gray-100 line-clamp-3">
                      {i.overview}
                    </p>
                  )}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

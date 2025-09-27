"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { SkeletonCard } from "@/components/SkeletonCard";
import Image from "next/image";
import { Bookmark, Calendar, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Backbutton from "@/components/Backbutton";

export interface Genre { name: string; id: number; }
interface CastMember { character: string; name: string; id: number; profile_path?: string; }
export interface Movie { id: number; title: string; poster_path: string; release_date: string; vote_average: number; overview: string; genres?: Genre[]; }

export default function DetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isMobile = useIsMobile();
  const [movie, setMovie] = useState<Movie>();
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const [movieres, castres] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
        ]);

        setMovie(movieres.data);
        setCast(castres.data.cast);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, token]);

  if (!id) return <p>No movie selected</p>;
  if (loading) return <SkeletonCard />;
  if (!movie) return <p>Movie not found</p>;

  const imageUrl = movie?.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "/placeholder.jpg";

  return (
    <div className={`p-6 flex gap-6 ${isMobile ? "flex-col" : "flex-row"} h-full min-h-screen`}>
      {/* Poster */}
      <Backbutton/>
      <div className={`${isMobile ? "w-full" : "w-1/3"} flex justify-center items-start`}>
        <div className="relative w-full max-w-[400px] aspect-[2/3] rounded-2xl overflow-hidden shadow-xl">
          <Image src={imageUrl} alt={movie?.title} fill priority className="object-cover" />
        </div>
      </div>
      {/* Details */}
      <div className={`flex ${isMobile ? "w-full" : "w-2/3"} flex-col px-3 gap-4 rounded-xl p-5 text-white`}>
        <h1 className="font-bold text-4xl text-black dark:text-white">{movie?.title}</h1>
        <div className="flex flex-row gap-4 text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {movie?.release_date}</span>
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {movie?.vote_average}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {movie?.genres?.map((g: Genre) => (
            <Badge key={g.id} variant="outline" className="cursor-pointer">{g.name}</Badge>
          ))}
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg border">
          <span className="font-bold text-xl block mb-2">Overview</span>
          <p className="text-gray-300">{movie?.overview}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg border">
          <span className="font-bold text-xl block mb-2">Cast</span>
          <div className="flex flex-wrap gap-2">
            {cast.slice(0, 10).map((actor) => (
              <Badge key={actor.id} className="px-3 py-1 cursor-pointer">{actor.character} — {actor.name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-auto">
          <Button className="flex-grow" variant="secondary"><Bookmark className="mr-2 h-4 w-4" />Save</Button>
          <Button className="flex-grow">Test</Button>
        </div>
      </div>
    </div>
  );
}

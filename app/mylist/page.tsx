"use client";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { toast } from "sonner";
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}
const MyList = () => {
  const supabase = createClient();
  const isMobile = useIsMobile();
  const [myList, setMyList] = useState<Movie[]>([]);
  const [loading,setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getlist = async () => {
      setLoading(true)
      const user = await supabase.auth.getUser();
      const userId = user?.data.user?.id;
      if (user) {
        const { data } = await supabase
          .from("saved_movies")
          .select("*")
          .eq("user_id", userId);
        if (data) {
          setLoading(false);
          setMyList(data);
          
        }
      }
    };
    getlist();
  }, [supabase]);
  const deleteMovie = async (id: number) => {
    
    const { error } = await supabase
      .from('saved_movies')
      .delete()
      .eq('id', id);
    // Optionally update state after deletion
    if (!error) { 
      toast("Deleted",{className:"bg-red-900"});
      setMyList((prev) => prev.filter((movie) => movie.id !== id));
    }
    setLoading(true);
  }
  if(myList.length===0) return <div>No Movies Added</div>
  if(loading) return <SkeletonCard/>
  return (
    <div>
      {myList.map((movie) => (
        <div
          key={movie.id}
          className={`bg-zinc-900 rounded-xl overflow-hidden shadow-lg flex ${isMobile?'flex-col':'flex-row'} hover:scale-105 transition-transform`}
        >
          <div className={`relative ${isMobile?'w-full':'w-[400px]'} h-[300px] aspect-[2/3]`}>
            <Image
              src={movie.poster_path}
              alt={movie.title}
              fill
              className="object-cover object-top"
      
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-white">{movie.title}</h2>
            <p className="text-gray-400 text-sm mt-1">{movie.release_date}</p>
            <p className="text-gray-300 text-sm mt-2 line-clamp-3 mb-3">
              {movie.overview}
            </p>
            <Button className="mt-auto pointer-cursor flex" variant={'destructive'} onClick={()=>deleteMovie(movie.id)}><Trash/>Delete</Button>
     
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyList;

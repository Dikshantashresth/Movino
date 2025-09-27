'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SkeletonCard } from './SkeletonCard';
interface MovieCardProps {
  item: {
    id: number;
    title: string;
    poster_path?: string;
    release_date?: string;
    vote_average?: number;
  };
}

const MovieCard = ({item}:MovieCardProps) => {
  const [loading,setloading] = useState<boolean>(false)
      const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w1280${item.poster_path}`
    : "/placeholder.jpg"; // fallback image
   const  router = useRouter();
    const handleClick = () => {
    setloading(true)
    router.push(`/details?id=${item.id}`);
  };
  if(loading) return <SkeletonCard/>
  return (
   <Card className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <CardContent className="p-0">
          <Image
            src={imageUrl}
            alt={item.title}
            width={300}
            height={450}
            className="w-full h-[350px] object-cover"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4">
          <h2 className="text-base font-semibold truncate">{item.title}</h2>
          <p className="text-sm text-gray-500">
            {item.release_date ? new Date(item.release_date).getFullYear() : "N/A"}
          </p>
          <span className="text-xs font-bold text-yellow-500 mt-1">
            ⭐ {item.vote_average?.toFixed(1) ?? "N/A"}
          </span>
          <Button className='bg-blue-600 mt-2' onClick={handleClick}><Info/> Details</Button>
        </CardFooter>
      </Card>
  )
}

export default MovieCard
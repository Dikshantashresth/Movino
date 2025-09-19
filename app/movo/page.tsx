"use client";
import { Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { getMood } from "../actions/getMood";
import { useRouter } from "next/navigation";


export default function Page() {
  const [Mood, setMood] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleClick = async () => {
    setLoading(true);
    const data: string[] = await getMood(Mood);
    console.log(data)
    setMood("");
    
    if (data) {
      router.push(`/movo/movies?genres=${data}`);
    }
  };
  if (loading) return <SkeletonCard />;
  return (
    <>
      <div className="flex flex-row gap-2 ">
        <Bot size={40} />
        <div className="flex flex-row">
          <h1 className="font-extrabold text-4xl text-blue-700">Mo</h1>
          <h1 className="font-extrabold text-4xl">vo</h1>
        </div>
      </div>
      <div className="mt-3 flex-row flex gap-3  md:w-[500px]">
        <Input
          placeholder="Enter your mood"
          className="max-w-[600px] h-[50px]"
          value={Mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <Button
          onClick={handleClick}
          className="bg-blue-700 text-white hover:bg-blue-800 hover:border h-[50px]"
        >
          Send
        </Button>
      </div>
    </>
  );
}

"use client"
import { createClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const protect = async () => {
      const superbase = createClient();
      const { data } = await superbase.auth.getClaims();
      const user = data?.claims;
      if (user) {
        router.push("/home/now_playing");
      }
      else{
        router.push("/home/now_playing");
      }
    };
    protect();
  }, [router]);

  return (
    <>
    </>
  );
}

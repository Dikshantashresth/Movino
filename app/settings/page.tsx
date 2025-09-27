"use client";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { User2Icon } from "lucide-react";
import Image from "next/image";

import React, { useEffect, useState } from "react";

const Settings = () => {
  interface userdata {
    email: string;
    avatar_url: string | null;
    username: string;
  }
  const supabase = createClient();
  const [userData, setuserData] = useState<userdata | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      console.log(profile);
      setuserData(profile);
    };
    fetchUserData();
  }, []);
  return (
    <div>
      <Card className="p-3">
        <CardTitle>Profile</CardTitle>
        <CardContent className="mt-2">
          {userData ? (
            <div className="flex gap-3">
              <div className="">
                {userData?.avatar_url==null?<User2Icon  className="dark:bg-slate-900 rounded-full" size={40}/>:(<Image alt="profile Picture" width={500} height={400} src={userData?.avatar_url}/>)}
              </div>
              <div className="flex flex-col">
                <span>
                  {userData?.username == null ? "user" : userData?.username}
                </span>
                <span>{userData?.email}</span>
              </div>
            </div>
          ) : (
            <SkeletonCard />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

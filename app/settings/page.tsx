"use client";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";

import { User2Icon } from "lucide-react";
import Image from "next/image";

import React, { useEffect, useState } from "react";

const Settings = () => {
  interface userdata {
    id: string;
    email: string;
    avatar_url: string | null;
    username: string;
  }
  const supabase = createClient();
  const [userData, setuserData] = useState<userdata | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
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

  const uploadAvatar = async (file: File) => {
    if (!file || !userData?.id) return null;
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/gi, "_"); // only letters, numbers, _ . - allowed

    // Fixed path for each user, optionally include sanitizedName if you want
    const filePath = `${userData.id}/avatar_${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true, cacheControl: "max-age-0" });

    if (error && !data) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("images")
      .createSignedUrl(filePath, 60 * 60);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL error:", signedUrlError?.message);
      return null;
    }

    return signedUrlData.signedUrl;
  };
  const handleSaveChanges = async () => {
    let avatar_url = userData?.avatar_url;

    if (avatarFile) {
      const uploadedUrl = await uploadAvatar(avatarFile);
      if (uploadedUrl) avatar_url = uploadedUrl;
    }
    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({ avatar_url })
      .eq("id", userData?.id)
      .select()
      .single();

    if (error) {
      console.error("Update profile error:", error.message);
      return;
    }

    setuserData(updatedProfile);
  };

  return (
    <div>
      <Card className="p-3">
        <CardTitle>Profile</CardTitle>
        <CardContent className="mt-2">
          {userData ? (
            <div className="flex gap-3">
              <div className="">
                {userData?.avatar_url == null ? (
                  <User2Icon
                    className="dark:bg-slate-900 rounded-full"
                    size={40}
                  />
                ) : (
                  <Image
                    src={`${userData.avatar_url}`}
                    width={100}
                    height={100}
                    alt="avatar"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span>
                  {userData?.username == null ? "user" : userData?.username}
                </span>
                <span>{userData?.email}</span>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                      <label htmlFor="sheet-demo-username">Username</label>
                      <Input
                        id="sheet-demo-username"
                        defaultValue={`${userData?.username}`}
                      />
                    </div>
                    <div className="grid gap-3">
                      <label htmlFor="sheet-demo-username">Upload avatar</label>
                      <Input
                        onChange={(e) =>
                          setAvatarFile(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        type="file"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button type="submit" onClick={handleSaveChanges}>
                      Save changes
                    </Button>
                    <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
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

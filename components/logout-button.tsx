"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface collapseprop{
  collapse:boolean
}
export function LogoutButton({collapse}:collapseprop) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout} className="transition-all duration-1000" > <LogOut/> {!collapse&&"Logout"}</Button>;
}

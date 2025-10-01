"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Home, Search, Settings, Flame, BotIcon, Lock, Menu, X, Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { createClient } from "@/lib/supabase/client"; 
import { useIsMobile } from "@/hooks/use-mobile";
import type { User } from "@supabase/supabase-js";
import { ThemeSwitcher } from "./theme-switcher";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  url: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, url }) => (
  <Link href={url}>
    <div className="flex items-center gap-4 p-2 hover:bg-zinc-900 hover:text-white rounded cursor-pointer">
      {icon}
      <span className={`text-sm font-medium`}>{label}</span>
    </div>
  </Link>
);

export const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}> = ({ collapsed, setCollapsed }) => {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const  isMobile  = useIsMobile();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true); // collapse on mobile
      setMobileOpen(false); // hide sidebar by default
    }
  }, [isMobile, setCollapsed]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(initialUser ?? null);
      } catch {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setUser(session?.user ?? null);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      try { subscription?.unsubscribe?.(); } catch {}
    };
  }, [supabase]);

  const menuItems = [
    { icon: <Home size={20} />, label: "Home", url: "/home/now_playing" },
    { icon: <Search size={20} />, label: "Search", url: "/search" },
    { icon: <Flame size={20} />, label: "Popular", url: "/home/popular" },
    { icon: <BotIcon size={20} />, label: "Movo", url: "/movo" },
    {icon: <Bookmark size={20}/>,label:"WatchList", url:'/mylist'},
    { icon: <Settings size={20} />, label: "Settings", url: "/settings" },
  ];

  // Sidebar classes
  const baseSidebarClasses = `h-screen shadow-md p-3 fixed top-0 left-0 flex flex-col transition-all duration-300 border border-r `;
  const desktopWidth = collapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className={`fixed top-4 left-5  bg-blue-600 p-2 rounded text-white `}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${baseSidebarClasses} ${isMobile ? "bg-white dark:bg-zinc-950 z-40  w-64 transform transition-transform duration-300 " : desktopWidth} ${
          isMobile
            ? mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : ""
        }`}
      >
        {/* Header */}
        <div className="flex justify-between gap-3">
          <h1 className={`font-extrabold text-2xl ${collapsed && !isMobile ? "hidden" : ""}`}>
            Movino
          </h1>

          {!collapsed&&<ThemeSwitcher/>}
          {!isMobile ? (
              <button
              onClick={() => setCollapsed(!collapsed)}
              className="mb-6 self-end px-2 py-1 rounded transition bg-blue-600"
            >
              {collapsed ? "→" : "←"}
            </button>
          ):(<button onClick={()=>setMobileOpen(false)}><X/></button>)}
          
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={(!collapsed || (isMobile && mobileOpen)) ? item.label : ""}
              url={item.url}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto">
          {user ? (
            <LogoutButton collapse={collapsed} />
          ) : (
            <Link href="/auth/login">
              <Button>
                <Lock />
                {!collapsed ? "Login" : ""}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Overlay on mobile when sidebar is open */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

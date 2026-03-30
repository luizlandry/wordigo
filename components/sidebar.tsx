// components/sidebar.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebaritem } from "./sidebar-item";

type Props = {
  className?: string;
};

const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
          <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
            <Image src="/mascot1.svg" height={40} width={40} alt="Mascot" />
            <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
              Wordigo
            </h1>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-y-2 flex-1">
        <Sidebaritem
          label="Learn"
          href="/learn"
          iconSrc="/learn.svg"
        />
        <Sidebaritem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <Sidebaritem
          label="Quests"
          href="/quests"
          iconSrc="/quests.svg"
        />
        <Sidebaritem
          label="Shop"
          href="/shop"
          iconSrc="/shop.svg"
        />
        <Sidebaritem
          label="My Progress"
          href="/dashboard"
          iconSrc="/points.svg"
        />
        {/* ✅ NEW: Settings link for Pro subscription management */}
        <Sidebaritem
          label="Settings"
          href="/settings"
          iconSrc="/setting.svg"
        />
      </div>

      <div className="p-4">
        <ClerkLoading>
          {/* ✅ Fix: "animate=spin" → "animate-spin" */}
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default Sidebar;
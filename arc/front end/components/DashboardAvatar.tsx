import { useState } from "react";

type SessionUser = { name?: string; avatarUrl?: string; profileImage?: string };

function readUser(): SessionUser | null {
  try {
    const session = JSON.parse(window.localStorage.getItem("arc.session") ?? "null") as { user?: SessionUser } | null;
    return session?.user ?? null;
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "A";
}

export default function DashboardAvatar() {
  const [user] = useState<SessionUser | null>(() => readUser());
  const imageUrl = user?.avatarUrl ?? user?.profileImage;
  const label = user?.name ? `${user.name} profile` : "User profile";
  return <div role="img" aria-label={label} title={label} className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-400 bg-[#f5b544] text-[15px] font-extrabold text-[#1c1c1c]">
    {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : initials(user?.name ?? "Arc user")}
  </div>;
}

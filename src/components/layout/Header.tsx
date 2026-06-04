"use client";

import { useState } from "react";
import { useAdmin } from "@/providers/AdminProvider";

interface HeaderProps {
  name: string;
  avatar: string;
}

export function Header({ name, avatar }: HeaderProps) {
  const { isAdmin, enterAdmin, exitAdmin } = useAdmin();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="max-w-[90rem] mx-auto px-3 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-apple-accent/20 to-purple-400/20 flex items-center justify-center text-sm">
              👤
            </div>
          )}
          <span className="font-semibold text-sm text-apple-text">{name}</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-apple-accent/10 text-apple-accent">
                管理员模式
              </span>
              <button
                onClick={exitAdmin}
                className="text-xs text-apple-muted hover:text-apple-danger transition-colors px-2 py-1"
              >
                退出
              </button>
            </>
          ) : (
            <button
              onClick={enterAdmin}
              className="text-xs text-apple-muted hover:text-apple-accent transition-colors px-2 py-1"
              title="进入管理员模式"
            >
              ⚙ 管理
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

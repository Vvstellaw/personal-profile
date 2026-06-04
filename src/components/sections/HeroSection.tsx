"use client";

import type { HeroData } from "@/lib/types";

interface HeroSectionProps {
  hero: HeroData;
}

const iconMap: Record<string, string> = {
  github: "🔗",
  twitter: "🐦",
  email: "📧",
  website: "🌐",
  linkedin: "💼",
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 md:py-28 relative">
      {/* Subtle decorative ring behind avatar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-amber-300/5 blur-2xl pointer-events-none" />

      {/* Avatar */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-blue-400/20 via-purple-400/20 to-amber-300/20 blur-md animate-pulse"
          style={{ animationDuration: '4s' }} />
        {hero.avatar ? (
          <img
            src={hero.avatar}
            alt={hero.name}
            className="relative w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-white/60 shadow-2xl"
          />
        ) : (
          <div className="relative w-28 h-28 rounded-full mx-auto bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-300/30 flex items-center justify-center text-4xl ring-4 ring-white/60 shadow-2xl">
            👤
          </div>
        )}
      </div>

      {/* Name with gradient */}
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-[#1d1d1f] via-[#3d3d4f] to-[#1d1d1f] bg-clip-text text-transparent">
        {hero.name}
      </h1>

      {/* Title */}
      <p className="text-xl md:text-2xl font-medium bg-gradient-to-r from-[#86868b] to-[#6e6e73] bg-clip-text text-transparent mb-6">
        {hero.title}
      </p>

      {/* Bio */}
      {hero.bio && (
        <p className="text-base text-[#86868b] leading-relaxed max-w-lg mx-auto mb-8">
          {hero.bio}
        </p>
      )}

      {/* Social Links */}
      {hero.socialLinks.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          {hero.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md hover:bg-white/90 text-[#1d1d1f] text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span>{iconMap[link.platform] || "🔗"}</span>
              <span className="hidden sm:inline">{link.platform}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

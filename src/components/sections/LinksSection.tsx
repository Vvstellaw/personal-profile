"use client";

import type { Section, LinkItem } from "@/lib/types";

interface LinksSectionProps {
  section: Section;
}

const platformIcons: Record<string, string> = {
  github: "🔗",
  twitter: "🐦",
  email: "📧",
  website: "🌐",
  linkedin: "💼",
};

export function LinksSection({ section }: LinksSectionProps) {
  const items = section.items.filter((i) => i.type === "link") as LinkItem[];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 hover:bg-black/10 text-apple-text text-sm font-medium transition-colors"
        >
          <span>{platformIcons[item.platform] || "🔗"}</span>
          <span>{item.label}</span>
        </a>
      ))}
      {items.length === 0 && (
        <p className="text-apple-muted text-sm italic">
          暂无链接。在管理员模式下添加。
        </p>
      )}
    </div>
  );
}

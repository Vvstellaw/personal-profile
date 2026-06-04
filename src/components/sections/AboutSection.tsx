"use client";

import type { Section } from "@/lib/types";

interface AboutSectionProps {
  section: Section;
}

export function AboutSection({ section }: AboutSectionProps) {
  return (
    <div className="space-y-3">
      {section.items.map((item) => {
        if (item.type !== "text") return null;
        return (
          <p
            key={item.id}
            className="text-apple-text leading-relaxed whitespace-pre-line"
          >
            {item.content}
          </p>
        );
      })}
      {section.items.length === 0 && (
        <p className="text-apple-muted text-sm italic">
          暂无内容。在管理员模式下添加。
        </p>
      )}
    </div>
  );
}

"use client";

import type { Section, AIProjectItem } from "@/lib/types";

interface AIProjectsSectionProps {
  section: Section;
}

export function AIProjectsSection({ section }: AIProjectsSectionProps) {
  const items = section.items.filter(
    (i) => i.type === "ai-project"
  ) as AIProjectItem[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.linkUrl || "#"}
          target={item.linkUrl ? "_blank" : undefined}
          rel={item.linkUrl ? "noopener noreferrer" : undefined}
          className="block group"
        >
          <div className="bg-white rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full">
            {/* Screenshot */}
            {item.screenshot ? (
              <img
                src={item.screenshot}
                alt={item.title}
                className="w-full h-36 object-cover rounded-xl mb-3"
              />
            ) : (
              <div className="w-full h-36 rounded-xl bg-gradient-to-br from-apple-accent/10 to-purple-400/10 flex items-center justify-center mb-3">
                <span className="text-3xl">🚀</span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-apple-text mb-1 group-hover:text-apple-accent transition-colors">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-apple-muted leading-relaxed mb-3 line-clamp-2">
              {item.description}
            </p>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-apple-accent/10 text-apple-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </a>
      ))}
      {items.length === 0 && (
        <p className="text-apple-muted text-sm italic col-span-full">
          暂无项目。在管理员模式下添加。
        </p>
      )}
    </div>
  );
}

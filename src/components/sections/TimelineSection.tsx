"use client";

import { useRef } from "react";
import type { Section, TimelineEventItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TimelineSectionProps {
  section: Section;
}

const categoryColors: Record<string, string> = {
  milestone: "bg-apple-accent",
  project: "bg-purple-500",
  learning: "bg-green-500",
};

const categoryLabels: Record<string, string> = {
  milestone: "里程碑",
  project: "项目",
  learning: "学习",
};

export function TimelineSection({ section }: TimelineSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = section.items.filter(
    (i) => i.type === "timeline-event"
  ) as TimelineEventItem[];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Scroll Arrows */}
      {items.length > 2 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-apple-muted hover:text-apple-text transition-colors hidden md:flex"
          >
            ‹
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-apple-muted hover:text-apple-text transition-colors hidden md:flex"
          >
            ›
          </button>
        </>
      )}

      {/* Timeline Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
      >
        {/* Connecting line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-black/5 hidden md:block" />

        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-56 snap-center relative"
          >
            {/* Dot on timeline */}
            <div className="hidden md:flex items-center justify-center mb-4">
              <div
                className={`w-3 h-3 rounded-full ${categoryColors[item.category] || "bg-apple-muted"} ring-4 ring-white z-10`}
              />
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <span className="text-xs text-apple-muted">
                {formatDate(item.date)}
              </span>
              <span
                className={`ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white ${categoryColors[item.category] || "bg-apple-muted"}`}
              >
                {categoryLabels[item.category] || item.category}
              </span>

              <h3 className="font-semibold text-apple-text mt-2 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-apple-muted leading-relaxed">
                {item.description}
              </p>

              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="mt-2 w-full h-24 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-apple-muted text-sm italic">
            暂无学习记录。在管理员模式下添加。
          </p>
        )}
      </div>
    </div>
  );
}

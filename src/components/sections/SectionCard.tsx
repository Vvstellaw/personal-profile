"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/providers/AdminProvider";
import type { Section } from "@/lib/types";

interface SectionCardProps {
  section: Section;
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
}

export function SectionCard({
  section,
  children,
  onEdit,
  onDelete,
  onToggleVisibility,
}: SectionCardProps) {
  const { isAdmin, isPreview } = useAdmin();
  const showAdmin = isAdmin && !isPreview;

  return (
    <div
      className={cn(
        "relative bg-white/70 backdrop-blur-2xl rounded-3xl h-full overflow-auto transition-all duration-500",
        "shadow-[0_2px_20px_-6px_rgba(0,0,0,0.06),0_0_0_0.5px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.06)]",
        showAdmin && "animate-wiggle",
        !section.visible && showAdmin && "opacity-50 grayscale"
      )}
    >
      {/* Admin Controls */}
      {showAdmin && (
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
          <button
            onClick={onToggleVisibility}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-xs text-apple-muted hover:text-apple-text transition-colors"
            title={section.visible ? "隐藏" : "显示"}
          >
            {section.visible ? "👁" : "👁‍🗨"}
          </button>
          <button
            onClick={onEdit}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-xs text-apple-muted hover:text-apple-accent transition-colors"
            title="编辑"
          >
            ✎
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-xs text-apple-muted hover:text-apple-danger transition-colors"
            title="删除"
          >
            🗑
          </button>
        </div>
      )}

      {/* Section Title */}
      {section.title && (
        <h2 className="text-xl font-semibold text-apple-text px-6 pt-6 pb-0">
          {section.title}
        </h2>
      )}

      {/* Content */}
      <div className="p-6 pt-3 h-full">{children}</div>
    </div>
  );
}

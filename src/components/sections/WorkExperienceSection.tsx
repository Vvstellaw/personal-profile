"use client";

import type { Section, WorkExperienceItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface WorkExperienceSectionProps {
  section: Section;
}

export function WorkExperienceSection({ section }: WorkExperienceSectionProps) {
  const items = section.items.filter(
    (i) => i.type === "work-experience"
  ) as WorkExperienceItem[];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0 mt-1">
            {item.companyLogo ? (
              <img
                src={item.companyLogo}
                alt={item.company}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-apple-muted text-xs font-bold">
                {item.company.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <h3 className="font-semibold text-apple-text">{item.role}</h3>
              <span className="text-xs text-apple-muted whitespace-nowrap">
                {formatDate(item.startDate)} —{" "}
                {item.endDate ? formatDate(item.endDate) : "至今"}
              </span>
            </div>
            <p className="text-sm text-apple-muted mt-0.5">{item.company}</p>
            {item.description && (
              <p className="text-sm text-apple-text mt-2 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-apple-muted text-sm italic">
          暂无工作经历。在管理员模式下添加。
        </p>
      )}
    </div>
  );
}

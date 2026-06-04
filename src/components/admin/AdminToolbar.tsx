"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdmin } from "@/providers/AdminProvider";
import type { SectionType } from "@/lib/types";
import { DEFAULT_LAYOUTS } from "@/lib/types";

interface AdminToolbarProps {
  onAddSection: (type: SectionType, title: string) => void;
  onEditHero: () => void;
  onSave: () => { success: boolean; error?: string };
  onExit: () => void;
}

const SECTION_OPTIONS: { type: SectionType; label: string; icon: string }[] = [
  { type: "about", label: "关于我", icon: "📝" },
  { type: "work-experience", label: "工作经验", icon: "💼" },
  { type: "ai-projects", label: "AI 项目", icon: "🚀" },
  { type: "timeline", label: "时间线", icon: "📅" },
  { type: "links", label: "链接", icon: "🔗" },
];

export function AdminToolbar({ onAddSection, onEditHero, onSave, onExit }: AdminToolbarProps) {
  const { togglePreview, isPreview } = useAdmin();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleAdd = (type: SectionType, label: string) => {
    const defaultLayout = DEFAULT_LAYOUTS[type];
    onAddSection(type, label);
    setShowAddMenu(false);
  };

  const handleSave = () => {
    const result = onSave();
    if (result.success) {
      setToast("💾 已保存");
    } else {
      setToast(`❌ ${result.error || "保存失败"}`);
    }
    setTimeout(() => setToast(null), 2000);
  };

  const handleExit = () => {
    if (window.confirm("退出管理员模式？未保存的更改将丢失。")) {
      onExit();
    }
  };

  return (
    <>
      <div className="fixed top-14 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-[90rem] mx-auto px-3 md:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-apple-accent mr-2">
              ⚙ 管理员
            </span>

            <Button size="sm" variant="secondary" onClick={onEditHero}>
              ✎ 个人资料
            </Button>

            {/* Add Section Dropdown */}
            <div className="relative">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                + 添加卡片
              </Button>
              {showAddMenu && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-2xl shadow-xl py-1 z-50">
                  {SECTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-black/[0.03] transition-colors flex items-center gap-2"
                      onClick={() => handleAdd(opt.type, opt.label)}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isPreview ? "primary" : "ghost"}
              onClick={togglePreview}
            >
              {isPreview ? "👁 预览中" : "👁 预览"}
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave}>
              💾 保存
            </Button>
            <Button size="sm" variant="ghost" onClick={handleExit}>
              ✕ 退出
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <div className="bg-apple-text text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
            {toast}
          </div>
        </div>
      )}
    </>
  );
}

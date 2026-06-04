"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { ItemEditor } from "./ItemEditor";
import { generateId } from "@/lib/utils";
import type {
  Section,
  SectionItem,
  TextItem,
  WorkExperienceItem,
  AIProjectItem,
  TimelineEventItem,
  LinkItem,
} from "@/lib/types";

interface SectionEditorProps {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
  onAddItem: (item: SectionItem) => void;
  onUpdateItem: (itemId: string, updates: Partial<SectionItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

export function SectionEditor({
  section,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: SectionEditorProps) {
  const [title, setTitle] = useState(section.title);
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const handleSave = () => {
    if (title.trim()) {
      onUpdate({ title: title.trim() });
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`确定删除 "${section.title}"？此操作无法撤销。`)) {
      onDelete();
      onClose();
    }
  };

  const handleAddItem = (item: SectionItem) => {
    onAddItem(item);
    setShowAddItem(false);
  };

  const handleUpdateItem = (item: SectionItem) => {
    onUpdateItem(item.id, item);
    setEditingItem(null);
  };

  const createEmptyItem = (): SectionItem => {
    const base = { id: generateId(), sortOrder: section.items.length };
    switch (section.type) {
      case "about":
        return { ...base, type: "text", content: "" } as TextItem;
      case "work-experience":
        return {
          ...base,
          type: "work-experience",
          company: "",
          companyLogo: "",
          role: "",
          startDate: "",
          endDate: null,
          description: "",
        } as WorkExperienceItem;
      case "ai-projects":
        return {
          ...base,
          type: "ai-project",
          title: "",
          screenshot: "",
          description: "",
          linkUrl: "",
          tags: [],
        } as AIProjectItem;
      case "timeline":
        return {
          ...base,
          type: "timeline-event",
          date: "",
          title: "",
          description: "",
          image: "",
          category: "learning",
        } as TimelineEventItem;
      case "links":
        return {
          ...base,
          type: "link",
          label: "",
          url: "",
          platform: "",
        } as LinkItem;
      default:
        return { ...base, type: "text", content: "" } as TextItem;
    }
  };

  const getItemLabel = (item: SectionItem): string => {
    switch (item.type) {
      case "text":
        return item.content.substring(0, 50) || "空文本";
      case "work-experience":
        return `${item.role || "职位"} @ ${item.company || "公司"}`;
      case "ai-project":
        return item.title || "未命名项目";
      case "timeline-event":
        return item.title || "未命名事件";
      case "link":
        return item.label || item.url || "未命名链接";
      default:
        return "未知内容";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleSave} title={`编辑: ${section.title}`}>
      <div className="space-y-6">
        {/* Section Title */}
        <div>
          <label className="text-sm font-medium text-apple-text">区块标题</label>
          <input
            className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Visibility Toggle */}
        <Toggle
          label="显示在页面上"
          checked={section.visible}
          onChange={(v) => onUpdate({ visible: v })}
        />

        {/* Items List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-apple-text">内容列表</h4>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditingItem(createEmptyItem());
                setShowAddItem(true);
              }}
            >
              + 添加
            </Button>
          </div>

          {section.items.length === 0 && !showAddItem && (
            <p className="text-sm text-apple-muted italic py-4 text-center">
              暂无内容，点击"+ 添加"添加第一条。
            </p>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02]"
              >
                <span className="text-sm text-apple-text truncate flex-1">
                  {getItemLabel(item)}
                </span>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingItem(item)}
                  >
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDeleteItem(item.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Item Editor (for editing/adding) */}
        {(editingItem || showAddItem) && (
          <div className="p-4 rounded-xl bg-black/[0.02]">
            <ItemEditor
              section={section}
              item={editingItem}
              onSave={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setEditingItem(null);
                setShowAddItem(false);
              }}
            />
          </div>
        )}

        {/* Danger Zone */}
        <div className="pt-4">
          <Button variant="danger" onClick={handleDelete} className="w-full">
            删除整个区块
          </Button>
        </div>
      </div>
    </Modal>
  );
}

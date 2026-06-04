"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
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

interface ItemEditorProps {
  section: Section;
  item: SectionItem | null;
  onSave: (item: SectionItem) => void;
  onCancel: () => void;
}

// Simple form state: everything is string
type FormState = Record<string, string>;

function itemToForm(item: SectionItem | null): FormState {
  if (!item) return {};
  const result: FormState = {};
  for (const [k, v] of Object.entries(item)) {
    if (Array.isArray(v)) {
      result[k] = v.join(", ");
    } else if (v !== null && v !== undefined) {
      result[k] = String(v);
    } else {
      result[k] = "";
    }
  }
  return result;
}

export function ItemEditor({ section, item, onSave, onCancel }: ItemEditorProps) {
  const [form, setForm] = useState<FormState>({});

  useEffect(() => {
    setForm(itemToForm(item));
  }, [item]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const base = {
      id: item?.id || generateId(),
      sortOrder: item?.sortOrder || 0,
    };

    let newItem: SectionItem;

    switch (section.type) {
      case "about":
        newItem = { ...base, type: "text", content: form.content || "" } as TextItem;
        break;

      case "work-experience":
        newItem = {
          ...base,
          type: "work-experience",
          company: form.company || "",
          companyLogo: form.companyLogo || "",
          role: form.role || "",
          startDate: form.startDate || "",
          endDate: form.endDate || null,
          description: form.description || "",
        } as WorkExperienceItem;
        break;

      case "ai-projects":
        newItem = {
          ...base,
          type: "ai-project",
          title: form.title || "",
          screenshot: form.screenshot || "",
          description: form.description || "",
          linkUrl: form.linkUrl || "",
          tags: (form.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        } as AIProjectItem;
        break;

      case "timeline":
        newItem = {
          ...base,
          type: "timeline-event",
          date: form.date || "",
          title: form.title || "",
          description: form.description || "",
          image: form.image || "",
          category: (form.category as TimelineEventItem["category"]) || "learning",
        } as TimelineEventItem;
        break;

      case "links":
        newItem = {
          ...base,
          type: "link",
          label: form.label || "",
          url: form.url || "",
          platform: form.platform || "",
        } as LinkItem;
        break;

      default:
        return;
    }

    onSave(newItem);
  };

  const f = (key: string) => form[key] || "";
  const onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    update(key, e.target.value);

  const renderFields = () => {
    switch (section.type) {
      case "about":
        return (
          <div>
            <label className="text-sm font-medium text-apple-text">内容</label>
            <textarea
              className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
              value={f("content")}
              onChange={onChange("content")}
              placeholder="关于你自己..."
            />
          </div>
        );

      case "work-experience":
        return (
          <>
            <F label="公司名称" value={f("company")} onChange={onChange("company")} />
            <F label="职位" value={f("role")} onChange={onChange("role")} />
            <div className="grid grid-cols-2 gap-3">
              <F label="开始日期 (YYYY-MM)" value={f("startDate")} onChange={onChange("startDate")} placeholder="2024-01" />
              <F label="结束日期 (留空=至今)" value={f("endDate")} onChange={onChange("endDate")} placeholder="2024-12" />
            </div>
            <div>
              <label className="text-sm font-medium text-apple-text">描述</label>
              <textarea
                className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
                value={f("description")}
                onChange={onChange("description")}
                placeholder="工作内容和成就..."
              />
            </div>
            <ImageUploader
              label="公司 Logo"
              image={f("companyLogo")}
              onChange={(v) => update("companyLogo", v)}
            />
          </>
        );

      case "ai-projects":
        return (
          <>
            <F label="项目名称" value={f("title")} onChange={onChange("title")} />
            <div>
              <label className="text-sm font-medium text-apple-text">描述</label>
              <textarea
                className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
                value={f("description")}
                onChange={onChange("description")}
              />
            </div>
            <F label="链接 URL" value={f("linkUrl")} onChange={onChange("linkUrl")} placeholder="https://..." />
            <F label="标签（逗号分隔）" value={f("tags")} onChange={onChange("tags")} placeholder="Claude, React, AI" />
            <ImageUploader
              label="项目截图"
              image={f("screenshot")}
              onChange={(v) => update("screenshot", v)}
            />
          </>
        );

      case "timeline":
        return (
          <>
            <F label="日期 (YYYY-MM)" value={f("date")} onChange={onChange("date")} placeholder="2024-06" />
            <F label="标题" value={f("title")} onChange={onChange("title")} />
            <div>
              <label className="text-sm font-medium text-apple-text">描述</label>
              <textarea
                className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
                value={f("description")}
                onChange={onChange("description")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-apple-text">分类</label>
              <select
                className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
                value={f("category") || "learning"}
                onChange={onChange("category")}
              >
                <option value="milestone">🏆 里程碑</option>
                <option value="project">🚀 项目</option>
                <option value="learning">📚 学习</option>
              </select>
            </div>
            <ImageUploader
              label="配图"
              image={f("image")}
              onChange={(v) => update("image", v)}
            />
          </>
        );

      case "links":
        return (
          <>
            <F label="显示名称" value={f("label")} onChange={onChange("label")} placeholder="GitHub" />
            <F label="URL" value={f("url")} onChange={onChange("url")} placeholder="https://..." />
            <F label="平台标识" value={f("platform")} onChange={onChange("platform")} placeholder="github" />
          </>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-apple-text">
        {item ? "编辑内容" : `添加${section.title}内容`}
      </h3>
      {renderFields()}
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>
          {item ? "保存" : "添加"}
        </Button>
      </div>
    </div>
  );
}

/* Inline input field helper */
function F({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-apple-text">{label}</label>
      <input
        className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

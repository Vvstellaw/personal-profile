"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import type { HeroData, SocialLink } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface HeroEditorProps {
  hero: HeroData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (hero: HeroData) => void;
}

export function HeroEditor({ hero, isOpen, onClose, onSave }: HeroEditorProps) {
  const [name, setName] = useState(hero.name);
  const [title, setTitle] = useState(hero.title);
  const [bio, setBio] = useState(hero.bio);
  const [avatar, setAvatar] = useState(hero.avatar);
  const [links, setLinks] = useState(hero.socialLinks);

  useEffect(() => {
    setName(hero.name);
    setTitle(hero.title);
    setBio(hero.bio);
    setAvatar(hero.avatar);
    setLinks(hero.socialLinks);
  }, [hero]);

  const handleSave = () => {
    onSave({
      ...hero,
      name: name.trim() || "你的名字",
      title: title.trim() || "AI 探索者",
      bio,
      avatar,
      socialLinks: links.filter((l) => l.platform || l.url),
    });
    onClose();
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { platform: "", url: "", icon: "" },
    ]);
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleSave} title="编辑个人信息">
      <div className="space-y-5">
        <ImageUploader
          label="头像"
          image={avatar}
          onChange={setAvatar}
        />

        <F label="姓名" value={name} onChange={setName} />
        <F label="头衔" value={title} onChange={setTitle} />

        <div>
          <label className="text-sm font-medium text-apple-text">简介</label>
          <textarea
            className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Social Links */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-apple-text">社交链接</label>
            <Button size="sm" variant="secondary" onClick={addLink}>
              + 添加
            </Button>
          </div>
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="flex-1 p-2 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
                  placeholder="平台 (github)"
                  value={link.platform}
                  onChange={(e) => updateLink(i, "platform", e.target.value)}
                />
                <input
                  className="flex-[2] p-2 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                />
                <button
                  className="text-apple-danger text-sm px-2 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => removeLink(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave}>保存</Button>
        </div>
      </div>
    </Modal>
  );
}

function F({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-apple-text">{label}</label>
      <input
        className="w-full mt-1 p-3 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-apple-accent/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

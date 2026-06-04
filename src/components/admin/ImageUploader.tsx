"use client";

import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";

interface ImageUploaderProps {
  image: string;
  onChange: (base64: string) => void;
  label?: string;
}

export function ImageUploader({ image, onChange, label = "图片" }: ImageUploaderProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-apple-text">{label}</label>

      {/* Preview */}
      {image ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-black/5">
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover"
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => onChange("")}
            className="absolute top-2 right-2"
          >
            移除
          </Button>
        </div>
      ) : (
        <div className="w-full h-32 rounded-xl bg-black/5 flex items-center justify-center text-apple-muted text-sm">
          暂无图片
        </div>
      )}

      {/* Upload */}
      <FileUpload
        onUpload={onChange}
        label={image ? "更换图片" : "上传图片"}
        maxSizeKB={500}
      />
    </div>
  );
}

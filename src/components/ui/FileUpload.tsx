"use client";

import { useRef, useState } from "react";
import { Button } from "./Button";

interface FileUploadProps {
  onUpload: (base64: string) => void;
  accept?: string;
  maxSizeKB?: number;
  label?: string;
}

export function FileUpload({
  onUpload,
  accept = "image/*",
  maxSizeKB = 500,
  label = "上传图片",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件。");
      return;
    }

    // Validate size
    const sizeKB = file.size / 1024;
    if (sizeKB > maxSizeKB) {
      setError(`图片不能超过 ${maxSizeKB}KB（当前 ${Math.round(sizeKB)}KB）。`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result as string);
    };
    reader.onerror = () => {
      setError("读取文件失败，请重试。");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          // Reset so same file can be re-selected
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </Button>
      {error && <p className="text-xs text-apple-danger">{error}</p>}
    </div>
  );
}

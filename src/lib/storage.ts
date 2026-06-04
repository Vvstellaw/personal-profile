import type { Profile } from "./types";
import { defaultProfile } from "./defaultData";

const STORAGE_KEYS = {
  PROFILE: "profile_data",
  FILE_CACHE: "profile_files",
  ADMIN_ENABLED: "profile_admin",
} as const;

const MAX_TOTAL_FILE_SIZE = 4 * 1024 * 1024; // 4MB total for file cache

/* ── Profile ── */

export function getProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return defaultProfile;

    const profile: Profile = JSON.parse(raw);

    // Migration: ensure heroLayout exists
    if (!profile.hero.heroLayout) {
      profile.hero.heroLayout = { x: 0, y: 0, w: 4, h: 4 };
    }

    // Resolve file references
    resolveFileRefs(profile);

    return profile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: Profile): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Cannot save on server" };
  }

  try {
    // Extract large base64 files to separate cache
    const fileCache = loadFileCache();
    const cleaned = extractFileRefs(profile, fileCache);

    // Check total file cache size
    const totalSize = JSON.stringify(fileCache).length;
    if (totalSize > MAX_TOTAL_FILE_SIZE) {
      return {
        success: false,
        error: `文件存储空间不足 (${(totalSize / 1024 / 1024).toFixed(1)}MB / 4MB)。请删除一些图片。`,
      };
    }

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(cleaned));
    localStorage.setItem(STORAGE_KEYS.FILE_CACHE, JSON.stringify(fileCache));

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "保存失败，请重试。",
    };
  }
}

/* ── File Reference System ── */

function loadFileCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FILE_CACHE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Replace base64 strings > 500 chars with file:// references.
 */
function extractFileRefs(
  obj: unknown,
  cache: Record<string, string>
): unknown {
  if (typeof obj === "string" && obj.startsWith("data:") && obj.length > 500) {
    const key = `file://${hashString(obj)}`;
    cache[key] = obj;
    return key;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => extractFileRefs(item, cache));
  }

  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[k] = extractFileRefs(v, cache);
    }
    return result;
  }

  return obj;
}

/**
 * Resolve file:// references back to base64 strings.
 */
function resolveFileRefs(obj: unknown): void {
  if (typeof obj !== "object" || obj === null) return;

  // We need to resolve references in-place, so we cast
  const record = obj as Record<string, unknown>;

  if (Array.isArray(obj)) {
    obj.forEach((item) => resolveFileRefs(item));
    return;
  }

  // Check if any field VALUE is a string reference
  for (const [k, v] of Object.entries(record)) {
    if (typeof v === "string" && v.startsWith("file://")) {
      const cache = loadFileCache();
      if (cache[v]) {
        record[k] = cache[v];
      }
    } else if (typeof v === "object" && v !== null) {
      resolveFileRefs(v);
    }
  }
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/* ── Admin State ── */

export function getAdminState(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_ENABLED) === "true";
}

export function setAdminState(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ENABLED, "true");
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_ENABLED);
  }
}

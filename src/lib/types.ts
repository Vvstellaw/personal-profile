/* ── Core Profile ── */

export interface Profile {
  hero: HeroData;
  sections: Section[];
}

export interface HeroLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HeroData {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  socialLinks: SocialLink[];
  heroLayout: HeroLayout;
}

export interface SocialLink {
  platform: string; // "github" | "twitter" | "email" | "website" | "linkedin"
  url: string;
  icon: string;
}

/* ── Sections ── */

export type SectionType =
  | "about"
  | "work-experience"
  | "ai-projects"
  | "timeline"
  | "links";

export interface SectionLayout {
  x: number; // column position (0-11)
  y: number; // row position
  w: number; // width in columns (2-12)
  h: number; // height in rows (2-8)
  minW?: number;
  minH?: number;
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  layout: SectionLayout;
  items: SectionItem[];
}

/* ── Items (discriminated union) ── */

export interface BaseItem {
  id: string;
  sortOrder: number;
}

export interface TextItem extends BaseItem {
  type: "text";
  content: string;
}

export interface WorkExperienceItem extends BaseItem {
  type: "work-experience";
  company: string;
  companyLogo: string; // base64
  role: string;
  startDate: string; // "YYYY-MM"
  endDate: string | null; // null = Present
  description: string;
}

export interface AIProjectItem extends BaseItem {
  type: "ai-project";
  title: string;
  screenshot: string; // base64
  description: string;
  linkUrl: string;
  tags: string[];
}

export interface TimelineEventItem extends BaseItem {
  type: "timeline-event";
  date: string; // "YYYY-MM"
  title: string;
  description: string;
  image: string; // base64, optional
  category: "milestone" | "project" | "learning";
}

export interface LinkItem extends BaseItem {
  type: "link";
  label: string;
  url: string;
  platform: string;
}

export type SectionItem =
  | TextItem
  | WorkExperienceItem
  | AIProjectItem
  | TimelineEventItem
  | LinkItem;

/* ── Default layout presets per section type ── */

export const DEFAULT_LAYOUTS: Record<SectionType, SectionLayout> = {
  about: { x: 0, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
  "work-experience": { x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
  "ai-projects": { x: 0, y: 0, w: 12, h: 3, minW: 4, minH: 2 },
  timeline: { x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
  links: { x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
};

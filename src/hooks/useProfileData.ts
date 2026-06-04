"use client";

import { useState, useCallback, useEffect } from "react";
import type { Profile, Section, SectionItem } from "@/lib/types";
import { getProfile, saveProfile } from "@/lib/storage";
import { generateId } from "@/lib/utils";

export function useProfileData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    setProfile(getProfile());
    setIsLoaded(true);
  }, []);

  // ── Profile-level ──

  const updateHero = useCallback(
    (updates: Partial<Profile["hero"]>) => {
      setProfile((prev) => {
        if (!prev) return prev;
        return { ...prev, hero: { ...prev.hero, ...updates } };
      });
    },
    []
  );

  // ── Section-level ──

  const addSection = useCallback(
    (type: Section["type"], title: string, defaultLayout: Section["layout"]) => {
      setProfile((prev) => {
        if (!prev) return prev;
        const newSection: Section = {
          id: generateId(),
          type,
          title,
          visible: true,
          layout: { ...defaultLayout },
          items: [],
        };
        return { ...prev, sections: [...prev.sections, newSection] };
      });
    },
    []
  );

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<Section>) => {
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, ...updates } : s
          ),
        };
      });
    },
    []
  );

  const deleteSection = useCallback((sectionId: string) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
      };
    });
  }, []);

  const reorderSections = useCallback((newSections: Section[]) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, sections: newSections };
    });
  }, []);

  const updateSectionLayout = useCallback(
    (sectionId: string, layout: Section["layout"]) => {
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, layout } : s
          ),
        };
      });
    },
    []
  );

  // ── Item-level ──

  const addItem = useCallback(
    (sectionId: string, item: SectionItem) => {
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? { ...s, items: [...s.items, item] }
              : s
          ),
        };
      });
    },
    []
  );

  const updateItem = useCallback(
    (sectionId: string, itemId: string, updates: Partial<SectionItem>) => {
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  items: s.items.map((i) =>
                    i.id === itemId ? ({ ...i, ...updates } as SectionItem) : i
                  ),
                }
              : s
          ),
        };
      });
    },
    []
  );

  const deleteItem = useCallback((sectionId: string, itemId: string) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
            : s
        ),
      };
    });
  }, []);

  const save = useCallback(() => {
    if (!profile) return { success: false, error: "No profile loaded" };
    return saveProfile(profile);
  }, [profile]);

  return {
    profile,
    isLoaded,
    updateHero,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    updateSectionLayout,
    addItem,
    updateItem,
    deleteItem,
    save,
  };
}

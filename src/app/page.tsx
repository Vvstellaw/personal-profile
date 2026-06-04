"use client";

import { useMemo, useCallback, useState } from "react";
import { ReactGridLayout, WidthProvider, type Layout } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useProfileData } from "@/hooks/useProfileData";
import { useAdmin } from "@/providers/AdminProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionCard } from "@/components/sections/SectionCard";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkExperienceSection } from "@/components/sections/WorkExperienceSection";
import { AIProjectsSection } from "@/components/sections/AIProjectsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { LinksSection } from "@/components/sections/LinksSection";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Section, SectionType, SectionItem, HeroData } from "@/lib/types";
import { DEFAULT_LAYOUTS } from "@/lib/types";

const GridLayout = WidthProvider(ReactGridLayout);

function SectionContent({ section }: { section: Section }) {
  switch (section.type) {
    case "about": return <AboutSection section={section} />;
    case "work-experience": return <WorkExperienceSection section={section} />;
    case "ai-projects": return <AIProjectsSection section={section} />;
    case "timeline": return <TimelineSection section={section} />;
    case "links": return <LinksSection section={section} />;
    default: return null;
  }
}

export default function Page() {
  const {
    profile, isLoaded, updateHero, updateSectionLayout,
    updateSection, deleteSection, addSection,
    addItem, updateItem, deleteItem, save,
  } = useProfileData();
  const { isAdmin, isPreview, exitAdmin } = useAdmin();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const showAdmin = isAdmin && !isPreview;

  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingHero, setEditingHero] = useState(false);

  const visibleSections = useMemo(() => {
    if (!profile) return [];
    return profile.sections
      .filter((s) => showAdmin || s.visible)
      .sort((a, b) => a.layout.y - b.layout.y || a.layout.x - b.layout.x);
  }, [profile, showAdmin]);

  const layout = useMemo(() => {
    return visibleSections.map((s) => ({
      i: s.id, x: s.layout.x, y: s.layout.y,
      w: s.layout.w, h: s.layout.h,
      minW: s.layout.minW, minH: s.layout.minH,
    }));
  }, [visibleSections]);

  const handleLayoutChange = useCallback((newLayout: Layout) => {
    newLayout.forEach((item) => {
      updateSectionLayout(item.i, { x: item.x, y: item.y, w: item.w, h: item.h, minW: item.minW, minH: item.minH });
    });
  }, [updateSectionLayout]);

  const handleAddSection = useCallback((type: SectionType, title: string) => {
    addSection(type, title, { ...DEFAULT_LAYOUTS[type] });
  }, [addSection]);

  if (!isLoaded || !profile) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-apple-muted">加载中...</p></div>;
  }

  return (
    <>
      <Header name={profile.hero.name} avatar={profile.hero.avatar} />
      {showAdmin && (
        <AdminToolbar onAddSection={handleAddSection} onEditHero={() => setEditingHero(true)} onSave={() => save()} onExit={exitAdmin} />
      )}

      <main className={`pt-14 ${showAdmin ? "mt-12" : ""}`}>
        <div className="relative">
          <HeroSection hero={profile.hero} />
          {showAdmin && (
            <div className="absolute top-4 right-4">
              <button onClick={() => setEditingHero(true)}
                className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-sm text-apple-muted hover:text-apple-accent transition-colors shadow-sm">
                ✎ 编辑个人信息
              </button>
            </div>
          )}
        </div>

        <div className="max-w-[90rem] mx-auto px-3 md:px-6 pb-24">
          {isMobile ? (
            <div className="flex flex-col gap-6">
              {visibleSections.map((s) => (
                <SectionCard key={s.id} section={s} onEdit={() => setEditingSection(s)}
                  onDelete={() => { if (window.confirm(`删除 "${s.title}"？`)) deleteSection(s.id); }}
                  onToggleVisibility={() => updateSection(s.id, { visible: !s.visible })}>
                  <SectionContent section={s} />
                </SectionCard>
              ))}
            </div>
          ) : (
            <div className={showAdmin ? "admin-grid-bg rounded-3xl p-4" : ""}>
              <GridLayout className="layout" layout={layout} cols={12} rowHeight={80}
                isDraggable={showAdmin} isResizable={showAdmin} isBounded compactType="vertical"
                draggableCancel="button,a,input,textarea,select"
                margin={[16, 16]} containerPadding={[0, 0]} onLayoutChange={handleLayoutChange}>
                {visibleSections.map((s) => (
                  <div key={s.id}>
                    <SectionCard section={s} onEdit={() => setEditingSection(s)}
                      onDelete={() => { if (window.confirm(`删除 "${s.title}"？`)) deleteSection(s.id); }}
                      onToggleVisibility={() => updateSection(s.id, { visible: !s.visible })}>
                      <SectionContent section={s} />
                    </SectionCard>
                  </div>
                ))}
              </GridLayout>
            </div>
          )}
        </div>
      </main>

      <HeroEditor hero={profile.hero} isOpen={editingHero} onClose={() => setEditingHero(false)} onSave={updateHero} />
      {editingSection && (
        <SectionEditor section={editingSection} isOpen={!!editingSection} onClose={() => setEditingSection(null)}
          onUpdate={(u) => updateSection(editingSection.id, u)}
          onDelete={() => { deleteSection(editingSection.id); setEditingSection(null); }}
          onAddItem={(item) => addItem(editingSection.id, item)}
          onUpdateItem={(id, u) => updateItem(editingSection.id, id, u)}
          onDeleteItem={(id) => deleteItem(editingSection.id, id)} />
      )}
      <Footer />
    </>
  );
}

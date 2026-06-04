"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { getAdminState, setAdminState } from "@/lib/storage";

interface AdminContextType {
  isAdmin: boolean;
  isPreview: boolean; // Preview mode within admin
  enterAdmin: () => void;
  exitAdmin: () => void;
  togglePreview: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isPreview: false,
  enterAdmin: () => {},
  exitAdmin: () => {},
  togglePreview: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Restore admin state on mount
  useEffect(() => {
    if (getAdminState()) {
      setIsAdmin(true);
    }
  }, []);

  const enterAdmin = useCallback(() => {
    setIsAdmin(true);
    setAdminState(true);
    setToast("✨ 管理员模式已开启");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const exitAdmin = useCallback(() => {
    setIsAdmin(false);
    setIsPreview(false);
    setAdminState(false);
    setToast(null);
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreview((prev) => !prev);
  }, []);

  // Konami code entry
  useKonamiCode(enterAdmin);

  return (
    <AdminContext.Provider
      value={{ isAdmin, isPreview, enterAdmin, exitAdmin, togglePreview }}
    >
      {children}
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <div className="bg-apple-text text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
            {toast}
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  return useContext(AdminContext);
}

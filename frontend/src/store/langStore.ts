import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'EN' | 'NO';

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

// Persists the user's language preference to localStorage under "gfc-lang"
// so it survives page refreshes. Namespaced key avoids collisions with other apps.
export const useLangStore = create<LangState>()(
  persist(
    set => ({
      lang: 'EN',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'gfc-lang' }
  )
);

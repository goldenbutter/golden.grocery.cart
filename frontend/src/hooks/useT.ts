import { useLangStore, type Lang } from '../store/langStore';
import { en, no, type TranslationKeys } from '../translations';

// Returns the full translation object for the active language plus the lang code itself.
// Use `t` for all UI strings, `lang` when you need the locale (e.g. date formatting).
// Example: const { t, lang } = useT();
export function useT(): { t: TranslationKeys; lang: Lang } {
  const lang = useLangStore(s => s.lang);
  return { t: lang === 'NO' ? no : en, lang };
}

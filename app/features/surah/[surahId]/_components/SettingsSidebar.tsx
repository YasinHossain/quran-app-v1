// app/surah/[surahId]/_components/SettingsSidebar.tsx
import {
  FaBookReader,
  FaFontSetting,
  FaChevronDown,
  FaArrowLeft,
} from '@/app/components/common/SvgIcons';
import { CollapsibleSection } from './CollapsibleSection';
import { useSettings } from '@/app/context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ArabicFontPanel } from './ArabicFontPanel';
import { useSidebar } from '@/app/context/SidebarContext';
import { useTheme } from '@/app/context/ThemeContext';

interface SettingsSidebarProps {
  onTranslationPanelOpen: () => void;
  onWordLanguagePanelOpen: () => void;
  selectedTranslationName: string;
  selectedWordLanguageName: string;
}

export const SettingsSidebar = ({
  onTranslationPanelOpen,
  onWordLanguagePanelOpen,
  selectedTranslationName,
  selectedWordLanguageName,
}: SettingsSidebarProps) => {
  const { settings, setSettings, arabicFonts } = useSettings();
  const { t } = useTranslation();
  const [isArabicFontPanelOpen, setIsArabicFontPanelOpen] = useState(false);
  const { isSettingsOpen, setSettingsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();

  // Helper function to calculate the slider's progress percentage
  const getPercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  // Calculate percentages for each slider
  const arabicSizePercent = getPercentage(settings.arabicFontSize, 16, 48);
  const translationSizePercent = getPercentage(settings.translationFontSize, 12, 28);

  // Find the selected Arabic font name for display
  const selectedArabicFont =
    arabicFonts.find((font) => font.value === settings.arabicFontFace)?.name || t('select_font');

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden ${isSettingsOpen ? '' : 'hidden'}`}
        role="button"
        tabIndex={0}
        onClick={() => setSettingsOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            setSettingsOpen(false);
          }
        }}
      />
      <aside
        className={`fixed lg:static inset-y-0 right-0 w-80 bg-[var(--background)] text-[var(--foreground)] flex-col flex-shrink-0 overflow-y-auto shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-transform duration-300 z-50 lg:z-auto ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 ${isSettingsOpen ? 'flex' : 'hidden'} lg:flex`}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200/80">
          <button
            aria-label="Back"
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
          >
            <FaArrowLeft size={18} />
          </button>
          <h2 className="flex-grow text-center text-lg font-bold">Settings</h2>
          <div className="w-8" />
        </header>
        <div className="flex-grow p-4">
          <div
            className={`flex items-center p-1 rounded-full mb-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
          >
            <button
              onClick={onTranslationPanelOpen}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${theme === 'light' ? 'bg-white shadow text-slate-900' : 'bg-slate-700 text-white shadow'}`}
            >
              Translation
            </button>
            <button
              onClick={onWordLanguagePanelOpen}
              className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
            >
              Reading
            </button>
          </div>
          <CollapsibleSection
            title={t('reading_setting')}
            icon={<FaBookReader size={20} className="text-teal-700" />}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-[var(--foreground)]">{t('show_word_by_word')}</span>
                <button
                  onClick={() => setSettings({ ...settings, showByWords: !settings.showByWords })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.showByWords ? 'bg-teal-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.showByWords ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground)]">{t('apply_tajweed')}</span>
                <button
                  onClick={() => setSettings({ ...settings, tajweed: !settings.tajweed })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.tajweed ? 'bg-teal-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.tajweed ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {/* Translation selection */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                  {t('translations')}
                </label>
                <button
                  onClick={onTranslationPanelOpen}
                  className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition"
                >
                  <span className="truncate text-[var(--foreground)]">
                    {selectedTranslationName}
                  </span>
                  <FaChevronDown className="text-gray-500" />
                </button>
              </div>

              {/* Word-by-word language selection */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                  {t('word_by_word_language')}
                </label>
                <button
                  onClick={onWordLanguagePanelOpen}
                  className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition"
                >
                  <span className="truncate text-[var(--foreground)]">
                    {selectedWordLanguageName}
                  </span>
                  <FaChevronDown className="text-gray-500" />
                </button>
              </div>
            </div>
          </CollapsibleSection>
          <CollapsibleSection
            title={t('font_setting')}
            icon={<FaFontSetting size={20} className="text-teal-700" />}
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <label className="text-[var(--foreground)]">{t('arabic_font_size')}</label>
                  <span className="font-semibold text-teal-700">{settings.arabicFontSize}</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={settings.arabicFontSize}
                  onChange={(e) => setSettings({ ...settings, arabicFontSize: +e.target.value })}
                  style={{ '--value-percent': `${arabicSizePercent}%` } as React.CSSProperties}
                />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <label className="text-[var(--foreground)]">{t('translation_font_size')}</label>
                  <span className="font-semibold text-teal-700">
                    {settings.translationFontSize}
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={settings.translationFontSize}
                  onChange={(e) =>
                    setSettings({ ...settings, translationFontSize: +e.target.value })
                  }
                  style={{ '--value-percent': `${translationSizePercent}%` } as React.CSSProperties}
                />
              </div>
              {/* Arabic Font Face Selection Button */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                  {t('arabic_font_face')}
                </label>
                <button
                  onClick={() => setIsArabicFontPanelOpen(true)}
                  className="w-full flex justify-between items-center bg-[var(--background)] border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-left hover:border-teal-500 transition"
                >
                  <span className="truncate text-[var(--foreground)]">{selectedArabicFont}</span>
                  <FaChevronDown className="text-gray-500" />
                </button>
              </div>
              <div className="pt-2">
                <div
                  className={`flex items-center p-1 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
                >
                  <button
                    onClick={() => setTheme('light')}
                    className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      theme === 'light'
                        ? 'bg-white shadow text-slate-900'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('light_mode')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('dark_mode')}
                  </button>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
        {/* Arabic Font Panel */}
        <ArabicFontPanel
          isOpen={isArabicFontPanelOpen}
          onClose={() => setIsArabicFontPanelOpen(false)}
        />
      </aside>
    </>
  );
};

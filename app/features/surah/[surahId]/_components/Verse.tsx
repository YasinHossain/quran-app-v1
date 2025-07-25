// app/surah/[surahId]/_components/Verse.tsx
import {
  FaPlay,
  FaPause,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaBookReader,
} from '@/app/components/common/SvgIcons';
import { TafsirModal } from './TafsirModal';
import { Verse as VerseType, Translation, Word } from '@/types';
import { useAudio } from '@/app/context/AudioContext';
import Spinner from '@/app/components/common/Spinner';
import { useSettings } from '@/app/context/SettingsContext';
import { useState } from 'react';
import { applyTajweed } from '@/lib/tajweed';

interface VerseProps {
  verse: VerseType;
}

export const Verse = ({ verse }: VerseProps) => {
  const { playingId, setPlayingId, loadingId } = useAudio();
  const { settings, bookmarkedVerses, toggleBookmark } = useSettings();
  const [showTafsir, setShowTafsir] = useState(false);
  const showByWords = settings.showByWords ?? false;
  const wordLang = settings.wordLang ?? 'en';
  const isPlaying = playingId === verse.id;
  const isLoadingAudio = loadingId === verse.id;
  const isBookmarked = bookmarkedVerses.includes(String(verse.id)); // Check if verse is bookmarked (using string ID)

  return (
    <>
      <div className="flex items-start gap-x-6 mb-12 border-b pb-8 border-gray-200">
        <div className="w-16 text-center pt-1 space-y-2 flex-shrink-0">
          <p className="font-semibold text-teal-600 text-sm">{verse.verse_key}</p>
          <div className="flex flex-col items-center space-y-1 text-gray-400 dark:text-gray-500">
            <button
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              onClick={() =>
                setPlayingId((currentId) => (currentId === verse.id ? null : verse.id))
              }
              title="Play/Pause"
              className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isPlaying ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
            >
              {isLoadingAudio ? (
                <Spinner className="h-4 w-4 text-teal-600" />
              ) : isPlaying ? (
                <FaPause size={18} />
              ) : (
                <FaPlay size={18} />
              )}
            </button>
            {/* Bookmark button */}
            <button
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              title="Bookmark"
              onClick={() => toggleBookmark(String(verse.id))}
              className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isBookmarked ? 'text-teal-600' : 'hover:text-teal-600'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`}
            >
              {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
            </button>

            {/* Tafsir button opens modal */}
            <button
              aria-label="Tafsir"
              title="Tafsir"
              onClick={() => setShowTafsir(true)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-teal-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <FaBookReader size={18} />
            </button>

            <button
              aria-label="More options"
              title="More"
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-teal-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <FaEllipsisH size={18} />
            </button>
          </div>
        </div>
        <div className="flex-grow space-y-6">
          {/* ARABIC VERSE DISPLAY, WITH TAJWEED + WORD TRANSLATIONS */}
          <p
            className="text-right leading-loose text-[var(--foreground)]"
            style={{
              fontFamily: settings.arabicFontFace,
              fontSize: `${settings.arabicFontSize}px`,
              lineHeight: 2.2,
            }}
          >
            {/* Use words if available, else fall back to plain text */}
            {verse.words && verse.words.length > 0 ? (
              <span className="flex flex-wrap gap-x-2 gap-y-1 justify-end">
                {verse.words.map((word: Word) => (
                  <span key={word.id} className="text-center">
                    <span className="relative group cursor-pointer">
                      {/* Tajweed coloring for each word */}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: settings.tajweed ? applyTajweed(word.uthmani) : word.uthmani,
                        }}
                      />
                      {/* Tooltip translation (when not showByWords) */}
                      {!showByWords && (
                        <span className="absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                          {word[wordLang] as string}
                        </span>
                      )}
                    </span>
                    {/* Inline translation below the word (when showByWords) */}
                    {showByWords && (
                      <span
                        className="block mt-1 text-gray-500"
                        style={{ fontSize: `${settings.arabicFontSize * 0.5}px` }}
                      >
                        {word[wordLang] as string}
                      </span>
                    )}
                  </span>
                ))}
              </span>
            ) : // If no word data, show whole verse with or without Tajweed
            settings.tajweed ? (
              <span dangerouslySetInnerHTML={{ __html: applyTajweed(verse.text_uthmani) }} />
            ) : (
              verse.text_uthmani
            )}
          </p>
          {/* TRANSLATIONS */}
          {verse.translations?.map((t: Translation) => (
            <div key={t.resource_id}>
              <p
                className="text-left leading-relaxed text-[var(--foreground)]"
                style={{ fontSize: `${settings.translationFontSize}px` }}
                dangerouslySetInnerHTML={{ __html: t.text }}
              />
            </div>
          ))}
        </div>
      </div>
      <TafsirModal
        isOpen={showTafsir}
        verseKey={verse.verse_key}
        onClose={() => setShowTafsir(false)}
      />
    </>
  );
};

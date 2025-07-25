const API_BASE_URL = process.env.QURAN_API_BASE_URL ?? 'https://api.quran.com/api/v4';

import { Chapter, TranslationResource, Verse, Juz, Word } from '@/types';

interface ApiWord {
  id: number;
  text: string;
  text_uthmani?: string;
  translation?: { text?: string };
  [key: string]: unknown;
}

interface ApiVerse extends Omit<Verse, 'words'> {
  words?: ApiWord[];
}

function normalizeVerse(raw: ApiVerse, wordLang = 'en'): Verse {
  return {
    ...raw,
    words: raw.words?.map((w) => ({
      ...w,
      uthmani: w.text_uthmani ?? w.text,
      [wordLang]: w.translation?.text,
    })) as Word[],
  };
}

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(`${API_BASE_URL}/chapters?language=en`);
  if (!res.ok) {
    throw new Error(`Failed to fetch chapters: ${res.status}`);
  }
  const data = await res.json();
  return data.chapters as Chapter[];
}

export async function getTranslations(): Promise<TranslationResource[]> {
  const res = await fetch(`${API_BASE_URL}/resources/translations`);
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }
  const data = await res.json();
  return data.translations as TranslationResource[];
}

export async function getWordTranslations(): Promise<TranslationResource[]> {
  const res = await fetch(`${API_BASE_URL}/resources/translations?resource_type=word_by_word`);
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }
  const data = await res.json();
  return data.translations as TranslationResource[];
}

export interface PaginatedVerses {
  verses: Verse[];
  totalPages: number;
}

interface SearchApiResult {
  verse_key: string;
  verse_id: number;
  text: string;
  translations?: Verse['translations'];
}

export async function getVersesByChapter(
  chapterId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  let url = `${API_BASE_URL}/verses/by_chapter/${chapterId}?language=${wordLang}&words=true`;
  url += `&word_translation_language=${wordLang}`;
  url += `&word_fields=text_uthmani&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  const verses = (data.verses as ApiVerse[]).map((v) => normalizeVerse(v, wordLang));
  return { verses, totalPages };
}

export async function searchVerses(query: string): Promise<Verse[]> {
  const url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&size=20&translations=20`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to search verses: ${res.status}`);
  }
  const data = await res.json();
  const results: SearchApiResult[] = data.search?.results || [];
  return results.map((r) => ({
    id: r.verse_id,
    verse_key: r.verse_key,
    text_uthmani: r.text,
    translations: r.translations,
  })) as Verse[];
}

// Fetch tafsir text for a specific verse
export async function getTafsirByVerse(verseKey: string, tafsirId = 169): Promise<string> {
  const url = `${API_BASE_URL}/tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch tafsir: ${res.status}`);
  }
  const data = await res.json();
  return data.tafsir?.text as string;
}

export async function getVersesByJuz(
  juzId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  const url = `${API_BASE_URL}/verses/by_juz/${juzId}?language=${wordLang}&words=true&word_translation_language=${wordLang}&word_fields=text_uthmani&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  const verses = (data.verses as ApiVerse[]).map((v) => normalizeVerse(v, wordLang));
  return { verses, totalPages };
}

export async function getVersesByPage(
  pageId: string | number,
  translationId: number,
  page = 1,
  perPage = 20,
  wordLang = 'en'
): Promise<PaginatedVerses> {
  const url = `${API_BASE_URL}/verses/by_page/${pageId}?language=${wordLang}&words=true&word_translation_language=${wordLang}&word_fields=text_uthmani&translations=${translationId}&fields=text_uthmani,audio&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch verses: ${res.status}`);
  }
  const data = await res.json();
  const totalPages = data.meta?.total_pages || data.pagination?.total_pages || 1;
  const verses = (data.verses as ApiVerse[]).map((v) => normalizeVerse(v, wordLang));
  return { verses, totalPages };
}

// Fetch information about a specific Juz
export async function getJuz(juzId: string | number): Promise<Juz> {
  const res = await fetch(`${API_BASE_URL}/juzs/${juzId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch juz: ${res.status}`);
  }
  const data = await res.json();
  return data.juz as Juz;
}

// Fetch a random verse with translation
export async function getRandomVerse(translationId: number): Promise<Verse> {
  const url = `${API_BASE_URL}/verses/random?translations=${translationId}&fields=text_uthmani`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch random verse: ${res.status}`);
  }
  const data = await res.json();
  return normalizeVerse(data.verse);
}

export { API_BASE_URL };

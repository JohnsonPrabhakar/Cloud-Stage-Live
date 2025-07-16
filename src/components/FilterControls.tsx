
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterControlsProps {
  searchPlaceholder: string;
  categories: string[];
  languages: string[];
  initialSearch: string;
  initialCategory: string;
  initialLanguage: string;
}

export function FilterControls({
  searchPlaceholder,
  categories,
  languages,
  initialSearch,
  initialCategory,
  initialLanguage,
}: FilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [language, setLanguage] = useState(initialLanguage);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category !== 'all') params.set('category', category);
    if (language !== 'all') params.set('language', language);
    router.push(`${pathname}?${params.toString()}`);
  }, [searchTerm, category, language, router, pathname]);

  useEffect(() => {
    // Debounce search input
    const handler = setTimeout(() => {
      updateURL();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, updateURL]);
  
  useEffect(() => {
    updateURL();
  }, [category, language, updateURL]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 border rounded-lg bg-card">
      <Input
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
      <div className="flex gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

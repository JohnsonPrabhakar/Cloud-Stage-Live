
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterControlsProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  searchPlaceholder: string;
  categories: string[];
  languages: string[];
  searchKeys: (keyof T)[];
  categoryKey: keyof T;
  languageKey: keyof T;
  noResultsMessage?: string;
}

export function FilterControls<T extends { id: string }>({
  items,
  renderItem,
  searchPlaceholder,
  categories,
  languages,
  searchKeys,
  categoryKey,
  languageKey,
  noResultsMessage = "No items found."
}: FilterControlsProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('all');

  // Set initial state from URL query params on mount
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'all');
    setLanguage(searchParams.get('language') || 'all');
  }, [searchParams]);


  const updateURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    if (category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    if (language !== 'all') {
      params.set('language', language);
    } else {
      params.delete('language');
    }
    // Use replace to avoid polluting browser history on every keystroke/filter change
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchTerm, category, language, router, pathname]);

  useEffect(() => {
    const handler = setTimeout(() => {
      updateURL();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, category, language, updateURL]);


  const filteredItems = useMemo(() => {
    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || 'all';
    const currentLanguage = searchParams.get('language') || 'all';

    return items.filter((item: T) => {
      const searchMatch = searchKeys.some(key => {
        const value = item[key];
        return typeof value === 'string' && value.toLowerCase().includes(currentSearch.toLowerCase());
      });
      const categoryMatch = currentCategory === 'all' || (item[categoryKey] as string)?.toLowerCase() === currentCategory.toLowerCase();
      const languageMatch = currentLanguage === 'all' || (item[languageKey] as string)?.toLowerCase() === currentLanguage.toLowerCase();

      return searchMatch && categoryMatch && languageMatch;
    });
  }, [items, searchParams, searchKeys, categoryKey, languageKey]);

  return (
    <>
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
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => renderItem(item))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-headline">No Results Found</h2>
          <p className="text-muted-foreground mt-2">{noResultsMessage}</p>
        </div>
      )}
    </>
  );
}

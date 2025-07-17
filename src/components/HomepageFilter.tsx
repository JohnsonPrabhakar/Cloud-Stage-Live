
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

interface HomepageFilterProps {
  categories: string[];
  languages: string[];
}

export function HomepageFilter({ categories, languages }: HomepageFilterProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category !== 'all') params.set('category', category);
    if (language !== 'all') params.set('language', language);
    router.push(`/events?${params.toString()}`);
  };

  return (
    <section>
        <h2 className="text-3xl font-headline font-bold mb-6">Find Your Next Experience</h2>
        <form onSubmit={handleSearch} className="p-4 border rounded-lg bg-card">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Search for events by title or artist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
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
                <Button type="submit" className="w-full md:w-auto">Search</Button>
            </div>
        </form>
    </section>
  );
}

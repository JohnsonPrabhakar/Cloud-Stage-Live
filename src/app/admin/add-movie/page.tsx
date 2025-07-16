
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import type React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getYoutubeThumbnail } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AddMoviePage() {
    const { createMovie } = useAuth();
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            const thumbnailUrl = getYoutubeThumbnail(videoUrl);
            setThumbnailPreview(thumbnailUrl);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [videoUrl]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const submittedVideoUrl = (data.videoUrl as string) || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const thumbnailUrl = getYoutubeThumbnail(submittedVideoUrl) || 'https://placehold.co/600x400.png';

        const embedUrl = submittedVideoUrl.replace('watch?v=', 'embed/');

        const newMovie = {
            title: data.title as string,
            description: data.description as string,
            category: data.category as string,
            language: data.language as string,
            thumbnailUrl: thumbnailUrl,
            videoUrl: embedUrl,
        };
        
        createMovie(newMovie);
        e.currentTarget.reset();
        setVideoUrl('');
        setThumbnailPreview(null);
    }

  return (
    <div>
        <div className="mb-4">
             <Button asChild variant="outline">
                <Link href="/admin/movies">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Movies
                </Link>
            </Button>
        </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline">Add New Movie</CardTitle>
          <CardDescription>Fill in the form to add a new movie to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Movie Title</Label>
              <Input id="title" name="title" placeholder="e.g., The Great Adventure" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="A brief synopsis of the movie" required />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Action">Action</SelectItem>
                            <SelectItem value="Comedy">Comedy</SelectItem>
                            <SelectItem value="Devotional">Devotional</SelectItem>
                            <SelectItem value="Drama">Drama</SelectItem>
                            <SelectItem value="Love">Love</SelectItem>
                            <SelectItem value="Suspense">Suspense</SelectItem>
                            <SelectItem value="Kids">Kids</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                     <Select name="language" required>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Tamil">Tamil</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="Kannada">Kannada</SelectItem>
                            <SelectItem value="Telugu">Telugu</SelectItem>
                            <SelectItem value="Malayalam">Malayalam</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Add via URL</TabsTrigger>
                <TabsTrigger value="upload" disabled>Upload File</TabsTrigger>
              </TabsList>
              <TabsContent className="pt-4 space-y-4" value="url">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input 
                    id="videoUrl" 
                    name="videoUrl" 
                    placeholder="e.g., https://youtube.com/watch?v=..." 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The thumbnail will be automatically fetched from the video link.
                  </p>
                </div>
                 {thumbnailPreview && (
                    <div className="space-y-2">
                        <Label>Thumbnail Preview</Label>
                        <Image 
                            src={thumbnailPreview} 
                            alt="Thumbnail preview"
                            width={200}
                            height={112}
                            className="rounded-md border object-cover"
                            unoptimized
                        />
                    </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button type="submit">Add Movie</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

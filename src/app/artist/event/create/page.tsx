
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { format, setHours, setMinutes } from 'date-fns';
import { cn, getYoutubeThumbnail, convertToEmbedUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateEventDescription } from '@/ai/flows/generate-event-description';
import { useAuth } from '@/hooks/use-auth';
import type { Event } from '@/lib/types';
import Image from 'next/image';

export default function CreateEventPage() {
  const { toast } = useToast();
  const { createEvent } = useAuth();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState({ hour: '18', minute: '00' });
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
      const handler = setTimeout(() => {
          const thumbnailUrl = getYoutubeThumbnail(youtubeUrl);
          setThumbnailPreview(thumbnailUrl);
      }, 500);

      return () => {
          clearTimeout(handler);
      };
  }, [youtubeUrl]);

  const handleGenerateDescription = async () => {
    if (!youtubeUrl) {
      toast({
        title: 'YouTube URL required',
        description: 'Please provide a YouTube URL to generate a description.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateEventDescription({ youtubeUrl });
      setDescription(result.description);
      toast({
        title: 'Description Generated!',
        description: 'The AI has crafted a description for your event.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate description from the provided URL.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (!date) {
        toast({ title: 'Date is required', variant: 'destructive' });
        return;
    }

    const combinedDate = setMinutes(setHours(date, parseInt(time.hour, 10)), parseInt(time.minute, 10));
    
    const submittedVideoUrl = data.youtubeUrl as string;
    const finalThumbnailUrl = getYoutubeThumbnail(submittedVideoUrl) || 'https://placehold.co/600x400.png';
    const embedUrl = convertToEmbedUrl(submittedVideoUrl);

    if (!embedUrl) {
        toast({ title: 'Invalid YouTube URL', description: 'Please provide a valid YouTube video URL.', variant: 'destructive'});
        return;
    }

    const newEventData = {
        title: data.title as string,
        description: data.description as string,
        category: data.category as Event['category'],
        language: data.language as Event['language'],
        date: combinedDate,
        price: Number(data.price),
        thumbnailUrl: finalThumbnailUrl,
        videoUrl: embedUrl
    };

    createEvent(newEventData);
    
    e.currentTarget.reset();
    setDate(undefined);
    setTime({ hour: '18', minute: '00' });
    setDescription('');
    setYoutubeUrl('');
    setThumbnailPreview(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create a New Event</CardTitle>
        <CardDescription>Fill out the details below to schedule your next performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" placeholder="e.g., Live Acoustic Session" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL (for Video, AI Description & Thumbnail)</Label>
            <Input 
              id="youtubeUrl" 
              name="youtubeUrl"
              placeholder="https://youtube.com/watch?v=..." 
              value={youtubeUrl} 
              onChange={e => setYoutubeUrl(e.target.value)} 
              required
            />
            <p className="text-xs text-muted-foreground">
              Provide a YouTube link to set the event video, auto-generate the description, and fetch the thumbnail.
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

          <div className="space-y-2">
            <Label htmlFor="description">Event Description</Label>
            <div className="relative">
              <Textarea 
                id="description" 
                name="description"
                placeholder="Describe your event..." 
                className="min-h-[150px] pr-12" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required />
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                aria-label="Generate with AI"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Stand-up">Stand-up</SelectItem>
                  <SelectItem value="Talk Show">Talk Show</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
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
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                   <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <Label>Date & Time</Label>
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <Input
                        type="number"
                        min="0"
                        max="23"
                        className="w-[70px]"
                        placeholder="HH"
                        value={time.hour}
                        onChange={(e) => setTime({...time, hour: e.target.value})}
                    />
                    <Input
                        type="number"
                        min="0"
                        max="59"
                        step="5"
                        className="w-[70px]"
                        placeholder="MM"
                        value={time.minute}
                        onChange={(e) => setTime({...time, minute: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Ticket Price (Rs.)</Label>
                <Input id="price" name="price" type="number" placeholder="Enter 0 for free event" required />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Submit for Approval</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

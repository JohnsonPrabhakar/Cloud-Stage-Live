'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateEventDescription } from '@/ai/flows/generate-event-description';

export default function CreateEventPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Event Submitted!',
      description: 'Your event has been submitted for approval.'
    });
    // Reset form logic here
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
            <Input id="title" placeholder="e.g., Live Acoustic Session" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL (for AI)</Label>
            <Input id="youtubeUrl" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Event Description</Label>
            <div className="relative">
              <Textarea 
                id="description" 
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="stand-up">Stand-up</SelectItem>
                  <SelectItem value="talk-show">Talk Show</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select required>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                   <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Ticket Price (₹)</Label>
                <Input id="price" type="number" placeholder="Enter 0 for free event" required />
            </div>
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="thumbnail">Event Thumbnail</Label>
            <Input id="thumbnail" type="file" required />
            <p className="text-xs text-muted-foreground">Upload an eye-catching image for your event.</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Submit for Approval</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

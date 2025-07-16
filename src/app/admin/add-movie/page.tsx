
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AddMoviePage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: 'Movie Added!',
            description: 'The new movie has been successfully added to the platform.'
        });
        // Here you would typically reset the form
    }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Add New Movie</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline">Movie Details</CardTitle>
          <CardDescription>Fill in the form to add a new movie to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Movie Title</Label>
              <Input id="title" placeholder="e.g., The Great Adventure" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="A brief synopsis of the movie" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="action">Action</SelectItem>
                            <SelectItem value="comedy">Comedy</SelectItem>
                            <SelectItem value="devotional">Devotional</SelectItem>
                            <SelectItem value="drama">Drama</SelectItem>
                            <SelectItem value="love">Love</SelectItem>
                            <SelectItem value="suspense">Suspense</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" placeholder="e.g., English" required />
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input id="videoUrl" placeholder="e.g., https://youtube.com/embed/..." required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="thumbnail">Movie Thumbnail</Label>
              <Input id="thumbnail" type="file" required />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add Movie</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

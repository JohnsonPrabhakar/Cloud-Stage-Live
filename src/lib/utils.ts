import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYoutubeThumbnail(url: string): string | null {
  if (!url) return null;
  const videoId = getYoutubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}

export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;

  let videoId = null;
  
  // Standard youtube.com/watch?v=...
  const urlParams = new URLSearchParams(url.split('?')[1]);
  videoId = urlParams.get('v');
  if (videoId) return videoId;

  // Shortened youtu.be/...
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
    if (videoId) return videoId;
  }

  // Embedded URL youtube.com/embed/...
  if (url.includes('/embed/')) {
    videoId = url.split('/embed/')[1].split('?')[0].split('&')[0];
    if (videoId) return videoId;
  }
  
  // Fallback regex for other cases
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  videoId = match && match[1];

  return videoId;
}

export function convertToEmbedUrl(url: string): string | null {
    if (!url) return null;
    const videoId = getYoutubeVideoId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    // If we can't get an ID, we shouldn't return a broken URL
    return null;
}

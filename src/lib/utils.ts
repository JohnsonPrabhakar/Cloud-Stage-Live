import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYoutubeThumbnail(url: string): string | null {
  if (!url) return null;
  let videoId;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
      if (!videoId && urlObj.pathname.includes('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1];
      }
    }
  } catch (error) {
     // Fallback for non-URL strings or invalid URLs that might just contain the ID
     const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
     videoId = match && match[1];
  }

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return null;
}

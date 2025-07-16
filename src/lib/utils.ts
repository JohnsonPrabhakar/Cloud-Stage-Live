import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Event } from "./types";

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
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;
    }
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
      if (videoId) return videoId;
    }
  } catch (e) {
    // URL parsing might fail for malformed URLs, so we continue to regex
  }

  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  videoId = match ? match[1] : null;

  return videoId;
}


export function convertToEmbedUrl(url: string): string | null {
    if (!url) return null;
    const videoId = getYoutubeVideoId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
}

export function getEventStatus(eventDate: Date, duration: number): Event['status'] {
  const now = new Date();
  const eventStartTime = new Date(eventDate);
  const eventEndTime = new Date(eventStartTime.getTime() + duration * 60 * 1000);

  if (now < eventStartTime) {
    return 'Upcoming';
  } else if (now >= eventStartTime && now <= eventEndTime) {
    return 'Live';
  } else {
    return 'Past';
  }
}

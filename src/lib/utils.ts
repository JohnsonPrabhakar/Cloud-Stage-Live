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
  
  // Standard youtube.com/watch?v=...
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;
    }
    // Shortened youtu.be/...
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
      if (videoId) return videoId;
    }
  } catch (e) {
    // Fallback for non-standard or partial URLs
  }


  // Embedded URL youtube.com/embed/...
  if (url.includes('/embed/')) {
    videoId = url.split('/embed/')[1].split('?')[0].split('&')[0];
    if (videoId) return videoId;
  }
  
  // Fallback regex for other cases, more robust
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

export function getEventStatus(eventDate: Date): Event['status'] {
  const now = new Date();
  const eventTime = new Date(eventDate);
  const threeHours = 3 * 60 * 60 * 1000;

  if (eventTime > now) {
    return 'Upcoming';
  } else if (now.getTime() - eventTime.getTime() < threeHours) {
    return 'Live';
  } else {
    return 'Past';
  }
}

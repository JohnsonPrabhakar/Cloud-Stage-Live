import type { Event, Movie, User, Ticket } from './types';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com' },
  { id: 'user2', name: 'Bob', email: 'bob@example.com' },
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    title: 'Acoustic Sunset with Lea',
    description: 'Join Lea for a magical evening of acoustic melodies as the sun sets. A soulful performance you won\'t forget.',
    artist: 'Lea Michelle',
    artistId: 'artist1',
    date: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    category: 'Music',
    language: 'English',
    price: 15,
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Upcoming',
    approvalStatus: 'Approved',
  },
  {
    id: 'evt2',
    title: 'Live Comedy Hour',
    description: 'Get ready to laugh your socks off with the funniest comedians in town. An hour of non-stop humor.',
    artist: 'Comedy Crew',
    artistId: 'artist2',
    date: new Date(),
    category: 'Stand-up',
    language: 'English',
    price: 10,
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Live',
    approvalStatus: 'Approved',
  },
  {
    id: 'evt3',
    title: 'The Art of Storytelling',
    description: 'A deep dive into crafting compelling narratives with bestselling author Jane Doe.',
    artist: 'Jane Doe',
    artistId: 'artist3',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    category: 'Workshop',
    language: 'English',
    price: 50,
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Upcoming',
    approvalStatus: 'Approved',
  },
  {
    id: 'evt4',
    title: 'Jazz Night In',
    description: 'Experience the smooth sounds of a live jazz band from the comfort of your home.',
    artist: 'The Jazz Cats',
    artistId: 'artist4',
    date: new Date(new Date().setDate(new Date().getDate() - 7)),
    category: 'Music',
    language: 'English',
    price: 0,
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Past',
    approvalStatus: 'Approved',
  },
    {
    id: 'evt5',
    title: 'Tech Talk: The Future of AI',
    description: 'Join industry experts as they discuss the future of Artificial Intelligence.',
    artist: 'Tech Gurus',
    artistId: 'artist1',
    date: new Date(new Date().setDate(new Date().getDate() + 14)),
    category: 'Talk Show',
    language: 'English',
    price: 25,
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'Upcoming',
    approvalStatus: 'Pending',
  },
];

export const mockMovies: Movie[] = [
  {
    id: 'mov1',
    title: 'The Great Adventure',
    description: 'An epic journey of a lifetime.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Adventure',
    language: 'English',
  },
  {
    id: 'mov2',
    title: 'City of Lights',
    description: 'A romantic story set in Paris.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Romance',
    language: 'French',
  },
];

export const mockTickets: Ticket[] = [
    { id: 'tkt1', userId: 'user1', eventId: 'evt4', purchaseDate: new Date() },
    { id: 'tkt2', userId: 'user1', eventId: 'evt1', purchaseDate: new Date() }
];

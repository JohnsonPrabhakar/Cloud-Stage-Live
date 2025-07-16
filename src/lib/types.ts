export type User = {
  id: string;
  name: string;
  email: string;
  interests?: string[];
  subscription?: {
    plan: 'Premium';
    expiryDate: Date;
    eventCount: number;
  };
};

export type Role = 'user' | 'artist' | 'admin' | null;

export type Event = {
  id: string;
  title: string;
  description: string;
  artist: string;
  artistId: string;
  date: Date;
  category: 'Music' | 'Stand-up' | 'Talk Show' | 'Workshop';
  language: 'English' | 'Spanish' | 'Hindi' | 'French';
  price: number;
  thumbnailUrl: string;
  videoUrl: string;
  status: 'Live' | 'Upcoming' | 'Past';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
};

export type Movie = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  language: string;
};

export type Ticket = {
  id: string;
  userId: string;
  eventId: string;
  purchaseDate: Date;
};

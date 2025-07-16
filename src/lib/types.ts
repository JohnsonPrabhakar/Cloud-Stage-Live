export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  interests?: string[];
  profilePictureUrl?: string;
  subscription?: {
    plan: 'Premium';
    expiryDate: Date;
    eventCount: number;
  };
  role: Role;
  applicationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
};

export type Role = 'user' | 'artist' | 'admin' | null;

export type Event = {
  id: string;
  title: string;
  description: string;
  artist: string;
  artistId: string;
  date: Date;
  category: 'Music' | 'Stand-up' | 'Talk Show' | 'Workshop' | 'Purchase';
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
  videoUrl:string;
  category: string;
  language: string;
};

export type Ticket = {
  id: string;
  userId: string;
  eventId: string;
  purchaseDate: Date;
};

export type ArtistApplication = {
  id: string;
  name: string;
  email: string;
  password?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  location: string;
  category: string;
  contactNumber: string;
  profileLink: string;
  description: string;
};

export const roles = ["student", "owner", "university", "admin"] as const;
export type Role = (typeof roles)[number];

export const publicSignupRoles = ["student", "owner"] as const;
export type PublicSignupRole = (typeof publicSignupRoles)[number];

export const propertyStatuses = ["draft", "under_review", "verified", "changes_requested"] as const;
export type PropertyStatus = (typeof propertyStatuses)[number];

export const applicationStatuses = ["submitted", "under_review", "approved", "rejected", "more_information"] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

export const bookingStatuses = ["requested", "confirmed", "cancelled"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
};

export type Session = {
  token: string;
  userId: string;
  expiresAt: number;
};

export type Property = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  city: string;
  area: string;
  university: string;
  distance: string;
  photos: string[];
  amenities: string[];
  rooms: PropertyRoom[];
  status: PropertyStatus;
  createdAt: string;
};

export type PropertyRoom = {
  name: string;
  beds: number;
  price: number;
};

export type Application = {
  id: string;
  studentId: string;
  propertyId: string;
  roomName: string;
  moveInDate: string;
  details: Record<string, string>;
  documents: string[];
  status: ApplicationStatus;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  studentId: string;
  propertyId: string;
  roomName: string;
  moveInDate: string;
  amount: number;
  status: BookingStatus;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  userId?: string;
  createdAt: string;
};

export type HostelSearchFilters = {
  university?: string;
  location?: string;
  room?: string;
  verified?: boolean;
};

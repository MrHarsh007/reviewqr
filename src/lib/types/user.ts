import { Timestamp } from 'firebase/firestore';

export type LocationType = 'google_maps' | 'external_link';

export interface LocationConfig {
  type: LocationType;
  // Google Maps fields
  placeId?: string;
  placeName?: string;
  placeAddress?: string;
  placePhotoURL?: string;
  // External link fields
  externalUrl?: string;
  platformName?: string;
}

export interface User {
  // Auto-populated from Google Auth
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  
  // Employee Profile Fields
  companyName: string;
  yearsOfExperience: number;
  
  // Location Configuration
  location?: LocationConfig;
  
  // Review Configuration
  prefilledReviews?: string[]; // Up to 5 prefilled reviews
  categories: string[];
  
  // Metadata (may be Timestamp from SDK or plain object from Server Components)
  createdAt: any;
  updatedAt: any;
}

export interface ReviewGenerationRequest {
  employeeName: string;
  companyName: string;
  category: string;
}

export interface ReviewGenerationResponse {
  review: string;
  error?: string;
}

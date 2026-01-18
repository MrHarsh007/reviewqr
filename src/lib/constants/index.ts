// Firebase Collection Paths
export const COLLECTIONS = {
  USERS: 'users',
} as const;

// Character Limits
export const CHAR_LIMITS = {
  PREFILLED_REVIEW_MIN: 50,
  PREFILLED_REVIEW_MAX: 300,
  GENERATED_REVIEW_MIN: 50,
  GENERATED_REVIEW_MAX: 200,
  MAX_PREFILLED_REVIEWS: 5,
} as const;

// Default Categories
export const DEFAULT_CATEGORIES = [
  'Service Quality',
  'Product Knowledge',
  'Professionalism',
  'Communication',
  'Problem Solving',
] as const;

// Text Labels
export const LABELS = {
  APP_NAME: 'ReviewQR',
  TAGLINE: 'AI-Powered Reviews Made Easy',
  SIGN_IN: 'Sign in with Google',
  SIGN_OUT: 'Sign Out',
  GET_STARTED: 'Get Started',
  GENERATE_WITH_AI: 'Generate with AI',
  ADD_REVIEW: 'Add Review',
  COPY_REVIEW: 'Copy Review',
  REGENERATE: 'Regenerate',
  INCOMPLETE_PROFILE: 'Employee needs to complete their profile',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Authentication failed. Please try again.',
  PROFILE_LOAD_FAILED: 'Failed to load profile.',
  PROFILE_SAVE_FAILED: 'Failed to save profile.',
  LOCATION_REQUIRED: 'Please configure a location (Google Maps or external link).',
  CATEGORY_REQUIRED: 'Please select a category to generate a review.',
  AI_GENERATION_FAILED: 'Failed to generate review. Please try again.',
  COPY_FAILED: 'Failed to copy to clipboard.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_SAVED: 'Profile saved successfully!',
  COPIED: 'Copied to clipboard!',
  REVIEW_GENERATED: 'Review generated successfully!',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  REVIEW: (uid: string) => `/review/${uid}`,
} as const;

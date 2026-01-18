# ReviewQR - AI-Powered Review Generation Platform

Generate personalized QR codes that help customers create quality reviews with AI assistance, then seamlessly redirect them to your preferred review platform.

## Features

- ✨ **AI-Powered Review Generation** - Google Gemini AI helps customers write quality reviews
- 🔐 **Google OAuth Authentication** - Secure sign-in for employees
- 📱 **QR Code Generation** - Client-side QR code generation (no storage needed)
- 🎨 **Dark/Light Mode** - Full theme support
- 📊 **Employee Dashboard** - Manage profile, categories, and download QR codes
- 🌐 **Public Review Pages** - No authentication required for customers
- 💾 **Firebase Integration** - Firestore for data, Storage for images, Auth for security

## Tech Stack

- **Framework:** Next.js (latest) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google OAuth)
- **Storage:** Firebase Storage
- **AI:** Google Gemini API
- **QR Codes:** qrcode.react (client-side)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Google Gemini API key
- (Optional) Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   cd /path/to/reviewqr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

   Fill in your credentials in `.env.local`:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key

   # Google Maps API (optional)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Deploy Firestore Security Rules**
   
   In your Firebase Console, go to Firestore Database → Rules and paste the contents of `firestore.rules`:
   ```bash
   # Or use Firebase CLI
   firebase deploy --only firestore:rules
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Google** sign-in provider
4. Add your domain to authorized domains

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose a location
5. Deploy the security rules from `firestore.rules`

### 4. Enable Storage

1. Go to **Storage**
2. Click "Get started"
3. Use default security rules (we'll update them)

### 5. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (</>) to add a web app
4. Copy the config object values to your `.env.local`

## Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `.env.local` as `GEMINI_API_KEY`

## Project Structure

```
reviewqr/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── generate-review/  # AI review generation
│   │   ├── auth/signin/       # Sign-in page
│   │   ├── dashboard/         # Employee dashboard
│   │   ├── review/[uid]/      # Public review page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── theme/            # Theme components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                   # Utilities and services
│   │   ├── constants/        # App constants
│   │   ├── contexts/         # React contexts
│   │   ├── firebase/         # Firebase config
│   │   ├── services/         # Service layers
│   │   ├── types/            # TypeScript types
│   │   └── utils.ts          # Utility functions
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── firestore.rules           # Firestore security rules
├── env.example               # Environment variables template
└── package.json              # Dependencies
```

## User Flows

### Employee Flow

1. Visit landing page
2. Click "Get Started" → Sign in with Google
3. Complete profile (name, company, years of experience)
4. Configure review platform (external URL)
5. Add prefilled review (optional)
6. Add categories (at least 1 required)
7. Save profile → QR code generated
8. Download QR code or ID card
9. Print and display QR code

### Reviewer Flow

1. Scan QR code → Opens `/review/{uid}`
2. See employee profile
3. Click "Add Review" button (opens external platform in new tab)
4. (Optional) Copy prefilled review
5. Select a category
6. Click "Generate with AI"
7. Review generated text (editable)
8. Copy review
9. Paste in external platform and submit

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy --only hosting`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Features Implemented

- [x] Google OAuth authentication
- [x] Employee profile management
- [x] External review platform configuration
- [x] Prefilled review text
- [x] Category management
- [x] Client-side QR code generation
- [x] QR code download (PNG)
- [x] ID card download (QR + info)
- [x] Public review page
- [x] AI review generation with Gemini
- [x] Copy to clipboard functionality
- [x] Dark/light mode theme
- [x] Mobile-responsive design
- [x] Incomplete profile handling
- [x] Firebase security rules

## Future Enhancements

- [ ] Google Maps Places API integration
- [ ] Rate limiting for AI generation
- [ ] Analytics dashboard
- [ ] Review statistics
- [ ] Multiple QR code designs
- [ ] Email notifications
- [ ] Multi-language support

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

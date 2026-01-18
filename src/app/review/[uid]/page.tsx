import { profileService } from '@/lib/services/profile.service';
import { ReviewClient } from '@/components/review/ReviewClient';
import { Metadata } from 'next';
import { LABELS } from '@/lib/constants';

interface PageProps {
    params: Promise<{ uid: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { uid } = await params;
    try {
        const profile = await profileService.getUserProfile(uid);
        if (profile) {
            return {
                title: `Review for ${profile.displayName} | ${LABELS.APP_NAME}`,
                description: `Leave an AI-powered review for ${profile.displayName} at ${profile.companyName}`,
            };
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return {
        title: `Review Employee | ${LABELS.APP_NAME}`,
    };
}

export default async function Page({ params }: PageProps) {
    const { uid } = await params;
    const profile = await profileService.getUserProfile(uid);

    // Convert to plain object to handle non-serializable Firebase Timestamps
    const initialData = profile ? JSON.parse(JSON.stringify(profile)) : null;

    return <ReviewClient uid={uid} initialData={initialData} />;
}

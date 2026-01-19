'use client';

import { useState, useRef } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, LocationConfig } from '@/lib/types/user';
import { profileService } from '@/lib/services/profile.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { DEFAULT_CATEGORIES, CHAR_LIMITS } from '@/lib/constants';
import { X, Plus, Upload, HelpCircle } from 'lucide-react';

interface ProfileFormProps {
    user: FirebaseUser;
    existingProfile: User | null;
    onSave: (profile: User) => void;
    onCancel?: () => void;
}

export function ProfileForm({ user, existingProfile, onSave, onCancel }: ProfileFormProps) {
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState(existingProfile?.displayName || user.displayName || '');
    const [photoURL, setPhotoURL] = useState(existingProfile?.photoURL || user.photoURL || '');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [companyName, setCompanyName] = useState(existingProfile?.companyName || '');
    const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>(existingProfile?.yearsOfExperience || 1);
    const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
    const [prefilledReviews, setPrefilledReviews] = useState<string[]>(
        existingProfile?.prefilledReviews || ['']
    );
    const [categories, setCategories] = useState<string[]>(
        existingProfile?.categories || DEFAULT_CATEGORIES.slice(0, 3)
    );
    const [newCategory, setNewCategory] = useState('');
    const [externalUrl, setExternalUrl] = useState(
        existingProfile?.location?.type === 'external_link' ? existingProfile.location.externalUrl || '' : ''
    );
    const [platformName, setPlatformName] = useState(
        existingProfile?.location?.type === 'external_link' ? existingProfile.location.platformName || '' : ''
    );

    const handlePhotoUpload = () => {
        toast.info('Profile picture upload is coming soon!');
    };

    const handleAddPrefilledReview = () => {
        if (prefilledReviews.length < CHAR_LIMITS.MAX_PREFILLED_REVIEWS) {
            setPrefilledReviews([...prefilledReviews, '']);
        } else {
            toast.error(`Maximum ${CHAR_LIMITS.MAX_PREFILLED_REVIEWS} prefilled reviews allowed`);
        }
    };

    const handleRemovePrefilledReview = (index: number) => {
        if (prefilledReviews.length > 1) {
            setPrefilledReviews(prefilledReviews.filter((_, i) => i !== index));
        }
    };

    const handlePrefilledReviewChange = (index: number, value: string) => {
        const updated = [...prefilledReviews];
        updated[index] = value;
        setPrefilledReviews(updated);
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (index: number) => {
        if (categories.length > 1) {
            setCategories(categories.filter((_, i) => i !== index));
        } else {
            toast.error('You must have at least one category');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all required fields
        const errors = new Set<string>();

        if (!displayName.trim()) errors.add('displayName');
        if (!companyName.trim()) errors.add('companyName');
        if (yearsOfExperience === '' || yearsOfExperience <= 0) errors.add('yearsOfExperience');
        if (!platformName.trim()) errors.add('platformName');
        if (!externalUrl.trim()) errors.add('externalUrl');
        if (categories.length === 0) errors.add('categories');

        setValidationErrors(errors);

        if (errors.size > 0) {
            toast.error('Please fill in all required fields (highlighted in red)');
            return;
        }

        setLoading(true);

        try {
            const location: LocationConfig = {
                type: 'external_link',
                externalUrl,
                platformName,
            };

            // Filter out empty prefilled reviews
            const validPrefilledReviews = prefilledReviews.filter(review => review.trim().length > 0);

            const profileData: Partial<User> & { uid: string } = {
                uid: user.uid,
                email: user.email!,
                displayName,
                photoURL,
                companyName,
                yearsOfExperience: typeof yearsOfExperience === 'number' ? yearsOfExperience : 1,
                prefilledReviews: validPrefilledReviews.length > 0 ? validPrefilledReviews : undefined,
                categories,
                location,
            };

            await profileService.saveUserProfile(profileData);

            // Fetch the saved profile to get timestamps
            const savedProfile = await profileService.getUserProfile(user.uid);
            if (savedProfile) {
                onSave(savedProfile);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                    <img
                        src={photoURL || '/placeholder-avatar.png'}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border-2"
                    />
                    <div className="flex-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePhotoUpload}
                            disabled={uploadingPhoto}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {uploadingPhoto ? 'Uploading...' : 'Change Picture'}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            Recommended: Square image, max 5MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Name *</Label>
                    <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => {
                            setDisplayName(e.target.value);
                            if (validationErrors.has('displayName')) {
                                setValidationErrors(prev => {
                                    const next = new Set(prev);
                                    next.delete('displayName');
                                    return next;
                                });
                            }
                        }}
                        required
                        placeholder="Your full name"
                        className={validationErrors.has('displayName') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </div>
                    <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => {
                            setCompanyName(e.target.value);
                            if (validationErrors.has('companyName')) {
                                setValidationErrors(prev => {
                                    const next = new Set(prev);
                                    next.delete('companyName');
                                    return next;
                                });
                            }
                        }}
                        required
                        placeholder="e.g., ABC Corporation"
                        className={validationErrors.has('companyName') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        This will appear on your review page
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </div>
                    <Input
                        id="yearsOfExperience"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={yearsOfExperience}
                        onChange={(e) => {
                            let value: number | '' = '';
                            if (e.target.value !== '') {
                                const parsed = parseFloat(e.target.value);
                                // Round to 1 decimal place
                                value = Math.round(parsed * 10) / 10;
                            }
                            setYearsOfExperience(value);
                            if (validationErrors.has('yearsOfExperience')) {
                                setValidationErrors(prev => {
                                    const next = new Set(prev);
                                    next.delete('yearsOfExperience');
                                    return next;
                                });
                            }
                        }}
                        required
                        placeholder="e.g., 1.5, 2.5, 5"
                        className={validationErrors.has('yearsOfExperience') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {validationErrors.has('yearsOfExperience') && (
                        <p className="text-xs text-red-500">This field is required</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        One decimal place allowed (e.g., 1.2, 2.5, 5.5)
                    </p>
                </div>
            </div>

            {/* Location Configuration */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Review Platform *</h3>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </div>
                <p className="text-sm text-muted-foreground">
                    This is where customers will be redirected to post their review
                </p>

                <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                        id="platformName"
                        value={platformName}
                        onChange={(e) => {
                            setPlatformName(e.target.value);
                            if (validationErrors.has('platformName')) {
                                setValidationErrors(prev => {
                                    const next = new Set(prev);
                                    next.delete('platformName');
                                    return next;
                                });
                            }
                        }}
                        placeholder="e.g., Google Reviews, Yelp, Trustpilot"
                        required
                        className={validationErrors.has('platformName') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="externalUrl">Review Page URL</Label>
                    <Input
                        id="externalUrl"
                        type="url"
                        value={externalUrl}
                        onChange={(e) => {
                            setExternalUrl(e.target.value);
                            if (validationErrors.has('externalUrl')) {
                                setValidationErrors(prev => {
                                    const next = new Set(prev);
                                    next.delete('externalUrl');
                                    return next;
                                });
                            }
                        }}
                        placeholder="https://..."
                        required
                        className={validationErrors.has('externalUrl') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        💡 Tip: Go to your business page on Google/Yelp, click "Write a review", and copy that URL
                    </p>
                </div>
            </div>

            {/* Prefilled Reviews */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label>Prefilled Reviews (Optional)</Label>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </div>
                    {prefilledReviews.length < CHAR_LIMITS.MAX_PREFILLED_REVIEWS && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddPrefilledReview}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Another
                        </Button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    Provide sample reviews that customers can copy and use ({CHAR_LIMITS.PREFILLED_REVIEW_MIN}-{CHAR_LIMITS.PREFILLED_REVIEW_MAX} characters each)
                </p>

                <div className="space-y-3">
                    {prefilledReviews.map((review, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`review-${index}`}>
                                    Review {index + 1}
                                </Label>
                                {prefilledReviews.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemovePrefilledReview(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <Textarea
                                id={`review-${index}`}
                                value={review}
                                onChange={(e) => handlePrefilledReviewChange(index, e.target.value)}
                                placeholder="A suggested review text that customers can use..."
                                maxLength={CHAR_LIMITS.PREFILLED_REVIEW_MAX}
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                {review.length}/{CHAR_LIMITS.PREFILLED_REVIEW_MAX} characters
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Label>Review Categories * (at least 1 required)</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </div>
                <p className="text-sm text-muted-foreground">
                    These categories help customers focus their AI-generated reviews on specific aspects
                </p>

                <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center gap-2"
                        >
                            {category}
                            <button
                                type="button"
                                onClick={() => handleRemoveCategory(index)}
                                className="hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g., Customer Service, Product Quality..."
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCategory();
                            }
                        }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddCategory}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex gap-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" className="flex-1" size="lg" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </Button>
            </div>

        </form>
    );
}

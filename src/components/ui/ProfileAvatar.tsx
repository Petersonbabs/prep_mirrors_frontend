// frontend/src/components/ui/ProfileAvatar.tsx
import { useState } from 'react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
    avatarUrl?: string | null;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    onUpload?: (file: File) => Promise<void>;
    editable?: boolean;
}

const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
};

export function ProfileAvatar({ avatarUrl, name, size = 'md', onUpload, editable = false }: ProfileAvatarProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getInitials = () => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUpload) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setError(null);
        try {
            await onUpload(file);
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <div
                className={`rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold overflow-hidden ${sizeClasses[size]}`}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name || 'Profile'}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    getInitials()
                )}
            </div>

            {editable && onUpload && (
                <label className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-neutral-800 rounded-full shadow-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <Camera className="w-3 h-3 text-neutral-500" />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            )}

            {error && (
                <span className="absolute -bottom-6 left-0 text-xs text-red-500 whitespace-nowrap">
                    {error}
                </span>
            )}

            {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
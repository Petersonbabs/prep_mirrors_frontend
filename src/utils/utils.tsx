export const UnderDevelopmentComponent = ({ children }: { children: React.ReactNode }) => {
    if (import.meta.env.VITE_ENVIRONMENT === "production") {
        return null;
    } else {
        return (
            <div className="relative">
                {/* Coming Soon Badge */}
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md z-10">
                    Coming Soon
                </div>
                {/* Original children */}
                <div className="opacity-50">{children}</div>
            </div>
        );
    }
};

export const getInitials = (text: String) => {
    if (!text) return '?';
    return text
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
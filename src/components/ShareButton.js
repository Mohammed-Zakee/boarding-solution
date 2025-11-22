'use client';
import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ listing }) {
    const [shared, setShared] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: listing.name,
            text: `Check out this boarding: ${listing.name} - Rs. ${listing.price}/month in ${listing.address}`,
            url: typeof window !== 'undefined' ? window.location.href : ''
        };

        try {
            // Try Web Share API first (works on mobile)
            if (navigator.share) {
                await navigator.share(shareData);
                setShared(true);
                setTimeout(() => setShared(false), 2000);
            } else {
                // Fallback: Copy to clipboard
                const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
                await navigator.clipboard.writeText(shareText);
                setShared(true);
                setTimeout(() => setShared(false), 2000);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="share-btn"
            title="Share this listing"
        >
            <Share2 size={18} />
            {shared ? 'Shared!' : 'Share'}
        </button>
    );
}

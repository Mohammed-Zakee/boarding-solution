'use client';
import { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';

export default function RecentlyViewed() {
    const [recentListings, setRecentListings] = useState([]);

    useEffect(() => {
        // Get from localStorage
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentListings(recent.slice(0, 10)); // Show last 10
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('recentlyViewed');
        setRecentListings([]);
    };

    const removeItem = (id) => {
        const updated = recentListings.filter(item => item.id !== id);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        setRecentListings(updated);
    };

    if (recentListings.length === 0) {
        return (
            <div className="empty-state">
                <Clock size={48} />
                <p>No recently viewed listings</p>
            </div>
        );
    }

    return (
        <div className="recently-viewed">
            <div className="section-header">
                <h3><Clock size={20} /> Recently Viewed</h3>
                <button onClick={clearHistory} className="clear-btn">
                    Clear All
                </button>
            </div>

            <div className="recent-grid">
                {recentListings.map((listing) => (
                    <div key={listing.id} className="recent-card">
                        <button
                            className="remove-btn"
                            onClick={() => removeItem(listing.id)}
                            title="Remove from history"
                        >
                            <X size={16} />
                        </button>

                        <img
                            src={listing.image || '/placeholder.jpg'}
                            alt={listing.name}
                            className="recent-image"
                        />

                        <div className="recent-info">
                            <h4>{listing.name}</h4>
                            <p className="price">Rs. {listing.price?.toLocaleString()}/month</p>
                            <p className="location">{listing.address}</p>
                            <span className="viewed-time">
                                {new Date(listing.viewedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Utility function to track views (import this elsewhere)
export const trackListingView = (listing) => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

    // Remove if already exists
    const filtered = recent.filter(item => item.id !== listing.id);

    // Add to beginning with timestamp
    filtered.unshift({
        id: listing.id,
        name: listing.name,
        price: listing.price,
        address: listing.address,
        image: listing.images?.[0] || null,
        viewedAt: new Date().toISOString()
    });

    // Keep only last 50
    const trimmed = filtered.slice(0, 50);

    localStorage.setItem('recentlyViewed', JSON.stringify(trimmed));
};

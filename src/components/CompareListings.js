'use client';
import { useState } from 'react';
import { X, Check, Minus } from 'lucide-react';

export default function CompareListings({ listings, onClose }) {
    const [selectedListings, setSelectedListings] = useState(listings.slice(0, 3));

    const features = [
        { key: 'price', label: 'Price (Monthly)', type: 'price' },
        { key: 'bedrooms', label: 'Bedrooms', type: 'number' },
        { key: 'bathrooms', label: 'Bathrooms', type: 'number' },
        { key: 'wifi', label: 'WiFi', type: 'boolean' },
        { key: 'ac', label: 'Air Conditioning', type: 'boolean' },
        { key: 'parking', label: 'Parking', type: 'boolean' },
        { key: 'furnished', label: 'Furnished', type: 'boolean' },
        { key: 'kitchen', label: 'Kitchen', type: 'boolean' },
        { key: 'laundry', label: 'Laundry', type: 'boolean' },
        { key: 'security', label: 'Security', type: 'boolean' },
        { key: 'distance', label: 'Distance to Campus', type: 'text' },
        { key: 'address', label: 'Location', type: 'text' },
    ];

    const getBestValue = (feature) => {
        if (feature.type === 'price') {
            const prices = selectedListings.map(l => l.price || 0);
            return Math.min(...prices);
        }
        if (feature.type === 'number') {
            const values = selectedListings.map(l => l[feature.key] || 0);
            return Math.max(...values);
        }
        return null;
    };

    const renderCell = (listing, feature) => {
        const value = listing[feature.key];
        const bestValue = getBestValue(feature);

        if (feature.type === 'price') {
            const isBest = value === bestValue;
            return (
                <td className={isBest ? 'best-value' : ''}>
                    <span className="price-value">
                        Rs. {value?.toLocaleString()}
                    </span>
                    {isBest && <span className="badge-best">Best Price</span>}
                </td>
            );
        }

        if (feature.type === 'number') {
            const isBest = value === bestValue && value > 0;
            return (
                <td className={isBest ? 'best-value' : ''}>
                    {value || '-'}
                    {isBest && value > 0 && <Check size={16} className="check-icon" />}
                </td>
            );
        }

        if (feature.type === 'boolean') {
            return (
                <td className={value ? 'has-feature' : ''}>
                    {value ? <Check size={20} color="#22c55e" /> : <Minus size={20} color="#64748b" />}
                </td>
            );
        }

        return <td>{value || '-'}</td>;
    };

    return (
        <div className="compare-modal-overlay" onClick={onClose}>
            <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="compare-title">Compare Listings</h2>

                <div className="compare-table-container">
                    <table className="compare-table">
                        <thead>
                            <tr>
                                <th className="feature-column">Features</th>
                                {selectedListings.map((listing) => (
                                    <th key={listing.id}>
                                        <div className="listing-header">
                                            <img
                                                src={listing.images?.[0] || '/placeholder.jpg'}
                                                alt={listing.name}
                                                className="listing-thumb"
                                            />
                                            <div className="listing-name">{listing.name}</div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature) => (
                                <tr key={feature.key}>
                                    <td className="feature-label">{feature.label}</td>
                                    {selectedListings.map((listing) => (
                                        <React.Fragment key={listing.id}>
                                            {renderCell(listing, feature)}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="compare-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Phone, Navigation } from 'lucide-react';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchFavorites(currentUser.uid);
            } else {
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchFavorites = async (userId) => {
        try {
            const q = query(collection(db, 'favorites'), where('userId', '==', userId));
            const snapshot = await getDocs(q);

            const favoriteListingIds = snapshot.docs.map(doc => doc.data().listingId);

            if (favoriteListingIds.length === 0) {
                setFavorites([]);
                setLoading(false);
                return;
            }

            // Fetch the actual listings
            const listingsPromises = favoriteListingIds.map(async (listingId) => {
                const listingDoc = await getDocs(query(collection(db, 'listings'), where('__name__', '==', listingId)));
                if (!listingDoc.empty) {
                    return { id: listingDoc.docs[0].id, ...listingDoc.docs[0].data() };
                }
                return null;
            });

            const listingsData = await Promise.all(listingsPromises);
            setFavorites(listingsData.filter(l => l !== null));
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (listingId) => {
        try {
            const q = query(
                collection(db, 'favorites'),
                where('userId', '==', user.uid),
                where('listingId', '==', listingId)
            );
            const snapshot = await getDocs(q);

            snapshot.forEach(async (docSnapshot) => {
                await deleteDoc(doc(db, 'favorites', docSnapshot.id));
            });

            setFavorites(favorites.filter(f => f.id !== listingId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <main className="container" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    My Favorites ❤️
                </h1>
                <p style={{ color: '#94a3b8' }}>
                    {favorites.length} {favorites.length === 1 ? 'listing' : 'listings'} saved
                </p>
            </header>

            {favorites.length === 0 ? (
                <div className="glass flex-center" style={{ padding: '4rem 2rem', flexDirection: 'column', gap: '1rem' }}>
                    <Heart size={64} color="#94a3b8" />
                    <h2 style={{ fontSize: '1.5rem', color: '#cbd5e1' }}>No favorites yet</h2>
                    <p style={{ color: '#94a3b8', textAlign: 'center' }}>
                        Start exploring and save your favorite boardings!
                    </p>
                    <button onClick={() => router.push('/student/dashboard')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Browse Listings
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {favorites.map((listing) => (
                        <div key={listing.id} className="glass" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                            {/* Remove Favorite Button */}
                            <button
                                onClick={() => removeFavorite(listing.id)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(0,0,0,0.7)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Heart size={20} fill="#ef4444" color="#ef4444" />
                            </button>

                            {/* Image */}
                            {listing.images && listing.images[0] && (
                                <img
                                    src={listing.images[0]}
                                    alt={listing.name}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                            )}

                            {/* Content */}
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    {listing.name}
                                </h3>
                                <p style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                    Rs. {listing.price?.toLocaleString()}/mo
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                    <MapPin size={16} />
                                    <span style={{ fontSize: '0.9rem' }}>{listing.address}</span>
                                </div>

                                {/* Amenities */}
                                {listing.amenities && listing.amenities.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                        {listing.amenities.map((amenity, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    color: 'var(--primary)',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => window.open(`https://wa.me/${listing.contact}`, '_blank')}
                                        className="btn"
                                        style={{ flex: 1, background: '#22c55e', gap: '0.5rem' }}
                                    >
                                        <Phone size={16} /> Contact
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`, '_blank')}
                                        className="btn"
                                        style={{ flex: 1, gap: '0.5rem' }}
                                    >
                                        <Navigation size={16} /> Navigate
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </main>
    );
}

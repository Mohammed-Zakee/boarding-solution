'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Phone, Navigation, Wifi, Wind, Coffee, Bath, Star, MessageSquare, Heart } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const map = useMap();

    useEffect(() => {
        // Request high accuracy GPS location
        map.locate({
            setView: true,
            maxZoom: 17,
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds timeout
            maximumAge: 0, // Don't use cached position
            watch: false // Get position once
        }).on("locationfound", function (e) {
            setPosition(e.latlng);
            setAccuracy(e.accuracy);
            map.flyTo(e.latlng, 17); // Zoom closer for accuracy
        }).on("locationerror", function (e) {
            console.error("Location error:", e.message);
            alert("Unable to get your precise location. Please enable GPS and location permissions.");
        });
    }, [map]);

    return position === null ? null : (
        <>
            <Marker position={position}>
                <Popup>
                    <div style={{ textAlign: 'center' }}>
                        <strong>📍 You are here</strong>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                            Accuracy: ±{Math.round(accuracy)}m
                        </p>
                    </div>
                </Popup>
            </Marker>
            {/* Accuracy circle */}
            {accuracy && (
                <Circle
                    center={position}
                    radius={accuracy}
                    pathOptions={{
                        color: '#6366f1',
                        fillColor: '#6366f1',
                        fillOpacity: 0.1
                    }}
                />
            )}
        </>
    );
};

const AmenityIcon = ({ name }) => {
    if (name === 'WiFi') return <Wifi size={14} />;
    if (name === 'AC') return <Wind size={14} />;
    if (name === 'Food') return <Coffee size={14} />;
    if (name === 'Attached Bathroom') return <Bath size={14} />;
    return null;
};

const FavoriteButton = ({ listingId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteDocId, setFavoriteDocId] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) return;

        const checkFavorite = async () => {
            const q = query(
                collection(db, 'favorites'),
                where('userId', '==', auth.currentUser.uid),
                where('listingId', '==', listingId)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                setIsFavorite(true);
                setFavoriteDocId(snapshot.docs[0].id);
            }
        };
        checkFavorite();
    }, [listingId]);

    const toggleFavorite = async () => {
        if (!auth.currentUser) {
            alert('Please login to save favorites!');
            return;
        }

        try {
            if (isFavorite && favoriteDocId) {
                // Remove from favorites
                await deleteDoc(doc(db, 'favorites', favoriteDocId));
                setIsFavorite(false);
                setFavoriteDocId(null);
            } else {
                // Add to favorites
                const docRef = await addDoc(collection(db, 'favorites'), {
                    userId: auth.currentUser.uid,
                    listingId,
                    createdAt: new Date().toISOString()
                });
                setIsFavorite(true);
                setFavoriteDocId(docRef.id);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
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
            <Heart
                size={18}
                fill={isFavorite ? '#ef4444' : 'none'}
                color={isFavorite ? '#ef4444' : 'white'}
            />
        </button>
    );
};

const Reviews = ({ listingId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "reviews"), where("listingId", "==", listingId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = [];
            snapshot.forEach((doc) => {
                fetchedReviews.push({ id: doc.id, ...doc.data() });
            });
            setReviews(fetchedReviews);
        });
        return () => unsubscribe();
    }, [listingId]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) {
            alert("Please login to leave a review!");
            return;
        }

        await addDoc(collection(db, "reviews"), {
            listingId,
            userId: auth.currentUser.uid,
            userName: auth.currentUser.email.split('@')[0], // Simple username
            text: newReview,
            rating,
            createdAt: new Date().toISOString()
        });
        setNewReview('');
        setShowForm(false);
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "New";

    return (
        <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: '#f59e0b' }}>
                    <Star size={14} fill="#f59e0b" /> {avgRating} <span style={{ color: '#94a3b8', fontWeight: 'normal', fontSize: '0.8rem' }}>({reviews.length})</span>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.8rem' }}>
                    {showForm ? 'Cancel' : 'Write Review'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={submitReview} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        {[1, 2, 3, 4, 5].map(r => (
                            <Star
                                key={r}
                                size={16}
                                fill={r <= rating ? "#f59e0b" : "none"}
                                color={r <= rating ? "#f59e0b" : "#cbd5e1"}
                                onClick={() => setRating(r)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Share your experience..."
                        style={{ width: '100%', padding: '0.25rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        required
                    />
                    <button type="submit" style={{ width: '100%', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem', marginTop: '0.25rem', cursor: 'pointer' }}>
                        Post
                    </button>
                </form>
            )}

            <div style={{ maxHeight: '80px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {reviews.map(r => (
                    <div key={r.id} style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.25rem', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold' }}>{r.userName}</span>
                            <span style={{ color: '#f59e0b' }}>★ {r.rating}</span>
                        </div>
                        <p style={{ margin: 0, color: '#64748b' }}>{r.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Map({ boardings }) {
    return (
        <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            {boardings.map((b) => (
                <Marker key={b.id} position={[b.lat, b.lng]}>
                    <Popup>
                        <div style={{ color: '#1e293b', minWidth: '240px', position: 'relative' }}>
                            <FavoriteButton listingId={b.id} />
                            {b.images && b.images[0] && (
                                <img src={b.images[0]} alt={b.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                            )}
                            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 'bold' }}>{b.name}</h3>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6366f1', fontWeight: 'bold' }}>Rs. {b.price?.toLocaleString()}/mo</p>

                            {b.amenities && b.amenities.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', color: '#64748b' }}>
                                    {b.amenities.map((a, i) => <AmenityIcon key={i} name={a} />)}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <button
                                    style={{ flex: 1, padding: '0.4rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                    onClick={() => window.open(`https://wa.me/${b.contact}`, '_blank')}
                                >
                                    <Phone size={14} /> Chat
                                </button>
                                <button
                                    style={{ flex: 1, padding: '0.4rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`, '_blank')}
                                >
                                    <Navigation size={14} /> Go
                                </button>
                            </div>

                            <Reviews listingId={b.id} />
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';

export default function BrokerDashboard() {
    const [listings, setListings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchListings(currentUser.uid);
            } else {
                router.push('/auth/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const fetchListings = async (uid) => {
        const q = query(collection(db, "listings"), where("brokerId", "==", uid));
        const querySnapshot = await getDocs(q);
        const fetchedListings = [];
        querySnapshot.forEach((doc) => {
            fetchedListings.push({ id: doc.id, ...doc.data() });
        });
        setListings(fetchedListings);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setUploading(true);

        const formData = new FormData(e.target);
        const images = e.target.photos.files;
        const imageUrls = [];

        try {
            // Import utilities dynamically
            const { compressImage, fileToBase64, geocodeAddress } = await import('@/lib/utils');

            // Compress and Convert Images to Base64
            for (let i = 0; i < images.length; i++) {
                const file = images[i];

                // Compress the image first
                const compressedFile = await compressImage(file);

                // Convert to Base64
                const base64 = await fileToBase64(compressedFile);
                imageUrls.push(base64);
            }

            // Get Amenities
            const amenities = [];
            if (formData.get('wifi')) amenities.push('WiFi');
            if (formData.get('ac')) amenities.push('AC');
            if (formData.get('food')) amenities.push('Food');
            if (formData.get('attached_bathroom')) amenities.push('Attached Bathroom');

            // Get real coordinates from address
            const address = formData.get('address');
            const location = await geocodeAddress(address);

            const newListing = {
                brokerId: user.uid,
                brokerEmail: user.email,
                name: formData.get('name'),
                price: parseInt(formData.get('price')),
                address: location.formattedAddress || address,
                contact: formData.get('contact'),
                gender: formData.get('gender'),
                amenities: amenities,
                images: imageUrls,
                lat: location.lat,
                lng: location.lng,
                status: 'Available',
                verified: false, // Will be set to true after admin verification
                viewCount: 0,
                favoriteCount: 0,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, "listings"), newListing);
            setListings([...listings, { id: docRef.id, ...newListing }]);
            e.target.reset();
            alert('Listing added successfully! 🎉');
        } catch (error) {
            console.error("Error adding listing: ", error);
            alert("Failed to add listing. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const markAsSold = async (id) => {
        try {
            const listingRef = doc(db, "listings", id);
            await updateDoc(listingRef, { status: "Sold Out" });
            setListings(listings.map(l => l.id === id ? { ...l, status: 'Sold Out' } : l));
        } catch (error) {
            console.error("Error updating listing: ", error);
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;

    return (
        <main className="container" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
            <header className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Broker Dashboard</h1>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    B
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Upload Form */}
                <div className="glass" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Add New Listing</h2>
                    <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Property Name</label>
                            <input name="name" type="text" required className="input-field" placeholder="e.g. Colombo Uni Annex" />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Price (LKR/Month)</label>
                                <input name="price" type="number" required className="input-field" placeholder="15000" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Gender</label>
                                <select name="gender" className="input-field" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                    <option value="Any">Any</option>
                                    <option value="Boys">Boys Only</option>
                                    <option value="Girls">Girls Only</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Address / Location</label>
                            <input name="address" type="text" required className="input-field" placeholder="No 123, Galle Road, Colombo 03" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Contact (WhatsApp)</label>
                            <input name="contact" type="text" required className="input-field" placeholder="94771234567" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Amenities</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <label className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="wifi" /> WiFi
                                </label>
                                <label className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="ac" /> AC
                                </label>
                                <label className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="attached_bathroom" /> Attached Bath
                                </label>
                                <label className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" name="food" /> Food
                                </label>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Photos</label>
                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                <input type="file" name="photos" multiple accept="image/*" className="input-field" style={{ padding: '0.5rem' }} />
                                <Upload size={20} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={uploading} className="btn btn-primary" style={{ marginTop: '1rem', opacity: uploading ? 0.7 : 1 }}>
                            {uploading ? 'Uploading...' : 'Post Listing'}
                        </button>
                    </form>
                </div>

                {/* My Listings */}
                <div className="glass" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>My Listings</h2>
                    {listings.length === 0 ? (
                        <p style={{ color: '#94a3b8' }}>No listings yet.</p>
                    ) : (
                        <div className="flex-col" style={{ gap: '1rem' }}>
                            {listings.map(l => (
                                <div key={l.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem' }}>
                                    {l.images && l.images[0] && (
                                        <img src={l.images[0]} alt="Property" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: 'bold' }}>{l.name}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Rs. {l.price.toLocaleString()}</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{l.gender}</span>
                                            <span style={{ fontSize: '0.8rem', color: l.status === 'Available' ? '#4ade80' : '#f87171' }}>{l.status}</span>
                                        </div>
                                    </div>
                                    {l.status === 'Available' && (
                                        <button onClick={() => markAsSold(l.id)} className="btn" style={{ padding: '0.5rem', height: 'fit-content', fontSize: '0.8rem', background: '#f43f5e', color: 'white' }}>
                                            Sold
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

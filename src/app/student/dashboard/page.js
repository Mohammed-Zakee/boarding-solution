'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Filter, X } from 'lucide-react';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function StudentDashboard() {
    const [boardings, setBoardings] = useState([]);
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [maxPrice, setMaxPrice] = useState(50000);
    const [gender, setGender] = useState('Any');
    const [amenities, setAmenities] = useState([]);

    useEffect(() => {
        fetchBoardings();
    }, []);

    const fetchBoardings = async () => {
        const q = query(collection(db, "listings"), where("status", "==", "Available"));
        const querySnapshot = await getDocs(q);
        const fetchedBoardings = [];
        querySnapshot.forEach((doc) => {
            fetchedBoardings.push({ id: doc.id, ...doc.data() });
        });
        setBoardings(fetchedBoardings);
    };

    const toggleAmenity = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter(a => a !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    };

    const filteredBoardings = boardings.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.address.toLowerCase().includes(search.toLowerCase());
        const matchesPrice = b.price <= maxPrice;
        const matchesGender = gender === 'Any' || b.gender === gender || b.gender === 'Any';
        const matchesAmenities = amenities.every(a => b.amenities && b.amenities.includes(a));

        return matchesSearch && matchesPrice && matchesGender && matchesAmenities;
    });

    return (
        <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '5rem' }}>
            <header className="glass" style={{ padding: '1rem', zIndex: 1000, position: 'absolute', top: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Find Boarding</h1>

                <div className="flex-center" style={{ gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search location..."
                        className="input-field"
                        style={{ padding: '0.5rem', width: '200px', background: 'rgba(0,0,0,0.5)' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn"
                        style={{ padding: '0.5rem', background: showFilters ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: 'white' }}
                    >
                        <Filter size={20} />
                    </button>

                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        S
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="glass animate-fade-in" style={{ width: '100%', marginTop: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'bold' }}>Filters</h3>
                            <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Max Price: Rs. {maxPrice.toLocaleString()}</label>
                                <input
                                    type="range"
                                    min="5000"
                                    max="100000"
                                    step="1000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                    style={{ width: '200px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="input-field"
                                    style={{ padding: '0.25rem', width: '150px' }}
                                >
                                    <option value="Any">Any</option>
                                    <option value="Boys">Boys Only</option>
                                    <option value="Girls">Girls Only</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Amenities</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['WiFi', 'AC', 'Attached Bathroom', 'Food'].map(a => (
                                        <button
                                            key={a}
                                            onClick={() => toggleAmenity(a)}
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: amenities.includes(a) ? 'var(--primary)' : 'transparent',
                                                color: 'white',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <div style={{ flex: 1, width: '100%', height: '100%' }}>
                <Map boardings={filteredBoardings} />
            </div>
        </main>
    );
}

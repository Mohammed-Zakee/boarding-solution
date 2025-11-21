'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, Home, DollarSign, Flag, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalListings: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentListings: []
    });
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchDashboardData();
            } else {
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchDashboardData = async () => {
        try {
            // Fetch all listings
            const listingsSnapshot = await getDocs(collection(db, 'listings'));
            const listings = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch all users
            const usersSnapshot = await getDocs(collection(db, 'users'));

            // Fetch reports
            const reportsSnapshot = await getDocs(collection(db, 'reports'));
            const reportsData = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Calculate stats
            const totalRevenue = listings.reduce((sum, l) => sum + (l.price || 0), 0);
            const recentListings = listings
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setStats({
                totalListings: listings.length,
                totalUsers: usersSnapshot.size,
                totalRevenue,
                recentListings
            });
            setReports(reportsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async (reportId, action) => {
        try {
            if (action === 'delete') {
                await deleteDoc(doc(db, 'reports', reportId));
                setReports(reports.filter(r => r.id !== reportId));
            } else if (action === 'resolve') {
                await updateDoc(doc(db, 'reports', reportId), { status: 'resolved' });
                setReports(reports.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
            }
        } catch (error) {
            console.error('Error handling report:', error);
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    return (
        <main className="container" style={{ minHeight: '100vh', padding: '2rem 1rem', paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Admin Dashboard
                </h1>
                <p style={{ color: '#94a3b8' }}>Platform overview and management</p>
            </header>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Listings</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalListings}</h2>
                        </div>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Home size={24} color="#6366f1" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.9rem' }}>
                        <TrendingUp size={16} />
                        <span>Active</span>
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Users</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</h2>
                        </div>
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Users size={24} color="#22c55e" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.9rem' }}>
                        <TrendingUp size={16} />
                        <span>Growing</span>
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Value</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rs. {stats.totalRevenue.toLocaleString()}</h2>
                        </div>
                        <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <DollarSign size={24} color="#fbbf24" />
                        </div>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Combined monthly rent</p>
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Reports</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{reports.length}</h2>
                        </div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                            <Flag size={24} color="#ef4444" />
                        </div>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pending review</p>
                </div>
            </div>

            {/* Recent Listings */}
            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Listings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stats.recentListings.map(listing => (
                        <div key={listing.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {listing.images && listing.images[0] && (
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.name}
                                        style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                )}
                                <div>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{listing.name}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{listing.address}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                    Rs. {listing.price?.toLocaleString()}/mo
                                </p>
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: listing.status === 'Available' ? '#22c55e' : '#ef4444'
                                }}>
                                    {listing.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reports Section */}
            {reports.length > 0 && (
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        User Reports
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reports.map(report => (
                            <div key={report.id} style={{
                                padding: '1rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{report.reason}</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{report.description}</p>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        background: report.status === 'resolved' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: report.status === 'resolved' ? '#22c55e' : '#ef4444'
                                    }}>
                                        {report.status || 'Pending'}
                                    </span>
                                </div>
                                {report.status !== 'resolved' && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => handleReport(report.id, 'resolve')}
                                            className="btn"
                                            style={{ padding: '0.5rem 1rem', background: '#22c55e', gap: '0.5rem' }}
                                        >
                                            <CheckCircle size={16} /> Resolve
                                        </button>
                                        <button
                                            onClick={() => handleReport(report.id, 'delete')}
                                            className="btn"
                                            style={{ padding: '0.5rem 1rem', background: '#ef4444', gap: '0.5rem' }}
                                        >
                                            <XCircle size={16} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Users, MapPin, DollarSign, Calendar, Trash2, MessageCircle, Plus } from 'lucide-react';

export default function RoommateFinder() {
    const [posts, setPosts] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        budget: '',
        moveInDate: '',
        roommates: 1,
        gender: 'Any',
        description: ''
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchPosts(currentUser.uid);
            } else {
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchPosts = async (userId) => {
        try {
            // Fetch all posts
            const q = query(collection(db, 'roommates'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Separate my posts from others
            const myPostsList = allPosts.filter(p => p.userId === userId);
            const otherPosts = allPosts.filter(p => p.userId !== userId);

            setPosts(otherPosts);
            setMyPosts(myPostsList);
        } catch (error) {
            console.error('Error fetching roommate posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newPost = {
                ...formData,
                userId: user.uid,
                userName: user.displayName || user.email.split('@')[0],
                userEmail: user.email,
                budget: parseInt(formData.budget),
                roommates: parseInt(formData.roommates),
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'roommates'), newPost);
            setMyPosts([{ id: docRef.id, ...newPost }, ...myPosts]);

            // Reset form
            setFormData({
                title: '',
                location: '',
                budget: '',
                moveInDate: '',
                roommates: 1,
                gender: 'Any',
                description: ''
            });
            setShowForm(false);
            alert('Post created successfully! 🎉');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        }
    };

    const deletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await deleteDoc(doc(db, 'roommates', postId));
            setMyPosts(myPosts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const contactUser = (email) => {
        window.location.href = `mailto:${email}?subject=Roommate Inquiry`;
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const PostCard = ({ post, isMine = false }) => (
        <div className="glass" style={{ padding: '1.5rem', position: 'relative' }}>
            {isMine && (
                <button
                    onClick={() => deletePost(post.id)}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#ef4444',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Trash2 size={16} />
                </button>
            )}

            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', paddingRight: isMine ? '2rem' : 0 }}>
                {post.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} />
                    <span>{post.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={16} />
                    <span>Budget: Rs. {post.budget?.toLocaleString()}/mo</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} />
                    <span>Looking for {post.roommates} roommate{post.roommates > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} />
                    <span>Move-in: {new Date(post.moveInDate).toLocaleDateString()}</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                }}>
                    {post.gender}
                </span>
            </div>

            <p style={{ color: '#cbd5e1', marginBottom: '1rem', lineHeight: '1.6' }}>
                {post.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Posted by {post.userName}
                </span>
                {!isMine && (
                    <button
                        onClick={() => contactUser(post.userEmail)}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', gap: '0.5rem' }}
                    >
                        <MessageCircle size={16} /> Contact
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <main className="container" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Roommate Finder 🤝
                    </h1>
                    <p style={{ color: '#94a3b8' }}>
                        Find the perfect roommate to share your boarding
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                    style={{ gap: '0.5rem' }}
                >
                    <Plus size={20} /> {showForm ? 'Cancel' : 'Create Post'}
                </button>
            </header>

            {/* Create Post Form */}
            {showForm && (
                <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        Create Roommate Post
                    </h2>
                    <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input-field"
                                placeholder="e.g., Looking for 2 roommates near University of Colombo"
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Colombo 07"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Budget (LKR/month)</label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="input-field"
                                    placeholder="15000"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Roommates Needed</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={formData.roommates}
                                    onChange={(e) => setFormData({ ...formData, roommates: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Gender Preference</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="input-field"
                                    style={{ background: 'rgba(0,0,0,0.2)' }}
                                >
                                    <option value="Any">Any</option>
                                    <option value="Boys Only">Boys Only</option>
                                    <option value="Girls Only">Girls Only</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Move-in Date</label>
                                <input
                                    type="date"
                                    value={formData.moveInDate}
                                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-field"
                                placeholder="Tell us about yourself and what you're looking for in a roommate..."
                                rows={4}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Post
                        </button>
                    </form>
                </div>
            )}

            {/* My Posts */}
            {myPosts.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        My Posts ({myPosts.length})
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {myPosts.map(post => <PostCard key={post.id} post={post} isMine={true} />)}
                    </div>
                </div>
            )}

            {/* All Posts */}
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Available Roommates ({posts.length})
                </h2>
                {posts.length === 0 ? (
                    <div className="glass flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem' }}>
                        <Users size={64} color="#94a3b8" />
                        <p style={{ color: '#94a3b8' }}>No roommate posts yet. Be the first to post!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {posts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                )}
            </div>

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

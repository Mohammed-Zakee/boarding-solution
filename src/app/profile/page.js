'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Shield, LogOut, Camera } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        displayName: '',
        phone: '',
        bio: '',
        photoURL: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Fetch user profile from Firestore
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setProfile(userDoc.data());
                } else {
                    // Initialize with auth data
                    setProfile({
                        displayName: currentUser.displayName || '',
                        phone: '',
                        bio: '',
                        photoURL: currentUser.photoURL || ''
                    });
                }
            } else {
                router.push('/auth/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Update Firebase Auth profile
            await updateProfile(auth.currentUser, {
                displayName: profile.displayName,
                photoURL: profile.photoURL
            });

            // Save to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                ...profile,
                email: user.email,
                updatedAt: new Date().toISOString()
            });

            alert('Profile updated successfully! ✅');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { compressImage, fileToBase64 } = await import('@/lib/utils');
            const compressed = await compressImage(file);
            const base64 = await fileToBase64(compressed);
            setProfile({ ...profile, photoURL: base64 });
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo.');
        }
    };

    const handleVerifyEmail = async () => {
        try {
            await sendEmailVerification(auth.currentUser);
            alert('Verification email sent! Check your inbox. 📧');
        } catch (error) {
            console.error('Error sending verification:', error);
            alert('Failed to send verification email.');
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/');
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
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <header className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Profile</h1>
                    <button onClick={handleLogout} className="btn" style={{ background: '#ef4444', gap: '0.5rem' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </header>

                <div className="glass" style={{ padding: '2rem' }}>
                    {/* Profile Photo */}
                    <div className="flex-center" style={{ flexDirection: 'column', marginBottom: '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: profile.photoURL ? `url(${profile.photoURL})` : 'var(--secondary)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {!profile.photoURL && (profile.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                            </div>
                            <label style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: 'var(--primary)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '3px solid var(--bg)'
                            }}>
                                <Camera size={18} />
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>

                    {/* Email Verification Status */}
                    {!user?.emailVerified && (
                        <div style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid #fbbf24',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={20} color="#fbbf24" />
                                <span style={{ color: '#fbbf24' }}>Email not verified</span>
                            </div>
                            <button onClick={handleVerifyEmail} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                Verify Now
                            </button>
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSave} className="flex-col" style={{ gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                                <User size={18} /> Display Name
                            </label>
                            <input
                                type="text"
                                value={profile.displayName}
                                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                className="input-field"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                                <Mail size={18} /> Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input-field"
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                            <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Email cannot be changed</small>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                                <Phone size={18} /> Phone Number
                            </label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="input-field"
                                placeholder="+94 77 123 4567"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                                Bio
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="input-field"
                                placeholder="Tell us about yourself..."
                                rows={4}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" disabled={saving} className="btn btn-primary">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
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

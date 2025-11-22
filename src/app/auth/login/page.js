'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Modal from '@/components/Modal';

export default function Login() {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'error', title: '', message: '' });
    const router = useRouter();

    const showModal = (type, title, message) => {
        setModal({ isOpen: true, type, title, message });
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check user role in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role !== role) {
                    showModal(
                        'warning',
                        'Wrong Account Type',
                        `This account is registered as a ${userData.role}, not a ${role}. Please switch to the correct tab.`
                    );
                    setLoading(false);
                    return;
                }

                // Success! Navigate to dashboard
                if (role === 'student') {
                    router.push('/student/dashboard');
                } else {
                    router.push('/broker/dashboard');
                }
            } else {
                // Fallback if no user doc found (shouldn't happen)
                router.push('/');
            }

        } catch (error) {
            console.error("Login Error:", error);
            showModal(
                'error',
                'Login Failed',
                'Invalid email or password. Please check your credentials and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                confirmText="OK"
            />

            <main className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
                <div className="glass animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                    <h2 className="text-center text-gradient" style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
                        Welcome Back
                    </h2>

                    <div className="flex-center" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '0.25rem' }}>
                        <button
                            className={`btn ${role === 'student' ? 'btn-primary' : ''}`}
                            style={{ flex: 1, borderRadius: '999px', padding: '0.5rem', background: role === 'student' ? undefined : 'transparent', boxShadow: role === 'student' ? undefined : 'none' }}
                            onClick={() => setRole('student')}
                        >
                            Student
                        </button>
                        <button
                            className={`btn ${role === 'broker' ? 'btn-primary' : ''}`}
                            style={{ flex: 1, borderRadius: '999px', padding: '0.5rem', background: role === 'broker' ? undefined : 'transparent', boxShadow: role === 'broker' ? undefined : 'none' }}
                            onClick={() => setRole('broker')}
                        >
                            Broker
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="flex-col" style={{ gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Email</label>
                            <input type="email" required className="input-field" placeholder="Enter your email" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Password</label>
                            <input type="password" required className="input-field" placeholder="Enter your password" />
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <Link href="/auth/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Logging in...' : `Login as ${role === 'student' ? 'Student' : 'Broker'}`}
                        </button>
                    </form>

                    <p className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Don't have an account? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register</Link>
                    </p>
                </div>
            </main>
        </>
    );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function Register() {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Save User Profile to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                role: role,
                createdAt: new Date().toISOString()
            });

            alert("Account created successfully!");

            // 3. Redirect based on role
            if (role === 'student') {
                router.push('/student/dashboard');
            } else {
                router.push('/broker/dashboard');
            }
        } catch (error) {
            console.error("Registration Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <div className="glass animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center text-gradient" style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
                    Create Account
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

                <form onSubmit={handleRegister} className="flex-col" style={{ gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Full Name</label>
                        <input type="text" required className="input-field" placeholder="John Doe" />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Email</label>
                        <input type="email" required className="input-field" placeholder="john@example.com" />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Password</label>
                        <input type="password" required className="input-field" placeholder="Create a password" />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Creating Account...' : `Register as ${role === 'student' ? 'Student' : 'Broker'}`}
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                    Already have an account? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </main>
    );
}

'use client';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Modal from '@/components/Modal';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'error', title: '', message: '' });
    const router = useRouter();

    const showModal = (type, title, message) => {
        setModal({ isOpen: true, type, title, message });
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSent(true);
        } catch (error) {
            console.error('Error sending reset email:', error);
            let errorMessage = 'Failed to send reset email. Please try again.';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            }

            showModal('error', 'Reset Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <>
                <Modal
                    isOpen={modal.isOpen}
                    onClose={closeModal}
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                />

                <main className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
                    <div className="glass" style={{ padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            borderRadius: '50%',
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CheckCircle size={40} color="#22c55e" />
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Email Sent! ✅
                        </h1>
                        <p style={{ color: '#94a3b8', marginBot tom: '2rem', lineHeight: '1.6' }}>
                            We've sent a password reset link to <strong style={{ color: 'var(--primary)' }}>{email}</strong>.
                            <br />Check your inbox and follow the instructions.
                        </p>
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="btn btn-primary"
                            style={{ width: '100%', gap: '0.5rem' }}
                        >
                            <ArrowLeft size={18} /> Back to Login
                        </button>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            />

            <main className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
                <div className="glass" style={{ padding: '2.5rem', maxWidth: '450px', width: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Forgot Password?
                        </h1>
                        <p style={{ color: '#94a3b8' }}>
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                                <Mail size={18} /> Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/auth/login')}
                            className="btn"
                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', gap: '0.5rem' }}
                        >
                            <ArrowLeft size={18} /> Back to Login
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}

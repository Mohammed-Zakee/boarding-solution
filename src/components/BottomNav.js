'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Map, Heart, Users, User, LayoutDashboard } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Determine role from email or custom claims
                // For now, we'll use a simple check
                const role = user.email?.includes('broker') ? 'broker' : 'student';
                setUserRole(role);
            }
        });
        return () => unsubscribe();
    }, []);

    // Don't show nav on auth pages or landing page
    if (!pathname || pathname === '/' || pathname.startsWith('/auth')) {
        return null;
    }

    const studentNavItems = [
        { icon: Map, label: 'Explore', path: '/student/dashboard' },
        { icon: Heart, label: 'Favorites', path: '/favorites' },
        { icon: Users, label: 'Roommates', path: '/roommates' },
        { icon: User, label: 'Profile', path: '/profile' }
    ];

    const brokerNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/broker/dashboard' },
        { icon: User, label: 'Profile', path: '/profile' }
    ];

    const navItems = userRole === 'broker' ? brokerNavItems : studentNavItems;

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.75rem 0',
            zIndex: 1000,
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'none',
                                border: 'none',
                                color: isActive ? 'var(--primary)' : '#94a3b8',
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                transition: 'all 0.3s',
                                transform: isActive ? 'translateY(-2px)' : 'none'
                            }}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: isActive ? 'bold' : 'normal'
                            }}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

'use client';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function FloatingElement({ delay, x, y, rotate, children }) {
  return (
    <motion.div
      initial={{ x: 0, y: 0, rotate: 0 }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      style={{ position: 'absolute', left: x, top: y, zIndex: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="flex-col" style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>

      {/* Hero Section */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

        {/* Background Animated Blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -1 }}>
          <motion.div
            animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
            style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)' }}
          />
          <motion.div
            animate={{ x: mousePosition.x, y: mousePosition.y }}
            style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)' }}
          />
        </div>

        {/* 3D Floating Elements (Simulated) */}
        <div className="hidden-mobile" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <FloatingElement delay={0} x="15%" y="20%">
            <div className="glass" style={{ padding: '1rem', transform: 'rotate(-10deg)' }}>
              <MapPin size={32} color="#6366f1" />
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Near Campus</p>
            </div>
          </FloatingElement>

          <FloatingElement delay={2} x="75%" y="30%">
            <div className="glass" style={{ padding: '1rem', transform: 'rotate(10deg)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4ade80' }}>$150/mo</p>
            </div>
          </FloatingElement>

          <FloatingElement delay={1} x="80%" y="70%">
            <div className="glass" style={{ padding: '1rem', transform: 'rotate(-5deg)' }}>
              <Shield size={32} color="#ec4899" />
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Verified</p>
            </div>
          </FloatingElement>
        </div>

        <div className="container glass" style={{ padding: '4rem 2rem', maxWidth: '900px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.2)', borderRadius: '99px', color: '#a5b4fc', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(99,102,241,0.3)' }}>
              🚀 The #1 Student Housing App
            </span>

            <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Find Your Home <br /> Away From Home.
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              Stop dealing with shady brokers. Connect directly with verified owners, check real-time availability, and secure your spot in minutes.
            </p>

            <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/auth/login" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                Get Started <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
              <Link href="#features" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Why Students Love Us</h2>
            <p style={{ color: '#94a3b8' }}>Built by students, for students. We know the struggle.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: MapPin, title: "Radius Search", desc: "Find boardings within 100m of your campus or current location." },
              { icon: Zap, title: "Direct Contact", desc: "No middlemen. Chat directly with the owner via WhatsApp." },
              { icon: Shield, title: "Verified Listings", desc: "We verify every listing to ensure you don't get scammed." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass"
                style={{ padding: '2rem', textAlign: 'left' }}
              >
                <div style={{ width: '50px', height: '50px', background: 'rgba(99,102,241,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <feature.icon color="#818cf8" size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

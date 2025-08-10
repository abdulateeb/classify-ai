import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ImpactSection } from './components/ImpactSection';
import ImageUpload from './components/ImageUpload';
import Footer from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <div className="flex-1 text-white transition-colors">
        <div className="bg-black">
          <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
          <Hero />
          <HowItWorks />
          <main>
            <ImageUpload />
          </main>
        </div>
        <ImpactSection />
        <div style={{ background: 'linear-gradient(135deg, rgb(2, 6, 23) 0%, rgb(15, 23, 42) 50%, rgb(30, 41, 59) 100%)' }}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
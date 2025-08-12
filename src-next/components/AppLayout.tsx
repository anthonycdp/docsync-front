import React from 'react';
import { MainContent } from './MainContent';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/10">
      {/* CKDEV-NOTE: Main content area with flex-1 to push footer down */}
      <MainContent />
      
      {/* CKDEV-NOTE: Footer automatically positioned at bottom */}
      <Footer />
    </div>
  );
}
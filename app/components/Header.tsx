import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 flex flex-col items-center justify-center text-white shadow-lg">
      {/* Main Text */}
      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse">ECL</h1>
      
      {/* Subtitle */}
      <p className="text-xs md:text-xl font-medium">نحو التطور و الإبداع</p>
    </header>
  );
};

export default Header;
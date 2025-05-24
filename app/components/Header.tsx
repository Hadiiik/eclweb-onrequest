import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="relative w-full py-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 flex flex-col items-center justify-center text-white shadow-lg">
      {/* Info Icon Link */}
      <Link
        href={"/info"}
        className="m-1 absolute top-2 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors shadow-md"
        aria-label="معلومات"
      >
        <span className="text-emerald-600 text-base font-bold">i</span>
      </Link>
      {/* Main Text */}
      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse">ECL</h1>
      {/* Subtitle */}
      <p className="text-xs md:text-xl font-medium">نحو التطور و الإبداع</p>
    </header>
  );
};

export default Header;
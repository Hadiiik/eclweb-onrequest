import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-50 text-green-600 flex items-center justify-end py-4 px-6 shadow-lg sticky top-0 z-50">
    <Link className="text-xl font-bold hover:cursor-pointer hover:text-green-700" href={"/"}>
      ECL
    </Link>
  </header>
  );
};

export default Header;
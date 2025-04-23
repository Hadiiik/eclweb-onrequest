import React from 'react';
import Header from './components/Header';
import SearchContainer from './components/SearchContainer';



export default function Home() {
  return (
    <div className="flex flex-col gap-8"> {/* أو استخدم gap-y-8 للتباعد العمودي فقط */}
      <Header />
      <SearchContainer/>
    </div>
  );
}

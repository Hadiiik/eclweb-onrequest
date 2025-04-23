import React from 'react';
import Header from './components/Header';
import Search from './components/Search';


export default function Home() {
  return (
    <div className="flex flex-col gap-8"> {/* أو استخدم gap-y-8 للتباعد العمودي فقط */}
      <Header />
      <div className="px-4"> {/* إضافة padding جانبي للبحث على الهواتف */}
        <Search />
        <footer>
          <a href='/DataEnterance'>إنقلع الى صفحة الإدخال</a>
        </footer>
      </div>
    </div>
  );
}

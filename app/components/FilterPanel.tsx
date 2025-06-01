"use client";

import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: {
    category: string[];
    subject: string[];
    type: string[];
    year: string[];
    location?: string[];
  }) => void;
  setIsOpen? : ()=>void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose, onApplyFilters ,setIsOpen}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);

  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(false);
  const [isYearsOpen, setIsYearsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const ninthSubjects = ['عربي', 'علوم', 'رياضيات', 'انكليزي', 'ديانة اسلامية', 'فيزياء', 'كيمياء', 'جغرافيا', 'تاريخ','فرنسي','تركي'];
  const bacScientificSubjects = ['رياضيات', 'فيزياء', 'علوم', 'عربي', 'ديانة اسلامية', 'انكليزي', 'كيمياء','فرنسي','تركي'];
  const bacLiterarySubjects = ['ديانة اسلامية', 'انكليزي', 'عربي', 'تاريخ', 'جغرافيا', 'فلسفة','فرنسي','تركي'];
  const types = ['دورات', 'اوراق عمل', 'اختبارات', 'ملخصات', 'مناهج'];
  const years = Array.from({ length: 11 }, (_, i) => `${2015 + i}`);
  const locations = ['إدلب', 'دمشق','مجالس'];

  // ✅ استرجاع الفلاتر المحفوظة
  useEffect(() => {
  const savedFilters = sessionStorage.getItem('filters');
  if (savedFilters) {
    const filters = JSON.parse(savedFilters);
    if (filters.category) setSelectedCategories(filters.category);
    if (filters.subject) setSelectedSubjects(filters.subject);
    if (filters.type) setSelectedTypes(filters.type);
    if (filters.year) setSelectedYears(filters.year);
    if (filters.location) setSelectedLocation(filters.location);

    // ✅ فتح الأقسام تلقائياً إذا فيها بيانات محفوظة
    if (filters.subject?.length) setIsSubjectsOpen(true);
    if (filters.type?.length) setIsTypesOpen(true);
    if (filters.year?.length) setIsYearsOpen(true);
    if (filters.location?.length) setIsLocationOpen(true);
  }
}, []);


const [didMount, setDidMount] = useState(false);

useEffect(() => {
  const savedFilters = sessionStorage.getItem('filters');
  if (savedFilters) {
    const filters = JSON.parse(savedFilters);
    if (filters.category) setSelectedCategories(filters.category);
    if (filters.subject) setSelectedSubjects(filters.subject);
    if (filters.type) setSelectedTypes(filters.type);
    if (filters.year) setSelectedYears(filters.year);
    if (filters.location) setSelectedLocation(filters.location);
  }
  // بعد التحميل الأول، فعل الكتابة التلقائية
  setDidMount(true);
}, []);

useEffect(() => {
  if (!didMount) return; // لا تحفظ عند أول تحميل
  const filters = {
    category: selectedCategories,
    subject: selectedSubjects,
    type: selectedTypes,
    year: selectedYears,
    location: selectedLocation,
  };
  sessionStorage.setItem('filters', JSON.stringify(filters));
}, [selectedCategories, selectedSubjects, selectedTypes, selectedYears, selectedLocation]);


  const getSubjectsByCategory = () => {
    let allSubjects: Set<string> = new Set();
    if (selectedCategories.includes('تاسع')) ninthSubjects.forEach(sub => allSubjects.add(sub));
    if (selectedCategories.includes('بكلوريا علمي')) bacScientificSubjects.forEach(sub => allSubjects.add(sub));
    if (selectedCategories.includes('بكلوريا ادبي')) bacLiterarySubjects.forEach(sub => allSubjects.add(sub));
    return Array.from(allSubjects);
  };

  const handleApply = () => {
    onApplyFilters({
      category: selectedCategories,
      subject: selectedSubjects,
      type: selectedTypes,
      year: selectedYears,
      location: selectedLocation,
    });
  };

  const toggleSection = (section: string) => {
    setIsSubjectsOpen(section === 'subjects' ? !isSubjectsOpen : false);
    setIsTypesOpen(section === 'types' ? !isTypesOpen : false);
    setIsYearsOpen(section === 'years' ? !isYearsOpen : false);
    setIsLocationOpen(section === 'location' ? !isLocationOpen : false);
  };

  const onClear = () => {
    setSelectedCategories([]);
    setSelectedSubjects([]);
    setSelectedTypes([]);
    setSelectedYears([]);
    setSelectedLocation([]);
    sessionStorage.removeItem('filters');
    onApplyFilters({
      category: [],
      subject: [],
      type: [],
      year: [],
      location: [],
    });
    setIsOpen?.()
    
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      <div className="relative bg-white p-3 rounded-xl shadow-2xl w-full max-w-[95%] md:max-w-md md:mx-2 border border-green-100 px-5 mx-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-green-600">فلاتر البحث</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-green-600 p-1">✕</button>
        </div>

        {/* الفئات */}
        <div className="mb-3">
          <div className="flex flex-wrap justify-center gap-2">
            {['تاسع', 'بكلوريا علمي', 'بكلوريا ادبي'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  if (selectedCategories.includes(category)) {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category));
                  } else {
                    setSelectedCategories([...selectedCategories, category]);
                  }
                  setSelectedSubjects([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategories.includes(category) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* المناهج (الموقع) */}
        <div className="mb-2">
          <button
            className={`w-full flex items-center justify-between p-2 rounded-lg ${selectedLocation.length > 0 ? 'bg-green-100' : 'bg-gray-200'}`}
            onClick={() => toggleSection('location')}
          >
            <span>{selectedLocation.length > 0 ? `تم اختيار ${selectedLocation.length} منهاج` : 'اختر المناهج'}</span>
            {isLocationOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {isLocationOpen && (
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    if (selectedLocation.includes(loc)) {
                      setSelectedLocation(selectedLocation.filter(l => l !== loc));
                    } else {
                      setSelectedLocation([...selectedLocation, loc]);
                    }
                  }}
                  className={`p-1.5 rounded-lg text-xs ${
                    selectedLocation.includes(loc) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* المواد */}
        {selectedCategories.length > 0 && (
          <div className="mb-2">
            <button
              className={`w-full flex items-center justify-between p-2 rounded-lg ${selectedSubjects.length > 0 ? 'bg-green-100' : 'bg-gray-50'}`}
              onClick={() => toggleSection('subjects')}
            >
              <span>{selectedSubjects.length > 0 ? `تم اختيار ${selectedSubjects.length} مادة` : 'اختر المادة'}</span>
              {isSubjectsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {isSubjectsOpen && (
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {getSubjectsByCategory().map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      if (selectedSubjects.includes(subject)) {
                        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
                      } else {
                        setSelectedSubjects([...selectedSubjects, subject]);
                      }
                    }}
                    className={`p-1.5 rounded-lg text-xs ${
                      selectedSubjects.includes(subject) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* السنة */}
        <div className="mb-2">
          <button
            className={`w-full flex items-center justify-between p-2 rounded-lg ${selectedYears.length > 0 ? 'bg-green-100' : 'bg-gray-50'}`}
            onClick={() => toggleSection('years')}
          >
            <span>{selectedYears.length > 0 ? `تم اختيار ${selectedYears.length} سنة` : 'اختر السنة'}</span>
            {isYearsOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {isYearsOpen && (
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    if (selectedYears.includes(year)) {
                      setSelectedYears(selectedYears.filter(y => y !== year));
                    } else {
                      setSelectedYears([...selectedYears, year]);
                    }
                  }}
                  className={`p-1.5 rounded-lg text-xs ${
                    selectedYears.includes(year) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* التصنيفات */}
        <div className="mb-2">
          <button
            className={`w-full flex items-center justify-between p-2 rounded-lg ${selectedTypes.length > 0 ? 'bg-green-100' : 'bg-gray-50'}`}
            onClick={() => toggleSection('types')}
          >
            <span>{selectedTypes.length > 0 ? `تم اختيار ${selectedTypes.length} تصنيف` : 'اختر التصنيف'}</span>
            {isTypesOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {isTypesOpen && (
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    if (selectedTypes.includes(type)) {
                      setSelectedTypes(selectedTypes.filter((t) => t !== type));
                    } else {
                      setSelectedTypes([...selectedTypes, type]);
                    }
                  }}
                  className={`p-1.5 rounded-lg text-xs ${
                    selectedTypes.includes(type) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex justify-between items-center mt-6 mb-2 gap-2">
          <button
            onClick={onClear}
            className="w-1/2 py-1.5 rounded-lg border border-green-400 text-green-500 hover:bg-green-500 hover:text-white transition"
          >
            مسح الكل
          </button>
          <button
            onClick={handleApply}
            className="w-1/2 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
          >
            تطبيق الفلاتر
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

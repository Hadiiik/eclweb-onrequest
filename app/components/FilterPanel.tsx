"use client";

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: {
    category: string;
    subject: string;
    type: string;
    year?: string;
  }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose, onApplyFilters }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(false);
  const [isYearsOpen, setIsYearsOpen] = useState(false);

  // المواد لكل مرحلة
  const ninthSubjects = [
    'عربي', 'علوم', 'رياضيات', 'لغة', 'ديانة اسلامية', 
    'فيزياء', 'كيمياء', 'جغرافيا', 'تاريخ'
  ];

  const bacScientificSubjects = [
    'رياضيات', 'فيزياء', 'علوم', 'عربي',
    'ديانة اسلامية', 'لغة', 'كيمياء'
  ];

  const bacLiterarySubjects = ['ديانة اسلامية','لغة','عربي','تاريخ','جغرافيا', 'فلسفة'];

  const types = ['دورات', 'اوراق عمل', 'اختبارات', 'ملخصات', 'مناهج'];
  const years = Array.from({length: 11}, (_, i) => `${2015 + i}`);

  const handleApply = () => {
    onApplyFilters({
      category: selectedCategory,
      subject: selectedSubject,
      type: selectedType,
      year: selectedYear
    });
  };

  const getSubjectsByCategory = () => {
    if (selectedCategory === 'بكلوريا علمي') return bacScientificSubjects;
    if (selectedCategory === 'بكلوريا ادبي') return bacLiterarySubjects;
    return ninthSubjects;
  };

  const toggleYears = () => {
    setIsYearsOpen(!isYearsOpen);
    setIsSubjectsOpen(false);
    setIsTypesOpen(false);
  };

  const toggleSubjects = () => {
    setIsSubjectsOpen(!isSubjectsOpen);
    setIsYearsOpen(false);
    setIsTypesOpen(false);
  };

  const toggleTypes = () => {
    setIsTypesOpen(!isTypesOpen);
    setIsYearsOpen(false);
    setIsSubjectsOpen(false);
  };

  // دالة لتحديد لون الزر بناءً على ما إذا كان هناك خيار محدد
  const getButtonClass = (hasSelection: boolean, isOpen: boolean) => {
    const baseClass = "w-full flex items-center justify-between p-2 rounded-lg text-sm";
    if (hasSelection) {
      return `${baseClass} bg-green-100 text-green-600 border border-green-300`;
    }
    if (isOpen) {
      return `${baseClass} bg-gray-100 text-gray-700`;
    }
    return `${baseClass} bg-gray-50 text-gray-600`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-3 rounded-xl shadow-2xl w-full max-w-[95%] md:max-w-md mx-2 border border-green-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-green-600">فلاتر البحث</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-green-600 p-1"
          >
            ✕
          </button>
        </div>

        {/* الفئة */}
        <div className="mb-3">
          <div className="flex flex-wrap justify-center gap-2">
            {['تاسع', 'بكلوريا علمي', 'بكلوريا ادبي'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSubject('');
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* السنة */}
        <div className="mb-2">
          <button 
            className={getButtonClass(!!selectedYear, isYearsOpen)}
            onClick={toggleYears}
          >
            <span>{selectedYear || 'اختر السنة'}</span>
            {isYearsOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          {isYearsOpen && (
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsYearsOpen(false);
                  }}
                  className={`p-1.5 rounded-lg text-xs ${
                    selectedYear === year
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* المواد */}
        {selectedCategory && (
          <div className="mb-2">
            <button 
              className={getButtonClass(!!selectedSubject, isSubjectsOpen)}
              onClick={toggleSubjects}
            >
              <span>{selectedSubject || 'اختر المادة'}</span>
              {isSubjectsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {isSubjectsOpen && (
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {getSubjectsByCategory().map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setIsSubjectsOpen(false);
                    }}
                    className={`p-1.5 rounded-lg text-xs ${
                      selectedSubject === subject
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* التصنيف */}
        <div className="mb-2">
          <button 
            className={getButtonClass(!!selectedType, isTypesOpen)}
            onClick={toggleTypes}
          >
            <span>{selectedType || 'اختر التصنيف'}</span>
            {isTypesOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          
          {isTypesOpen && (
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setIsTypesOpen(false);
                  }}
                  className={`p-1.5 rounded-lg text-xs ${
                    selectedType === type
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* أزرار التطبيق */}
        <div className="flex justify-between gap-2 mt-3">
          <button
            onClick={handleApply}
            className="flex-1 py-2 rounded-lg text-sm bg-green-500 text-white hover:bg-green-600"
          >
            تطبيق الفلاتر
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
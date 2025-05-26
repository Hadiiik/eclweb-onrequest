type SearchQuery = {
  search_bar_query: string;
  filters: string[];
  page: string;
};

type SearchResponse = {
  success: boolean;
  data: any;
};

// القيم الصالحة
const ninthSubjects = ['عربي', 'علوم', 'رياضيات', 'انكليزي', 'ديانة اسلامية', 'فيزياء', 'كيمياء', 'جغرافيا', 'تاريخ', 'فرنسي', 'تركي'];
const bacScientificSubjects = ['رياضيات', 'فيزياء', 'علوم', 'عربي', 'ديانة اسلامية', 'انكليزي', 'كيمياء', 'فرنسي', 'تركي'];
const bacLiterarySubjects = ['ديانة اسلامية', 'انكليزي', 'عربي', 'تاريخ', 'جغرافيا', 'فلسفة', 'فرنسي', 'تركي'];
const types = ['دورات', 'اوراق عمل', 'اختبارات', 'ملخصات', 'مناهج'];
const years = Array.from({ length: 11 }, (_, i) => `${2015 + i}`);

const allFilters = Array.from(new Set([
  ...ninthSubjects,
  ...bacScientificSubjects,
  ...bacLiterarySubjects,
  ...types,
  ...years,
  'دمشق',
  'إدلب',
  'مجالس',
]));

// تحويل الأرقام العربية إلى إنجليزية
function convertArabicNumbersToEnglish(str: string): string {
  const arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return str.replace(/[٠-٩]/g, d => arabicNums.indexOf(d).toString());
}

// تطبيع النص العربي
function normalizeArabic(str: string): string {
  return str
    .replace(/[\u064B-\u0652]/g, '')       // إزالة التشكيل
    .replace(/^ال/, '')                    // إزالة "ال" من البداية
    .replace(/[آأإ]/g, 'ا')                // توحيد الهمزات
    .replace(/ة/g, 'ه')                    // توحيد التاء المربوطة
    .replace(/ى/g, 'ي')                    // توحيد الألف المقصورة
    .replace(/ؤ/g, 'و')                    // توحيد همزة واو
    .replace(/ئ/g, 'ي')                    // توحيد همزة ياء
    .replace(/ـ/g, '')                     // إزالة التطويل
    .trim();
}

// تطبيع كامل للكلمة (بما في ذلك الأرقام)
function normalizeWord(str: string): string {
  return normalizeArabic(convertArabicNumbersToEnglish(str));
}

export async function fetchSearchResults(query: SearchQuery): Promise<SearchResponse> {
  const words = query.search_bar_query.split(/\s+/);
  const foundFilters = new Set<string>();

  for (const wordRaw of words) {
    const word = normalizeWord(wordRaw);

    for (const filter of allFilters) {
      const filterNormalized = normalizeWord(filter);

      if (word.length < 3) {
        if (word === filterNormalized) {
          foundFilters.add(filter);
        }
      } else {
        if (
          filterNormalized.includes(word) ||
          word.includes(filterNormalized)
        ) {
          foundFilters.add(filter);
        }
      }
    }
  }

  const processedQuery: SearchQuery = {
    search_bar_query: query.search_bar_query.trim(),
    filters: [...new Set([...query.filters, ...foundFilters])],
    page: query.page,
  };

  const delay = Math.random() * 3000;
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    const response = await fetch('/api/files/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedQuery),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: result.error || "Unknown error occurred",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      data: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

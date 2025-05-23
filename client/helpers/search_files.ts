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
const ninthSubjects = ['عربي', 'علوم', 'رياضيات', 'انكليزي', 'ديانة اسلامية', 'فيزياء', 'كيمياء', 'جغرافيا', 'تاريخ'];
const bacScientificSubjects = ['رياضيات', 'فيزياء', 'علوم', 'عربي', 'ديانة اسلامية', 'انكليزي', 'كيمياء'];
const bacLiterarySubjects = ['ديانة اسلامية', 'انكليزي', 'عربي', 'تاريخ', 'جغرافيا', 'فلسفة'];
const types = ['دورات', 'اوراق عمل', 'اختبارات', 'ملخصات', 'مناهج'];
const years = Array.from({ length: 11 }, (_, i) => `${2015 + i}`);

// جميع الفلاتر الممكنة في مصفوفة واحدة بدون تكرار
const allFilters = Array.from(new Set([
  ...ninthSubjects,
  ...bacScientificSubjects,
  ...bacLiterarySubjects,
  ...types,
  ...years,
]));

// تحويل الأرقام العربية إلى إنجليزية
function convertArabicNumbersToEnglish(str: string): string {
  const arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return str.replace(/[٠-٩]/g, d => {
    return arabicNums.indexOf(d).toString();
  });
}

export async function fetchSearchResults(query: SearchQuery): Promise<SearchResponse> {
  const words = query.search_bar_query.split(/\s+/);
  const foundFilters = new Set<string>();

  for (const wordRaw of words) {
    const word = convertArabicNumbersToEnglish(wordRaw);

    for (const filter of allFilters) {
      const filterConverted = convertArabicNumbersToEnglish(filter);

      // قاعدة: لو الكلمة قصيرة جداً (اقل من 3 حروف) نتحقق تطابق تام فقط
      if (word.length < 3) {
        if (word === filterConverted) {
          foundFilters.add(filter);
        }
      } else {
        // لو الكلمة طويلة نسمح باحتواء سواء الكلمة في الفلتر أو الفلتر في الكلمة
        if (
          filterConverted.includes(word) ||
          word.includes(filterConverted)
        ) {
          foundFilters.add(filter);
        }
      }
    }
  }


  const processedQuery: SearchQuery = {
    search_bar_query: query.search_bar_query.trim(), // لا نزيل شيء من جملة البحث
    filters: [...new Set([...query.filters, ...foundFilters])],
    page: query.page,
  };
  console.log("Processed query:", processedQuery);

  // تأخير عشوائي
  const delay = Math.random() * 2000;
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
    console.log("Search result:", result.data);

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

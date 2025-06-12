type FileInfo = {
  file_name: string;
  file_description: string;
  categories: string[];
  file_url: string;
    file_id?: string;
};

type UploadResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

const ninthSubjects = ['عربي', 'علوم', 'رياضيات', 'انكليزي', 'ديانة اسلامية', 'فيزياء', 'كيمياء', 'جغرافيا', 'تاريخ','فرنسي','تركي'];
const bacScientificSubjects = ['رياضيات', 'فيزياء', 'علوم', 'عربي', 'ديانة اسلامية', 'انكليزي', 'كيمياء','فرنسي','تركي'];
const bacLiterarySubjects = ['ديانة اسلامية', 'انكليزي', 'عربي', 'تاريخ', 'جغرافيا', 'فلسفة','فرنسي','تركي'];
const types = ['دورات', 'اختبارات', 'ملخصات و نوط', 'مناهج'];
const years = Array.from({ length: 11 }, (_, i) => `${2015 + i}`);
const extraKeywords = ['بكلوريا علمي', 'بكلوريا ادبي','تاسع'];

function convertArabicNumbersToEnglish(text: string): string {
  const arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  const englishNums = ['0','1','2','3','4','5','6','7','8','9'];
  let result = text;
  for (let i = 0; i < arabicNums.length; i++) {
    const regex = new RegExp(arabicNums[i], 'g');
    result = result.replace(regex, englishNums[i]);
  }
  return result;
}

function extractCategoriesFromFileName(fileName: string): string[] {
  const categories: Set<string> = new Set();

  // نحول الأرقام العربية إلى إنجليزية عشان البحث يكون موحد
  const normalizedFileName = convertArabicNumbersToEnglish(fileName);

  const allKeywords = [
    ...ninthSubjects,
    ...bacScientificSubjects,
    ...bacLiterarySubjects,
    ...types,
    ...years,
    ...extraKeywords,
  ];

  for (const keyword of allKeywords) {
    if (normalizedFileName.includes(keyword)) {
      categories.add(keyword);
    }
  }

  return Array.from(categories);
}

export async function updateFileInfo(fileInfo: FileInfo): Promise<UploadResponse> {
  // نضيف التصنيفات المستخرجة من اسم الملف لمصفوفة التصنيفات مع إزالة التكرار
  const extractedCategories = extractCategoriesFromFileName(fileInfo.file_name);
  fileInfo.categories = Array.from(new Set([...fileInfo.categories, ...extractedCategories]));
  const filters = [...fileInfo.categories];
  fileInfo.file_description += '\n'
  for (const filter of filters) {
    if (!fileInfo.file_description.includes(filter)) {
      fileInfo.file_description += ` ${filter}`;
    }
  }
  console.log(fileInfo)

  const delay = Math.random() * 3000;
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    const response = await fetch('/api/files/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileInfo),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Something went wrong',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unexpected error occurred',
    };
  }
}

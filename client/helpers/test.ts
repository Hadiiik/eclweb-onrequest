import { uploadFileInfo } from "./upload_file";


const bacScientificSubjects = ['رياضيات', 'فيزياء', 'علوم', 'عربي', 'ديانة اسلامية', 'لغة', 'كيمياء'];
const bacLiterarySubjects = ['ديانة اسلامية', 'لغة', 'عربي', 'تاريخ', 'جغرافيا', 'فلسفة'];
const types = ['دورات', 'اوراق عمل', 'اختبارات', 'ملخصات', 'مناهج'];
const years = Array.from({ length: 11 }, (_, i) => `${2015 + i}`);

// دمج جميع المواد
const allSubjects = [...new Set([ ...bacScientificSubjects, ...bacLiterarySubjects])];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// تحديد الفلتر بناءً على المادة المختارة
function getFilterForSubject(subject: string): string[] {
  if (bacScientificSubjects.includes(subject)) {
    return ['بكلوريا علمي'];
  }
  if (bacLiterarySubjects.includes(subject)) {
    return ['بكلوريا ادبي'];
  }
  return [];
}

function generateFakeFile(index: number) {
  const subject = getRandomItem(allSubjects);
  const type = getRandomItem(types);
  const year = getRandomItem(years);
  const filters = getFilterForSubject(subject); // تحديد الفلاتر بناءً على المادة

  return {
    file_name: `${subject} ${type} ${year} - ملف ${index + 1}`,
    file_description: `هذا ملف تجريبي لمادة ${subject} من نوع ${type} لسنة ${year}`,
    categories: [`${subject}`, `${type}`, `${year}`, ...filters], // إضافة الفلاتر إلى الفئات
    file_url: `https://example.com/files/fake-file-${index + 1}.pdf`,
  };
}

export async function uploadFakeFiles() {
  for (let i = 0; i < 30; i++) {
    const fakeFile = generateFakeFile(i);
    const response = await uploadFileInfo(fakeFile);
    console.log(`File ${i + 1}:`, response.success ? 'Uploaded successfully' : `Failed - ${response.error}`);
  }
}

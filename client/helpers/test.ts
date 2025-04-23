import { uploadFileInfo } from "./upload_file";


const ninthSubjects = ['عربي', 'علوم', 'رياضيات', 'لغة', 'ديانة اسلامية', 'فيزياء', 'كيمياء', 'جغرافيا', 'تاريخ'];
const bacScientificSubjects = ['رياضيات', 'فيزياء', 'علوم', 'عربي', 'ديانة اسلامية', 'لغة', 'كيمياء'];
const bacLiterarySubjects = ['ديانة اسلامية', 'لغة', 'عربي', 'تاريخ', 'جغرافيا', 'فلسفة'];
const types = ['دورات', 'اوراق عمل', 'اختبارات', 'ملخصات', 'مناهج'];
const years = Array.from({ length: 11 }, (_, i) => `${2015 + i}`);

// دمج جميع المواد
const allSubjects = [...new Set([...ninthSubjects, ...bacScientificSubjects, ...bacLiterarySubjects])];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFakeFile(index: number) {
  const subject = getRandomItem(allSubjects);
  const type = getRandomItem(types);
  const year = getRandomItem(years);

  return {
    file_name: `${subject} ${type} ${year} - ملف ${index + 1}`,
    file_description: `هذا ملف تجريبي لمادة ${subject} من نوع ${type} لسنة ${year}`,
    categories: [`${subject}`, `${type}`, `${year}`],
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



import { similarChars } from "@/constants/similar_chars";

export function generateSimilarWords(search_query: string): Set<string> {
    const similarWords = new Set<string>();

    // تحويل الأرقام العربية إلى إنجليزية
    function convertArabicNumbersToEnglish(text: string): string {
        const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
        return text.replace(/[٠-٩]/g, (digit) =>
            String(arabicNumbers.indexOf(digit))
        );
    }

    // تحويل الأرقام الإنجليزية إلى عربية
    function convertEnglishNumbersToArabic(text: string): string {
        const englishToArabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return text.replace(/[0-9]/g, (digit) =>
            englishToArabic[parseInt(digit)]
        );
    }

    let words = search_query.split(' ');
    words = words.filter(ele => ele !== " " && ele !== "" && ele.length > 2);

    for (const word of words) {
        // إضافة الكلمة الأصلية
        similarWords.add(word);

        // تحويل الأرقام داخل الكلمة
        const arabicConverted = convertArabicNumbersToEnglish(word);
        const englishConverted = convertEnglishNumbersToArabic(word);

        similarWords.add(arabicConverted);
        similarWords.add(englishConverted);

        // معالجة "ة" أو "ه" في نهاية الكلمة
        const baseWord = word.endsWith("ة") || word.endsWith("ه") ? word.slice(0, -1) : word;

        // إضافة الكلمة مع "ال" التعريف إذا لم تكن موجودة
        if (!baseWord.startsWith("ال") && baseWord.length > 1) {
            similarWords.add("ال" + baseWord);
        }

        // إضافة الكلمة بدون "ال" التعريف إذا كانت موجودة
        if (baseWord.startsWith("ال") && baseWord.length > 1) {
            similarWords.add(baseWord.substring(2));
        }

        // إضافة الكلمة الأساسية بعد إزالة "ة" أو "ه"
        similarWords.add(baseWord);

        // إضافة الكلمات المشابهة بالحروف المشابهة
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (similarChars[char]) {
                for (const similarChar of similarChars[char]) {
                    const similarWord = word.substring(0, i) + similarChar + word.substring(i + 1);
                    similarWords.add(similarWord);
                }
            }
        }
    }

    return similarWords;
}

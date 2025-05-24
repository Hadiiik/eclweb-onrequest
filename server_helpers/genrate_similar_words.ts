import { similarChars } from "@/constants/similar_chars";

export function generateSimilarWords(search_query: string): Set<string> {
    const similarWords = new Set<string>();

    function convertArabicNumbersToEnglish(text: string): string {
        const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
        return text.replace(/[٠-٩]/g, (digit) =>
            String(arabicNumbers.indexOf(digit))
        );
    }

    function convertEnglishNumbersToArabic(text: string): string {
        const englishToArabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return text.replace(/[0-9]/g, (digit) =>
            englishToArabic[parseInt(digit)]
        );
    }

    let words = search_query.split(' ');
    words = words.filter(ele => ele !== " " && ele !== "" && ele.length > 2);

    for (const word of words) {
        // إضافة الكلمة الأصلية إذا كانت >= 4
        if (word.length >= 4) similarWords.add(word);

        // تحويل الأرقام داخل الكلمة
        const arabicConverted = convertArabicNumbersToEnglish(word);
        const englishConverted = convertEnglishNumbersToArabic(word);

        if (arabicConverted.length >= 4) similarWords.add(arabicConverted);
        if (englishConverted.length >= 4) similarWords.add(englishConverted);

        // معالجة "ة" أو "ه" أو "ء" في نهاية الكلمة
        const baseWord = word.endsWith("ة") || word.endsWith("ه") || word.endsWith("ء")  ? word.slice(0, -1) : word;

        // إضافة الكلمة مع "ال" التعريف إذا لم تكن موجودة
        if (!baseWord.startsWith("ال") && baseWord.length > 1) {
            const withAl = "ال" + baseWord;
            if (withAl.length >= 4) similarWords.add(withAl);
        }

        // إضافة الكلمة بدون "ال" التعريف إذا كانت موجودة
        if (baseWord.startsWith("ال") && baseWord.length > 1) {
            const withoutAl = baseWord.substring(2);
            if (withoutAl.length >= 4) similarWords.add(withoutAl);
        }

        // إضافة الكلمة الأساسية بعد إزالة "ة" أو "ه"
        if (baseWord.length >= 4) similarWords.add(baseWord);

        // إضافة الكلمات المشابهة بالحروف المشابهة
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (similarChars[char]) {
                for (const similarChar of similarChars[char]) {
                    const similarWord = word.substring(0, i) + similarChar + word.substring(i + 1);
                    if (similarWord.length >= 4) similarWords.add(similarWord);
                }
            }
        }
    }

    return similarWords;
}

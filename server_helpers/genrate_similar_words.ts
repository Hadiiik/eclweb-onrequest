import { similarChars } from "@/constants/similar_chars";

export function generateSimilarWords(search_query: string): Set<string> {
    const similarWords = new Set<string>();
    let words = search_query.split(' '); // تقسيم البحث إلى كلمات فردية
    words = words.filter(ele => ele !== " " && ele !== "");
    for (let i = 0; i < words.length; i++) similarWords.add(words[i]);
    for (const word of words) {

        // إضافة الكلمة مع "ال" التعريف إذا لم تكن موجودة
        const baseWord = word.endsWith("ة") || word.endsWith("ه") ? word.slice(0, -1) : word;

        // إضافة الكلمة مع "ال" التعريف إذا لم تكن موجودة
        if (!baseWord.startsWith("ال")) {
            if (baseWord.length > 1) 
            similarWords.add("ال" + baseWord);
        }

        // إضافة الكلمة بدون "ال" التعريف إذا كانت موجودة
        if (baseWord.startsWith("ال")) {
            if (baseWord.length > 1) 
            similarWords.add(baseWord.substring(2));
        }

        // إضافة الكلمة الأساسية بعد إزالة "ة" أو "ه" إذا كانت موجودة
        similarWords.add(baseWord);
        // إزالة "ة" أو "ه" من آخر الكلمة إذا كانت موجودة

        // إضافة الكلمات المشابهة
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (similarChars[char]) {
                for (const similarChar of similarChars[char]) {
                    const similarWord = word.substring(0, i) + similarChar + word.substring(i + 1);
                    similarWords.add(similarWord);

                    // إضافة الكلمات المشابهة مع "ال" التعريف إذا لم تكن موجودة
                    
                }
            }
        }
    }
    return similarWords;
}

import { similarChars } from "@/constants/similar_chars";

export function generateSimilarWords(search_query: string): Set<string> {
    const similarWords = new Set<string>();
    let words = search_query.split(' '); // تقسيم البحث إلى كلمات فردية
    words = words.filter(ele => ele !== " " && ele !== "");
    for (let i = 0; i < words.length; i++) similarWords.add(words[i]);
    for (const word of words) {

        // إضافة الكلمة مع "ال" التعريف إذا لم تكن موجودة
        if (!word.startsWith("ال")) {
            if (word.length > 1) 
            similarWords.add("ال" + word);
        }

        // إضافة الكلمة بدون "ال" التعريف إذا كانت موجودة
        if (word.startsWith("ال")) {
            if (word.length > 1) 
            similarWords.add(word.substring(2));
        }

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

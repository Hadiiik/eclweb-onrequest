import { similarChars } from "@/constants/similar_chars";

export function generateSimilarWords(search_query: string): Set<string> {
    const similarWords = new Set<string>();
    let words = search_query.split(' '); // تقسيم البحث إلى كلمات فردية
    words = words.filter(ele => ele !== " " && ele !== "");

    for (const word of words) {
        // إضافة الكلمة الأصلية
        similarWords.add(word);

        // إضافة الكلمة مع "ال" التعريف إذا لم تكن موجودة
        if (!word.startsWith("ال")) {
            similarWords.add("ال" + word);
        }

        // إضافة الكلمة بدون "ال" التعريف إذا كانت موجودة
        if (word.startsWith("ال")) {
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
                    if (!similarWord.startsWith("ال")) {
                        similarWords.add("ال" + similarWord);
                    }

                    // إضافة الكلمات المشابهة بدون "ال" التعريف إذا كانت موجودة
                    if (similarWord.startsWith("ال")) {
                        similarWords.add(similarWord.substring(2));
                    }
                }
            }
        }
    }

    return similarWords;
}

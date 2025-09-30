import { FileData } from "@/app/components/SearchResults";

function getSimilarityScore(text: string, query: string): number {
  const clean = (str: string) =>
    str.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim();

  const cleanText = clean(text);
  const cleanQuery = clean(query);

  if (!cleanQuery || !cleanText) return 0;

  // وزن للتطابق الكامل
  const fullMatch = cleanText.includes(cleanQuery) ? 1 : 0;

  // تطابق الكلمات
  const textWords = cleanText.split(" ");
  const queryWords = cleanQuery.split(" ");

  const matchCount = queryWords.filter((word) =>
    textWords.some((tWord) => tWord.includes(word))
  ).length;

  const partialMatchScore = matchCount / queryWords.length;

  // المجموع النهائي مع أوزان
  const score = fullMatch * 0.6 + partialMatchScore * 0.4;

  return score;
}


export function rankBySimilarity(results: FileData[], query: string): FileData[] {
  if (!query.trim()) return results;

  const scoredResults = results.map((item) => {
    const nameScore = getSimilarityScore(item.fileName, query);
    const descScore = getSimilarityScore(item.description || "", query);
    const filterScore = getSimilarityScore((item.filters || []).join(" "), query);

    // نعطي أوزان مختلفة لكل جزء (يمكنك تعديل القيم حسب الحاجة)
    const totalScore = nameScore * 0.5 + descScore * 0 + filterScore * 0;
    
    return { ...item, similarityScore: totalScore };
  });

  // الترتيب حسب score تنازليًا
  const sortedResults = scoredResults.sort(
    (a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0)
  );

  // إزالة الـ similarityScore المؤقتة قبل الإرجاع
  return sortedResults.map(({ similarityScore, ...rest }) => rest);
}


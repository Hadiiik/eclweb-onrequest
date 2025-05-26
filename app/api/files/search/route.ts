import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { sanitizeInput } from "@/security/remove_injictions";
import { generateSimilarWords } from "@/server_helpers/genrate_similar_words";
import { NextRequest, NextResponse } from "next/server";

type SearchQyery = {
    search_bar_query: string;
    filters: string[];
    page: string;
}

// استخراج الفلاتر بناءً على الكلمات في البحث


//to do move fiters extracting from query to client side

function extractEducationalFilters(query: string): string[] {
    const normalizedQuery = query
        .replace(/[أإآ]/g, "ا")
        .replace(/[ة ه]/g, "ا")
        .toLowerCase();

    const hasBacWord = /(ال)?(بكالوريا|باكالوريا|بكلوريا)/.test(normalizedQuery);
    const hasScientific = /(ال)?علمي/.test(normalizedQuery);
    const hasLiterary = /(ال)?(ادبي|أدبي)/.test(normalizedQuery);
    const hasTase3 = /(ال)?تاسع/.test(normalizedQuery);

    const extraFilters: string[] = [];

    if ((hasBacWord || hasScientific || hasLiterary) && hasTase3) {
        // يوجد تضارب بين بكالوريا (علمي/أدبي) والتاسع، لا نضع أي منهما
        return [];
    }

    if (hasBacWord || hasScientific || hasLiterary) {
        if (hasScientific) {
            extraFilters.push("بكلوريا علمي");
        }
        if (hasLiterary) {
            extraFilters.push('بكلوريا ادبي');
        }
        if (!hasScientific && !hasLiterary) {
            // فقط بكالوريا بدون تحديد علمي/أدبي
            extraFilters.push("بكلوريا علمي", "بكلوريا ادبي");
        }
    }

    if (hasTase3) {
        extraFilters.push("تاسع");
    }
    return extraFilters;
}

// التحقق إذا كانت الكلمات في البحث تحتوي فقط على الفلاتر
function isOnlyFilterWords(query: string): boolean {
    const normalized = query
        .replace(/[أإآ]/g, "ا")
        .replace(/[ةه]/g, "ا")
        .toLowerCase()
        .trim();

    const words = normalized.split(/\s+/).filter(Boolean);

    const allowedWords = new Set([
        "علمي",
        "ادبي", 
        "بكلوريا",
        "بكالوريا",
        "باكالوريا",
        "بكلوريا علمي",
        "بكالوريا علمي",
        "باكالوريا علمي",
        "بكلورياادبي",
        "بكالوريا ادبي",
        "باكالوريا ادبي",   
        "ادبي",
        "تاسع"
    ]);

    // نقوم بتحليل الكلمات إلى تسلسل من العبارات المسموحة
    let i = 0;
    while (i < words.length) {
        const single = words[i];
        const pair = i + 1 < words.length ? `${words[i]} ${words[i + 1]}` : null;

        if (pair && allowedWords.has(pair)) {
            i += 2;
        } else if (allowedWords.has(single)) {
            i += 1;
        } else {
            return false; // وجدنا كلمة أو عبارة غير مسموحة
        }
    }

    return true;
}


export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;

    const req_body: SearchQyery = await req.json();
    let search_bar_query = sanitizeInput(req_body.search_bar_query);

    search_bar_query = search_bar_query
        .split(/\s+/)
        .filter(word => word.length > 2)
        .join(' ');
    // استخراج الفلاتر الإضافية بناءً على البحث قبل التحقق من الفلاتر
    const autoFilters = extractEducationalFilters(search_bar_query);

    // إذا كان البحث يحتوي فقط على كلمات تخص الفلاتر، اجعل البحث النصي فارغ
    const isOnlyFilter = isOnlyFilterWords(search_bar_query);
    if (isOnlyFilter) {
        search_bar_query = "";
    }

    let filters = req_body.filters.map((filter) => sanitizeInput(filter));
    // دمج الفلاتر وإزالة التكرار
    filters = [...new Set([...filters, ...autoFilters])];
    if (filters.length > 10) {
        return NextResponse.json({ data: "Too many filters" }, { status: 200 });
    }
    // إذا كان البحث النصي فارغًا
    if (search_bar_query.trim() === "") {
        if (filters.length === 0) return NextResponse.json({ "data": [] }, { status: 200 });
        const query = supabase
            .from("files_info")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(500);

        if (filters.includes("بكلوريا علمي") && filters.includes("بكلوريا ادبي")) {
        query.or('categories.cs.{"بكلوريا علمي"},categories.cs.{"بكلوريا ادبي"}');
    } else if (filters.length > 0) {
        query.contains("categories", filters);
    }

        const { data, error } = await query;

        if (error) {
            // console.error("Error fetching data:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ data }, { status: 200 });
    }

    // توليد كلمات مشابهة للبحث النصي فقط إذا كانت الجملة غير فارغة
    let f = "";
    if (search_bar_query.trim() !== "") {
        const similarWords = generateSimilarWords(search_bar_query);
        f = Array.from([...similarWords,search_bar_query.split(/\s+/)])
            .flatMap(word => [
                `file_name.ilike.%${word}%`,
                `file_description.ilike.%${word}%`
            ])
            .join(',');
            console.log("f", f);
            console.log("simliar" , similarWords);
    }

    // الاستعلام مع البحث في النص والفلاتر
    const query = supabase
        .from("files_info")
        .select("*")
        .order("created_at", { ascending: false });

    if (f) {
        query.or(f);  // إذا كانت f تحتوي على شروط، نضيفها للاستعلام
    }
    // إذا كان يوجد "بكلوريا علمي" و"بكلوريا ادبي" معًا في الفلاتر، أحضر الملفات التي تحتوي على كليهما
    if (filters.includes("بكلوريا علمي") && filters.includes("بكلوريا ادبي")) {
        query.or('categories.cs.{"بكلوريا علمي"},categories.cs.{"بكلوريا ادبي"}');
    } else if (filters.length > 0) {
        query.contains("categories", filters);
    }

    const { data, error } = await query;

    if (error) {
        // console.error("Error fetching data:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}

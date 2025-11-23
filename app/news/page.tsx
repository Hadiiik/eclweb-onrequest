import React from 'react'
import NewsPage, { NewsItem } from '../components/NewsPanel'
import { supabase } from '@/lib/supabase';


const getLastHundredNews = async () =>{
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("id", { ascending: false })
    .limit(100);

  return { data, error };
}

export const revalidate = 600; // كل 10 دقائق (يمكنك تغيير الرقم حسب حاجتك)

const page = async () => {
  const { data, error } = await getLastHundredNews();
  let newsItems: NewsItem[] = [];

  if (error) {
    console.error(error);
  } else if (data && Array.isArray(data) && data.length > 0) {
    newsItems = data.map((item: NewsItem) => ({
      id: item.id,
      excerpt: item.excerpt,
      link: item.link || "",
    }));
  } else {
    // No news found
    newsItems = [];
  }
  return (
    <div>
      <NewsPage news={newsItems} />
    </div>
  )
}

export default page

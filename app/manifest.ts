import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
  name: "ECL-WEB",
  short_name: "ecl",
  description: "educational creative link",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#128d3f",
  icons: [
    {
      src: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ],
  lang: "ar",
  categories: [
    "books",
    "education"
  ],
  shortcuts: [
    {
      name: "الأخبار",
      url: "/news",
      description: "لأن التعليم يستحق المتابعة؛ نرصد الحدث.. نصنع الوعي!"
    }
  ]
}
}
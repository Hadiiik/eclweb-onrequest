import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ECL-WEB',
    short_name: 'ecl',
    description: "educational creative link",
    start_url: '/',
    display: 'standalone',
    background_color: '#f0fdf4',
    theme_color: '#166534',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    "lang": "ar",
  }
}
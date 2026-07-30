import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sispl.shop';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/job-seeker/',
        '/employer/',
        '/freelancer/',
        '/trainer/',
        '/admin/',
        '/sign-in',
        '/sign-up',
        '/forgot-password',
        '/reset-password',
        '/auth/',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

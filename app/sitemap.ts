import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sispl.shop';
  const lastModified = new Date();

  // ONLY public, indexable routes are included in the sitemap.
  // Private portal routes (/job-seeker/*, /employer/*, /freelancer/*, /trainer/*, /admin/*)
  // and non-indexable auth routes (/sign-in, /sign-up, /forgot-password, /reset-password) are excluded.
  return [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/find-jobs`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/freelancers`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/find-talent`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];
}

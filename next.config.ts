import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/candidate/:path*',
        destination: '/job-seeker/:path*',
        permanent: true,
      },
      {
        source: '/search',
        has: [{ type: 'query', key: 'type', value: 'jobs' }],
        destination: '/find-jobs',
        permanent: true,
      },
      {
        source: '/search',
        has: [{ type: 'query', key: 'type', value: 'courses' }],
        destination: '/find-courses',
        permanent: true,
      },
      {
        source: '/search',
        has: [{ type: 'query', key: 'type', value: 'freelancers' }],
        destination: '/find-freelancers',
        permanent: true,
      },
      {
        source: '/search',
        destination: '/find-talent',
        permanent: true,
      },
      {
        source: '/talent',
        destination: '/find-talent',
        permanent: true,
      },
      {
        source: '/jobs',
        destination: '/find-jobs',
        permanent: true,
      },
      {
        source: '/courses',
        destination: '/find-courses',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3001/api/v1/:path*', // Proxy to Backend
      }
    ];
  },
};

export default nextConfig;

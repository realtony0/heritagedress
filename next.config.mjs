/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/*': [
        './asmaw/**/*',
        './adja/**/*',
        './zeynah/**/*',
        './diama/**/*',
        './safa/**/*',
      ],
    },
  },
};

export default nextConfig;

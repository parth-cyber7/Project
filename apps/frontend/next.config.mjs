/** @type {import('next').NextConfig} */
const backendExternalUrl = process.env.BACKEND_EXTERNAL_URL;
const hasApiProxy = Boolean(backendExternalUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ]
  },
  async rewrites() {
    if (!hasApiProxy) {
      return [];
    }

    const normalizedBackendUrl = backendExternalUrl.replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${normalizedBackendUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;

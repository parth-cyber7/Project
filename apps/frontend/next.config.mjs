/** @type {import('next').NextConfig} */
const backendHost = process.env.BACKEND_HOST;
const backendPort = process.env.BACKEND_PORT;
const hasInternalApiProxy = Boolean(backendHost && backendPort);

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ]
  },
  async rewrites() {
    if (!hasInternalApiProxy) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `http://${backendHost}:${backendPort}/api/:path*`
      }
    ];
  }
};

export default nextConfig;

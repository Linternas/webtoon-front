/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image-comic.pstatic.net'],
  },

  webpack: (config, { webpack }) => {
    // const prod = process.env.NODE_ENV === 'production';
    const prod = false;
    const newConfig = {
      ...config,
      mode: prod ? 'production' : 'development',
    };
    if (prod) {
      newConfig.devtool = 'hidden-source-map';
    }
    return newConfig;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://192.168.0.10:3001/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

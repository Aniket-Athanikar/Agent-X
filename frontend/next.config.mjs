/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/reset-passwod',
        destination: '/reset-password',
        permanent: true,
      },
      {
        source: '/forgat-pswword',
        destination: '/forgot-password',
        permanent: true,
      },
      {
        source: '/forgat%20pswword',
        destination: '/forgot-password',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;

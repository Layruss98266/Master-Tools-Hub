/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The hub data files in /public/data are large generated globals; don't lint/typecheck them.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

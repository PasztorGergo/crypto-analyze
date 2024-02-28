/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_SK: process.env.OPENAI_SK,
  },
};

export default nextConfig;

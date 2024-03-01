/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_SK: process.env.OPENAI_SK,
    BINANCE_SK: process.env.BINANCE_SK,
    BINANCE_PL: process.env.BINANCE_PL,
    BINANCE_BASE_URL: process.env.BINANCE_BASE_URL,
  },
};

export default nextConfig;

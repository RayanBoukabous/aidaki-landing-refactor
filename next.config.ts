import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone',
    images: {
        domains: ['ec2-13-221-134-109.compute-1.amazonaws.com'],
    },
    publicRuntimeConfig: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_CHATBOT_URL: process.env.NEXT_PUBLIC_CHATBOT_URL,
        NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_MINIO_URL,
    },
    serverRuntimeConfig: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_CHATBOT_URL: process.env.NEXT_PUBLIC_CHATBOT_URL,
        NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_MINIO_URL,
    },
    async redirects() {
        return [
            {
                source: '/Signup',
                destination: '/register',
                permanent: true,
            },
            {
                source: '/',
                destination: '/ar',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || 'http://ec2-54-226-40-236.compute-1.amazonaws.com/api';
        const chatbotUrl =
            process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://ec2-54-226-40-236.compute-1.amazonaws.com/chatbot';

        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/:path*`,
            },
            {
                source: '/chatbot/:path*',
                destination: `${chatbotUrl}/:path*`,
            },
        ];
    },
};

export default withNextIntl(nextConfig);

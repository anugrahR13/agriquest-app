import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true, // Important for Vercel deployment
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002', '.vercel.app'],
    },
  },
  // Handle serverless deployment issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side only configurations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Handle large dependencies - exclude them from client bundle
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        // Exclude large AI dependencies from client bundle
        '@tensorflow/tfjs',
        '@tensorflow-models/coco-ssd',
        '@tensorflow-models/mobilenet',
        '@google-cloud/vision'
      ];
    }
    
    return config;
  },
  // Optimize for serverless
  poweredByHeader: false,
  compress: true,
  
  // Handle environment variables properly
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
};

export default nextConfig;
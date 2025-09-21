import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Simplified config for Vercel deployment */
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true, // Important for Vercel deployment
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-app-name.vercel.app'],
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
    
    // Reduce bundle size for serverless
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Bundle all dependencies in the main chunk
          vendor: {
            name: 'vendors',
            chunks: 'all',
            test: /node_modules/,
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
  // Optimize for serverless
  poweredByHeader: false,
  compress: true,
  // Reduce serverless function size
  outputFileTracing: true,
};

export default nextConfig;
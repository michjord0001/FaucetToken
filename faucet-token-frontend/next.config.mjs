/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        config.devtool = 'source-map'; // Enable source maps in development
      }
      return config;
    },
  };
  
  export default nextConfig;  
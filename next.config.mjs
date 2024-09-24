/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pwsironzaezqdvhbqdlq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    loader: "custom",
    loaderFile: "./src/libs/imageLoader.js",
  },
};

export default nextConfig;

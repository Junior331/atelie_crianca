/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Desabilita otimização de imagens da Vercel para evitar erro 402
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dpsyjqreqbaksnvacerz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "fulbaxplriohotozocfr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;

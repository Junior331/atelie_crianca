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
      {
        protocol: "https",
        hostname: "pub-d50114600aa44bf0a236f33f64195f03.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: "/u/:path*",
        destination: "https://u.jln.dev/:path*",
      },
    ];
  },
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/docs/getting-started",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);

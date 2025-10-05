import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
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

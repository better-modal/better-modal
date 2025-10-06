import Script from "next/script";

export const Analytics = () => {
  if (process.env.NODE_ENV === "development") return null;

  return (
    <Script
      async
      data-website-id="487a59b3-f983-4dbd-8e21-d14d2d44cccf"
      src="/u/script.js"
    />
  );
};

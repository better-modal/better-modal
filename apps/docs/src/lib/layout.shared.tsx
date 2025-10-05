import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsxs
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "better-modal",
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}

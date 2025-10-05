import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { Icons } from "@/lib/icons";

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
      title: <Logo />,
    },
    links: [
      {
        text: "Discord",
        icon: <Icons.Discord />,
        url: "https://discord.gg/dfvQGkpP",
      },
      {
        text: "GitHub",
        icon: <Icons.GitHub />,
        url: github,
      },
      {
        text: "NPM",
        icon: <Icons.NPM />,
        url: "https://www.npmjs.com/package/better-modal",
      },
    ],
    // see https://fumadocs.dev/docs/ui/navigation/links
    githubUrl: github,
  };
}

const github = "https://github.com/better-modal/better-modal";

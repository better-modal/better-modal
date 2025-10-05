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
        text: (
          <div className="flex items-center gap-2">
            <Icons.Discord />
            <p>Discord</p>
          </div>
        ),
        url: "https://discord.gg/dfvQGkpP",
      },
    ],
    // see https://fumadocs.dev/docs/ui/navigation/links
    githubUrl: github,
  };
}

const github = "https://github.com/better-modal/better-modal";

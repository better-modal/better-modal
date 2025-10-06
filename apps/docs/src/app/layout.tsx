import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { BetterModalProvider } from "@/modals/react";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <BetterModalProvider>
          <RootProvider>
            {children}
            <Analytics />
          </RootProvider>
        </BetterModalProvider>
      </body>
    </html>
  );
}

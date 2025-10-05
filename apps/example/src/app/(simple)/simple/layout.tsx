import { BetterModalProvider } from "@/app/(simple)/_modals/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BetterModalProvider>{children}</BetterModalProvider>;
}

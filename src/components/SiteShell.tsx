import type { ReactNode } from "react";
import { useLenis } from "../hooks/useLenis";
import { useScrollOrchestrator } from "../hooks/useScrollOrchestrator";
import { CustomCursor } from "./CustomCursor";
import { Navbar } from "./Navbar";
import { PageLoader } from "./PageLoader";
import { ChatWidget } from "./ChatWidget";
import { ScrollProgress } from "./ScrollProgress";
import { BackToTop } from "./BackToTop";
import { ParticleField } from "./ParticleField";

import { TransitionProvider } from "./TransitionOverlay";

export function SiteShell({ children }: { children: ReactNode }) {
  useLenis();
  useScrollOrchestrator();
  return (
    <TransitionProvider>
      <PageLoader />
      <ParticleField />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main className="relative z-[1] min-h-screen">{children}</main>
      <BackToTop />
      
      <ChatWidget />
    </TransitionProvider>
  );
}

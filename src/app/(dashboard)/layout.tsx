"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AmbientEffects } from "@/components/aegis/AmbientEffects";
import { OrbProvider } from "@/contexts/OrbContext";
import { MemoryProvider } from "@/contexts/MemoryContext";
import { EcosystemProvider } from "@/contexts/EcosystemContext";
import { FounderProvider } from "@/contexts/FounderContext";
import { IdentityProvider } from "@/contexts/IdentityContext";
import { GovernanceProvider } from "@/contexts/GovernanceContext";
import { ContinuityProvider } from "@/contexts/ContinuityContext";
import { IronFrameProvider } from "@/contexts/IronFrameContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrbProvider>
      <MemoryProvider>
        <EcosystemProvider>
          <FounderProvider>
            <IdentityProvider>
              <GovernanceProvider>
                <ContinuityProvider>
                  <IronFrameProvider>
            <div className="flex min-h-screen relative">
              <AmbientEffects />
              <Sidebar />
              <div className="flex flex-1 flex-col pl-60 relative z-10">
                <Header />
                <main className="flex-1 p-6 aegis-page-enter">{children}</main>
              </div>
            </div>
                  </IronFrameProvider>
                </ContinuityProvider>
              </GovernanceProvider>
            </IdentityProvider>
          </FounderProvider>
        </EcosystemProvider>
      </MemoryProvider>
    </OrbProvider>
  );
}

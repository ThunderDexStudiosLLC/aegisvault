"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AmbientEffects } from "@/components/aegis/AmbientEffects";
import { OrbProvider } from "@/contexts/OrbContext";
import { MemoryProvider } from "@/contexts/MemoryContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrbProvider>
      <MemoryProvider>
        <div className="flex min-h-screen relative">
          <AmbientEffects />
          <Sidebar />
          <div className="flex flex-1 flex-col pl-60 relative z-10">
            <Header />
            <main className="flex-1 p-6 aegis-page-enter">{children}</main>
          </div>
        </div>
      </MemoryProvider>
    </OrbProvider>
  );
}

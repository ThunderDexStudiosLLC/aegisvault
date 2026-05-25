"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { IdentityEngine } from "@/lib/identity-engine";
import {
  identityProfiles, accessRoles, storedCredentials,
  accessEvents, emergencyContacts, securityPosture,
} from "@/data/identity-data";

const IdentityContext = createContext<IdentityEngine | null>(null);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => new IdentityEngine(
      identityProfiles, accessRoles, storedCredentials,
      accessEvents, emergencyContacts, securityPosture,
    ),
    []
  );

  return (
    <IdentityContext.Provider value={engine}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}

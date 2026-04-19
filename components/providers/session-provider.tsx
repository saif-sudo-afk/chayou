"use client";

import { SessionProvider } from "next-auth/react";

type SessionAppProviderProps = {
  children: React.ReactNode;
};

export function SessionAppProvider({
  children,
}: SessionAppProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

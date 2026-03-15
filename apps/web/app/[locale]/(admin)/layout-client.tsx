"use client";

import { useEffect } from "react";
import { useAuthStore, type AuthUser } from "@/stores/auth";
import { TRPCProvider } from "@/lib/trpc/provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { TRPCUser } from "@/lib/trpc/routers/_app";

interface Props {
  children: React.ReactNode;
  user: TRPCUser;
}

export function AdminLayoutClient({ children, user }: Props) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.email.split("@")[0] ?? user.email,
      role: user.role,
      accessLevel: user.accessLevel,
      avatarUrl: null,
    };
    setUser(authUser);
  }, [user, setUser]);

  return (
    <TRPCProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </TRPCProvider>
  );
}

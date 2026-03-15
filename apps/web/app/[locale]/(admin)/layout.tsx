import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { serverTRPC } from "@/lib/trpc/server";
import { AdminLayoutClient } from "./layout-client";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const caller = await serverTRPC();
  const user = await caller.auth.me();

  if (!user || user.role !== "admin") {
    redirect(`/${locale}/dashboard`);
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}

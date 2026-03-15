import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { serverTRPC } from "@/lib/trpc/server";
import { StudentLayoutClient } from "./layout-client";

export default async function StudentLayout({
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

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return <StudentLayoutClient user={user}>{children}</StudentLayoutClient>;
}

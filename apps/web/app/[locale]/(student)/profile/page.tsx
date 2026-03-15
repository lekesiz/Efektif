"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { useAuthStore } from "@/stores/auth";
import { LOCALES } from "@efektif/shared";
import { Save, Trash2, User } from "lucide-react";

const SCHOOL_LEVELS = [
  "college_3eme", "seconde", "premiere", "terminale",
  "bac", "bac+1", "bac+2", "bac+3", "bac+4", "bac+5", "bac+6_plus",
  "cap_bep", "reconversion", "other",
] as const;

const profileSchema = z.object({
  name: z.string().min(1).max(100),
  birthDate: z.string().optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  schoolLevel: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  locale: z.enum(LOCALES),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const t = useTranslations("profile");
  const user = useAuthStore((s) => s.user);
  const [showDelete, setShowDelete] = useState(false);

  const { data: profile } = trpc.profile.get.useQuery();
  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => toast.success(t("saved")),
    onError: () => toast.error(t("error")),
  });

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name ?? user?.name ?? "",
      birthDate: profile?.birthDate ? new Date(profile.birthDate).toISOString().split("T")[0] : "",
      city: profile?.city ?? "",
      country: profile?.country ?? "",
      schoolLevel: profile?.schoolLevel ?? "",
      phone: "",
      locale: profile?.locale ?? "fr",
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateMutation.mutate({
      name: data.name,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
      city: data.city || undefined,
      country: data.country || undefined,
      schoolLevel: data.schoolLevel || undefined,
      locale: data.locale,
    });
  };

  const inputCls = "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      {/* Avatar section */}
      <div className="flex items-center gap-4 rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
          <User size={32} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{profile?.name ?? user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>{t("name")}</label>
            <input {...register("name")} className={inputCls} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls}>{t("email")}</label>
            <input value={user?.email ?? ""} readOnly className={`${inputCls} cursor-not-allowed bg-gray-50 dark:bg-gray-600`} />
          </div>
          <div>
            <label className={labelCls}>{t("birthDate")}</label>
            <input type="date" {...register("birthDate")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("phone")}</label>
            <input type="tel" {...register("phone")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("city")}</label>
            <input {...register("city")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("country")}</label>
            <input {...register("country")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("schoolLevel")}</label>
            <select {...register("schoolLevel")} className={inputCls}>
              <option value="">{t("selectLevel")}</option>
              {SCHOOL_LEVELS.map((level) => (
                <option key={level} value={level}>{t(`levels.${level}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>{t("language")}</label>
            <select {...register("locale")} className={inputCls}>
              <option value="fr">Francais</option>
              <option value="tr">Turkce</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={!isDirty || updateMutation.isPending} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50">
            <Save size={16} />
            {updateMutation.isPending ? t("saving") : t("save")}
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/10">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">{t("dangerZone")}</h3>
        <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">{t("deleteWarning")}</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-700 dark:text-red-400">
            <Trash2 size={16} />
            {t("deleteAccount")}
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => setShowDelete(false)} className="rounded-lg border px-4 py-2 text-sm">{t("cancel")}</button>
            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">{t("confirmDelete")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

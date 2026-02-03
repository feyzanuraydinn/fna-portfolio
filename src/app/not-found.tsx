"use client";
import { useTranslations } from "next-intl";
import { StatusPage, StatusSecondaryLink } from "@/components/seo/StatusPage";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <StatusPage
      code={t("code")}
      title={t("title")}
      description={t("description")}
      actions={<StatusSecondaryLink href="/">{t("homeButton")}</StatusSecondaryLink>}
    />
  );
}

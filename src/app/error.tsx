"use client";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  StatusPage,
  StatusPrimaryButton,
  StatusSecondaryLink,
} from "@/components/seo/StatusPage";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code={t("code")}
      title={t("title")}
      description={t("description")}
      actions={
        <>
          <StatusPrimaryButton onClick={reset}>
            {t("retryButton")}
          </StatusPrimaryButton>
          <StatusSecondaryLink href="/">{t("homeButton")}</StatusSecondaryLink>
        </>
      }
    />
  );
}

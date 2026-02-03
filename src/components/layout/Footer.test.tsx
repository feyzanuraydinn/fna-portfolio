import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import tr from "../../../locales/tr.json";
import { Footer } from "./Footer";
import { profile } from "@/data/profile";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="tr" messages={tr}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("<Footer />", () => {
  it("profile.ts'ten ismi render eder", () => {
    renderWithIntl(<Footer />);
    expect(screen.getByText(profile.name)).toBeInTheDocument();
  });

  it("içinde bulunulan yılı dinamik gösterir", () => {
    renderWithIntl(<Footer />);
    const year = new Date().getFullYear().toString();
    // © + space + year + space + name + . + rightsReserved
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("i18n çevirisinden 'rightsReserved' metnini gösterir", () => {
    renderWithIntl(<Footer />);
    expect(
      screen.getByText(/Tüm hakları saklıdır\./)
    ).toBeInTheDocument();
  });
});

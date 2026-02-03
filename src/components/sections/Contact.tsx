"use client";
import { clsx } from "clsx";
import { Section } from "@/components/ui/Section";
import { Title } from "@/components/ui/Title";
import { Strong } from "@/components/ui/Strong";
import { Ripple } from "@/components/ui/Ripple";
import { useTranslations } from "next-intl";
import { profile } from "@/data/profile";

function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="block mb-2 text-sm font-semibold dark:text-light/75 text-dark/75 transition-theme" {...props} />;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full p-3 rounded-md",
        "font-medium text-sm dark:text-light text-dark",
        "dark:placeholder:text-light/25 placeholder:text-dark/25",
        "dark:bg-light/5 bg-dark/5",
        "outline-none transition-colors duration-333",
        "focus:bg-primary/25 focus-visible:bg-primary/25"
      )}
      {...props}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full p-3 rounded-md resize-none",
        "font-medium text-sm dark:text-light text-dark",
        "dark:placeholder:text-light/25 placeholder:text-dark/25",
        "dark:bg-light/5 bg-dark/5",
        "outline-none transition-colors duration-333",
        "focus:bg-primary/25 focus-visible:bg-primary/25"
      )}
      {...props}
    />
  );
}

function Submit(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className={clsx(
        "cursor-pointer outline-offset-2 outline-primary",
        "w-full px-6 py-3 rounded-lg",
        "font-semibold text-light text-sm",
        "bg-primary shadow-custom",
        "transition-all duration-333",
        "active:scale-[0.98] active:bg-secondary",
        "hover:scale-[0.99] focus-visible:scale-[0.99]",
        "animate-shine motion-safe:animate-shine motion-reduce:animate-none"
      )}
      {...props}
    >
      <Ripple />
      {props.children}
    </button>
  );
}

export function Contact(props: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("contact");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const message = fd.get("message") as string;
    window.open(`mailto:${profile.social.email}?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${name} (${email})`);
  };

  return (
    <Section id="contact" aria-labelledby="contact-title" {...props}>
      <header>
        <Title id="contact-title">{t("title")} <Strong>{t("strong")}</Strong></Title>
      </header>
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-6 inlg:gap-3">
          <legend className="sr-only">{t("form.legend")}</legend>
          <div>
            <Label htmlFor="name">{t("form.name.label")}</Label>
            <Input id="name" name="name" placeholder={t("form.name.placeholder")} required />
          </div>
          <div>
            <Label htmlFor="email">{t("form.email.label")}</Label>
            <Input id="email" name="email" type="email" placeholder={t("form.email.placeholder")} required />
          </div>
          <div>
            <Label htmlFor="message">{t("form.message.label")}</Label>
            <Textarea id="message" name="message" rows={4} placeholder={t("form.message.placeholder")} required />
          </div>
          <Submit>{t("form.button.text")}</Submit>
        </fieldset>
      </form>
    </Section>
  );
}

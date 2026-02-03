type TitleTag = "h1" | "h2" | "h3";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML semantic seviyesi — varsayılan h2. Sayfanın ana başlığı için "h1" geç. */
  as?: TitleTag;
}

export function Title({ as: Tag = "h2", ...rest }: TitleProps) {
  return (
    <Tag
      className="font-extrabold tracking-widest text-7xl dark:text-light text-dark inlg:text-center inxl:text-6xl insm:text-3xl"
      {...rest}
    />
  );
}

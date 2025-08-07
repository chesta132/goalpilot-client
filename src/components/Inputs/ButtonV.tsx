import clsx from "clsx";
import { type ReactNode } from "react";
import { type LinkProps, Link } from "react-router";

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  className?: string;
  iconPosition?: "left" | "right";
  link?: LinkProps;
} & React.ComponentProps<"button">;

const ButtonV = ({ text, icon, className, iconPosition = "left", link, ...rest }: ButtonProps) => {
  const button = (
    <button
      {...rest}
      className={clsx(
        "flex gap-2 justify-center cursor-pointer shadow-2xl py-4 rounded-lg items-center bg-accent px-15 text-white disabled:opacity-70 disabled:cursor-progress transition-all hover:bg-accent-strong",
        className
      )}
    >
      {iconPosition === "left" && icon && icon}
      {text}
      {iconPosition === "right" && icon && icon}
    </button>
  );
  return <>{link ? <Link {...link}>{button}</Link> : button}</>;
};

export default ButtonV;

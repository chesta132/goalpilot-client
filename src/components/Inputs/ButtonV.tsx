import clsx from "clsx";
import { type ReactNode } from "react";

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  className?: string;
  iconPosition?: "left" | "right";
} & React.ComponentProps<"button">;

const ButtonV = ({ text, icon, className, iconPosition = "left", ...rest }: ButtonProps) => {
  return (
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
};

export default ButtonV;

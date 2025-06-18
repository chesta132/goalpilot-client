import clsx from "clsx";
import { type CSSProperties, type ReactNode } from "react";

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
};

const ButtonV = ({ text, icon, onClick, className, disabled = false, type, style }: ButtonProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "flex gap-2 justify-center cursor-pointer shadow-2xl py-4 rounded-lg items-center bg-accent px-15 text-white disabled:opacity-70 disabled:cursor-progress transition-all hover:bg-accent-strong",
        className
      )}
      disabled={disabled}
      type={type || "submit"}
      style={style}
    >
      {icon && icon}
      {text}
    </button>
  );
};

export default ButtonV;

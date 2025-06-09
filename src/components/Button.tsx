import clsx from "clsx";
import { type ReactNode } from "react";

type ButtonProps = {
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const Button = ({ text, icon, onClick, className, disabled = false }: ButtonProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "flex gap-2 justify-center cursor-pointer shadow-2xl py-4 rounded-lg items-center bg-(--accent) px-15 text-(--theme) disabled:opacity-70 disabled:cursor-progress transition-all",
        className
      )}
      disabled={disabled}
      onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "var(--accent-hard)")}
      onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "var(--accent)")}
    >
      {icon && icon}
      {text}
    </button>
  );
};

export default Button;

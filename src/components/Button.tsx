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
      className={`flex gap-2 justify-center cursor-pointer shadow-2xl py-4 rounded-lg items-center bg-(--accent) px-15 text-(--theme) disabled:opacity-70 disabled:cursor-progress ${className}`}
      disabled={disabled}
    >
      {icon && icon}
      {text}
    </button>
  );
};

export default Button;

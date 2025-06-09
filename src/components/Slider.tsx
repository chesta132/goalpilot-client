import clsx from "clsx";
import { useState } from "react";

type SliderProps = {
  bgColor?: string;
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  size?: number;
  bgSize?: number;
  value: boolean;
};

const Slider = ({ bgColor, color, onClick, label = "", className, size, bgSize, value }: SliderProps) => {
  const [isActive, setisActive] = useState(value);
  const handleClick = () => {
    if (onClick) onClick();
    setisActive(!isActive);
  };
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div
        className={`py-0.5 px-0.5 ${bgSize ? bgSize : "w-9"} rounded-2xl flex cursor-pointer ${
          !isActive ? `justify-start ${bgColor || "bg-(--theme-reverse)"}` : "justify-end bg-(--accent)"
        }`}
        style={{ width: bgSize || 36 }}
        onClick={handleClick}
      >
        <div className={`rounded-full ${color || "bg-(--theme)"} inset-shadow-sm`} style={{ width: size || 16, height: size || 16 }}></div>
      </div>
      <p className="cursor-pointer text-(--gray)" style={{ fontSize: size && size + 2 }} onClick={handleClick}>
        {label}
      </p>
    </div>
  );
};

export default Slider;

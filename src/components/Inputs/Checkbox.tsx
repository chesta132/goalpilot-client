import clsx from "clsx";
import { Check } from "lucide-react";
import { type ChangeEvent } from "react";

type CheckboxProps = {
  id?: string;
  className?: string;
  label: string;
  size?: number;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = ({ id, className, label, size, checked, onChange }: CheckboxProps) => {
  return (
    <label htmlFor={id} className={clsx("flex gap-2 text-theme-reverse-darker items-center cursor-pointer", className)}>
      <input
        onChange={onChange}
        checked={checked}
        type="checkbox"
        id={id}
        style={{ height: size || 4, width: size || 4 }}
        className="appearance-none peer relative rounded-[2px] border border-theme-reverse checked:bg-accent checked:border-transparent transition-all outline-0"
      />
      <Check className="absolute opacity-0 text-theme peer-checked:opacity-100 transition-all" size={size || 16} />
      <label htmlFor={id} style={{ fontSize: size }} className="cursor-pointer">
        {label}
      </label>
    </label>
  );
};

export default Checkbox;

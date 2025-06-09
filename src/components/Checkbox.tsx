import clsx from "clsx";
import { Check } from "lucide-react";

type CheckboxProps = {
  id: string;
  className?: string;
  label: string;
  size?: number;
};

const Checkbox = ({ id, className, label, size }: CheckboxProps) => {
  return (
    <label htmlFor={id} className={clsx("flex gap-2 text-(--gray) items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        id={id}
        style={{ height: size || 4, width: size || 4 }}
        className="appearance-none peer relative rounded-[2px] border border-(--theme-reverse) checked:bg-(--accent) checked:border-transparent transition-all outline-0"
      />
      <Check className="absolute opacity-0 peer-checked:opacity-100 transition-all" size={size || 16} color="var(--theme)" />
      <label htmlFor={id} style={{ fontSize: size }} className="cursor-pointer">
        {label}
      </label>
    </label>
  );
};

export default Checkbox;

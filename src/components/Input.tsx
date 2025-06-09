import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toCapitalize from "../../utils/toCapitalize";
import clsx from "clsx";

type InputProps = {
  type?: string;
  placeholder?: string;
  error?: string | null;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  password?: boolean;
  optional?: boolean;
  labelClass?: string;
};

const Input = ({ type = "text", placeholder, error, label, value = "", onChange, className, password, optional, labelClass }: InputProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocus, setIsFocus] = useState(false);
  const [whatType, setWhatType] = useState(type);

  return (
    <div className={clsx("relative", error && "mb-3", className)}>
      <input
        className={`
          w-full px-3 py-3 border-2 border-(--theme-darker) rounded-lg 
          transition-all duration-200 ease-in-out
          focus:outline-none focus:border-(--accent) ${password && "pr-8"}
        `}
        type={whatType}
        id={label}
        value={internalValue}
        onChange={onChange}
        onInput={(e) => setInternalValue((e.target as HTMLInputElement).value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => (internalValue !== "" ? setIsFocus(true) : setIsFocus(false))}
      />
      <label
        className={clsx(
          "absolute transition-all duration-200 ease-in-out pointer-events-none select-none whitespace-nowrap",
          isFocus ? '-top-2.5 left-3 text-xs text-(--accent) font-medium bg-(--theme) px-1' : labelClass || "top-3.5 left-3 text-sm text-(--gray)",
        )}
        htmlFor={label}
      >
        {isFocus ? toCapitalize(label || "") : placeholder} {isFocus && optional && <span className="text-(--gray)">(Optional)</span>}
      </label>
      {password && (
        <div className="cursor-pointer absolute top-0 right-0 h-full flex items-center pr-2">
          {whatType === "password" ? (
            <EyeOff size={20} color="var(--gray)" onClick={() => setWhatType("text")} />
          ) : (
            <Eye size={20} color="var(--gray)" onClick={() => setWhatType("password")} />
          )}
        </div>
      )}
      {error && <p className="absolute text-red-500 text-[12px] text-start">{error}</p>}
    </div>
  );
};

export default Input;

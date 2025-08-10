import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { capitalEachWords } from "../../utils/stringManip";
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
  focus?: boolean;
  classWhenError?: string;
  labelFocus?: string;
  close?: () => void;
  TWBackgroundLabel?: string;
};

const Input = ({
  type = "text",
  placeholder,
  error,
  label,
  value = "",
  onChange,
  className,
  password,
  optional,
  labelClass,
  focus,
  classWhenError,
  labelFocus,
  close,
  TWBackgroundLabel,
}: InputProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocus, setIsFocus] = useState(focus === undefined ? internalValue !== "" : focus);
  const [whatType, setWhatType] = useState(type);

  useEffect(() => {
    setInternalValue(value);
    if (internalValue !== "") setIsFocus(true);
  }, [value, internalValue]);

  useEffect(() => {
    if (focus !== undefined) setIsFocus(focus);
  }, [focus]);

  return (
    <div className={clsx("relative", error && (classWhenError || "mb-3"), className)}>
      <input
        className={clsx(
          `
          w-full px-3 py-3 border border-gray rounded-md 
          transition-all duration-200 ease-in-out focus:border-2
          focus:outline-none focus:border-accent
        `,
          close && "!pr-8",
          password && "pr-8",
          error && "border-red-500!"
        )}
        type={whatType}
        id={label}
        value={internalValue}
        onChange={onChange}
        onInput={(e) => setInternalValue((e.target as HTMLInputElement).value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => (internalValue !== "" ? setIsFocus(true) : setIsFocus(false))}
        autoComplete="off"
      />
      <label
        className={clsx(
          "absolute transition-all duration-200 ease-in-out pointer-events-none select-none whitespace-nowrap",
          isFocus ? labelFocus || "-top-2.5 left-3 text-xs text-accent font-medium px-1" : labelClass || "top-3.5 left-3 text-sm text-gray",
          isFocus && (TWBackgroundLabel || "bg-theme")
        )}
        htmlFor={label}
      >
        {isFocus ? capitalEachWords(label || "") : placeholder} {isFocus && optional && <span className="text-gray">(Optional)</span>}
      </label>
      {password && (
        <div className="cursor-pointer absolute top-0 right-0 h-full flex items-center pr-2">
          {whatType === "password" ? (
            <EyeOff size={20} className="text-gray" onClick={() => setWhatType("text")} />
          ) : (
            <Eye size={20} className="text-gray" onClick={() => setWhatType("password")} />
          )}
        </div>
      )}
      {error && <p className="absolute text-red-500 text-[12px] text-start">{error}</p>}
      {close && (
        <div className="absolute top-0 right-0 mt-3 flex items-center mr-2">
          <X onClick={close} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export default Input;

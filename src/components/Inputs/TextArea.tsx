import { useState } from "react";
import toCapitalize from "../../utils/toCapitalize";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import { X } from "lucide-react";

type TextAreaProps = {
  placeholder?: string;
  error?: string | null;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  optional?: boolean;
  labelClass?: string;
  initialFocus?: boolean;
  classWhenError?: string;
  labelFocus?: string;
  TWBackgroundLabel?: string;
  close?: () => void;
};

const TextArea = ({
  placeholder,
  error,
  label,
  value = "",
  onChange,
  className,
  optional,
  labelClass,
  initialFocus,
  classWhenError,
  labelFocus,
  close,
  TWBackgroundLabel,
}: TextAreaProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocus, setIsFocus] = useState(initialFocus);

  return (
    <div className={clsx("relative", error && (classWhenError || "mb-3"), className)}>
      <TextareaAutosize
        minRows={2}
        maxRows={8}
        className={clsx(
          "w-full px-3 py-3 overflow-auto border border-gray rounded-lg transition-all duration-200 ease-in-out h-full focus:outline-none focus:border-accent focus:border-2",
          close && "!pr-8",
          error && "border-red-500"
        )}
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
          isFocus ? labelFocus || "-top-2.5 left-3 text-xs text-accent font-medium px-1" : labelClass || "top-3.5 left-3 text-sm text-gray",
          isFocus && (TWBackgroundLabel || "bg-theme")
        )}
        htmlFor={label}
      >
        {isFocus ? toCapitalize(label || "") : placeholder} {isFocus && optional && <span className="text-gray">(Optional)</span>}
      </label>
      {error && <p className="absolute text-red-500 text-[12px] text-start">{error}</p>}
      {close && (
        <div className="absolute top-0 right-0 mt-3 flex items-center mr-2">
          <X onClick={close} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export default TextArea;

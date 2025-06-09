import { useEffect, useState } from "react";
import Input from "../Input";
import Slider from "../Slider";
import { DatePicker } from "antd";
import { X } from "lucide-react";
import Button from "../Button";
import errorHandler from "../../../utils/errorHandler";
import ErrorPopup from "../ErrorPopUp";
import { useNavigate } from "react-router";
import validateForms from "../../../utils/validateForms";

type Error = {
  title?: string;
  description?: string;
  targetDate?: Date | string;
  error?: {
    message?: string;
    title?: string;
    code?: string;
  } | null
};

interface Value extends Error {
  isPublic: boolean;
}

type CreateGoalValue = {
  title: string;
  description: string;
  targetDate: Date | string;
  isPublic: boolean;
};

type AddGoalPopupProps = {
  setToClose: () => void;
  submit: () => void;
  value: Value;
  setValue: React.Dispatch<React.SetStateAction<CreateGoalValue>>;
};

const AddGoalPopup = ({ setToClose, submit, value, setValue }: AddGoalPopupProps) => {
  const [error, setError] = useState<Error>({ title: "", description: "", targetDate: "", error: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({ title: "", description: "", targetDate: "", error: null });
    // console.log(e);
    const validate = validateForms(value, setError, { title: true, description: true, targetDate: true });
    // console.log(value);
    console.log(error);
    if (validate) {
      setIsSubmitting(false);
      return;
    }

    try {
      submit();
      setToClose();
    } catch (err) {
      errorHandler(err, setError);
      // console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target && !target.closest(".close-goal-popup-exception")) {
        setToClose();
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  });

  const errorAuth = error?.error?.code === "TOKEN_EXPIRED" || error?.error?.code === "USER_NOT_FOUND" || error?.error?.code === "INVALID_AUTH";

  const handleBackToLoginPage = () => {
    sessionStorage.removeItem("jwt-token");
    localStorage.removeItem("jwt-token");
    navigate("/signin");
  };

  return (
    <div className="z-50 fixed w-full h-full left-1/2 top-1/2 -translate-1/2 bg-[#1b1b1b0a] backdrop-blur-[2px] items-center flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="close-goal-popup-exception bg-(--theme) p-10 rounded-2xl w-100 gap-3 flex flex-col relative shadow-2xl border-(--theme-darker)"
      >
        <X className="absolute right-0 top-0 m-5 cursor-pointer" onClick={() => setToClose()} />
        <h2 className="text-2xl font-bold text-center mb-3">Create New Goal</h2>
        <Input
          error={error.title}
          label="title"
          placeholder="Add new goal title"
          onChange={(e) => setValue((prev) => ({ ...prev, title: e.target.value }))}
        />
        <Input
          error={error.description}
          label="description"
          placeholder="Add new goal description"
          onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
        />
        <div className="w-full flex flex-col">
          <DatePicker
            size="large"
            placeholder="Add target goal date"
            classNames={{ popup: { root: "close-goal-popup-exception" } }}
            id="date"
            onChange={(e: { $d: Date | null }) => e.$d && setValue((prev) => ({ ...prev, targetDate: e.$d! }))}
          />
          {error.targetDate && error.targetDate.toString() !== "" && (
            <p className="text-red-500 text-[12px] text-start">{error.targetDate as string}</p>
          )}
        </div>
        <Slider
          bgColor="bg-(--gray)"
          onClick={() => setValue((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
          value={value.isPublic}
          label="Set to public"
          className="mb-5"
          bgSize={28}
          size={12}
        />
        <Button text="Create New Goal" disabled={isSubmitting} />
      </form>
      {error?.error && (
        <ErrorPopup
          title={error.error.title}
          message={error.error.message}
          showBackToDashboard={!errorAuth}
          showBackToLoginPage={errorAuth}
          onBackToLoginPage={handleBackToLoginPage}
        />
      )}
    </div>
  );
};

export default AddGoalPopup;

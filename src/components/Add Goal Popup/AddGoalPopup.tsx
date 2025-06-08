import { useEffect, useState } from "react";
import Input from "../Input";
import Slider from "../Slider";
import { DatePicker } from "antd";
import { X } from "lucide-react";
import Button from "../Button";
import callApi from "../../../utils/callApi";
import errorHandler from "../../../utils/errorHandler";
import ErrorPopup from "../ErrorPopUp";
import { useNavigate } from "react-router";

type Error = {
  title: string;
  description: string;
  date: string;
  error?: {
    message?: string;
    title?: string;
    code?: string
  }
};

interface Value extends Error {
  isPublic: boolean;
}

type AddGoalPopupProps = {
  setToClose: () => void;
  reload: () => void
};

const validateForm = (value: Value, setError: React.Dispatch<React.SetStateAction<Error>>): boolean => {
  let err = false;
  if (value.title.trim() === "") {
    setError((prev) => ({ ...prev, title: "Title is required" }));
    err = true;
  }
  if (value.description.trim() === "") {
    setError((prev) => ({ ...prev, description: "Description is required" }));
    err = true;
  }
  if (value.date.trim() === "") {
    setError((prev) => ({ ...prev, date: "Date is required" }));
    err = true;
  }
  return err;
};

const AddGoalPopup = ({ setToClose, reload }: AddGoalPopupProps) => {
  const [value, setValue] = useState<Value>({ title: "", description: "", isPublic: true, date: "" });
  const [error, setError] = useState<Error>({ title: "", description: "", date: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // console.log(e);
    const validate = validateForm(value, setError);
    // console.log(value);
    if (validate) {
      setIsSubmitting(false);
      return;
    }

    try {
      const date = new Date(value.date);
      await callApi("/goal", { method: "POST", token: true, body: { ...value, date } });
      reload()
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
    <div className="z-50 absolute w-full h-full left-1/2 top-1/2 -translate-1/2 bg-[#1b1b1b0a] backdrop-blur-[2px] items-center flex justify-center shadow-2xl border-(--theme-darker)">
      <form onSubmit={handleSubmit} className="close-goal-popup-exception bg-(--theme) p-10 rounded-2xl w-100 gap-3 flex flex-col relative">
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
            onChange={(e: { $d: Date | null }) => e.$d && setValue((prev) => ({ ...prev, date: e.$d!.toString() }))}
          />
          {error.date !== "" && <p className="text-red-500 text-[12px] text-start">{error.date}</p>}
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

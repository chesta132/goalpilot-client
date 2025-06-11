import { X } from "lucide-react";
import Input from "../Inputs/Input";
import clsx from "clsx";
import TextArea from "../Inputs/TextArea";
import { ColorPicker, DatePicker, Switch } from "antd";
import React, { useEffect, useState } from "react";
import Button from "../Inputs/Button";
import validateForms from "@/utils/validateForms";
import type { TnewGoalValue } from "@/utils/types";

type AddGoalPopupProps = {
  appear?: boolean;
  setAppear?: React.Dispatch<React.SetStateAction<boolean>>;
  value: TnewGoalValue;
  setValue: React.Dispatch<React.SetStateAction<TnewGoalValue>>;
  handleSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

type Error = {
  title?: string;
  description?: string;
  targetDate?: string | Date;
  color?: string;
};

const AddGoalPopup = ({ appear, setAppear, value, setValue, handleSubmit, submitting, setSubmitting }: AddGoalPopupProps) => {
  const [error, setError] = useState<Error>({ title: "", description: "", targetDate: "", color: "" });

  const submitter = (e: React.FormEvent) => {
    e.preventDefault();
    setError({ title: "", description: "", targetDate: "", color: "" });
    const validate = validateForms(value, setError, { title: true, description: true, targetDate: true, color: true });
    if (validate) return;

    setSubmitting(true);
    handleSubmit(e);
  };

  const handleCancel = () => {
    if (setAppear) {
      setError({ title: "", description: "", targetDate: "", color: "" });
      setValue({
        title: "",
        description: "",
        targetDate: "",
        color: "#66b2ff",
        isPublic: true,
      });
      setAppear(false);
    }
  };

  useEffect(() => {
    const handleToggle = () => {
      if (appear) document.body.classList.add("overflow-hidden");
      if (!appear) document.body.classList.remove("overflow-hidden");
    };
    handleToggle();
  }, [appear]);

  if (!appear) return;

  return (
    <div className="flex backdrop-blur-[2px] backdrop-brightness-90 h-[100dvh] fixed w-full px-8 justify-center items-center z-[100] transition-all">
      <div className="px-6 py-10 bg-theme max-w-[580px] text-theme-reverse w-full rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold font-heading">Create New Goal</h1>
          <X className="cursor-pointer text-gray size-7 p-1" size={20} onClick={() => setAppear && setAppear(false)} />
        </div>
        <form className="flex flex-col gap-3" onSubmit={submitter}>
          <Input
            classWhenError="mb-5"
            initialFocus={value.title !== ""}
            error={error.title}
            label="Goal Title"
            placeholder="Enter your goal title"
            value={value.title}
            onChange={(e) => setValue((prev) => ({ ...prev, title: e.target.value }))}
          />
          <TextArea
            classWhenError="mb-5"
            initialFocus={value.description !== "" && true}
            error={error.description}
            value={value.description}
            label="Descripton"
            placeholder="Enter description of goal"
            onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex justify-between items-center bg-theme-darker/30 border-gray rounded-[8px] p-4.5">
            <div>
              <h2 className="text-[14px] font-medium">Make Public</h2>
              <p className="text-gray text-[12px]">Allow others to see this goal</p>
            </div>
            <Switch onChange={(e) => setValue((prev) => ({ ...prev, isPublic: e.valueOf() }))} value={value.isPublic} />
          </div>
          <div className="flex flex-1/2 items-center gap-6">
            <div className="w-full">
              <DatePicker
                styles={{
                  root: { background: "var(--theme)", color: "var(--theme-reverse)" },
                  popup: { root: { background: "var(--theme)", color: "var(--theme-reverse)" } },
                }}
                needConfirm
                status={error.targetDate && "error"}
                size="small"
                color="var(--theme)"
                className="w-full h-12 text-theme-reverse"
                placeholder="Choose target date of goal"
                onChange={(e) => (e ? setValue((prev) => ({ ...prev, targetDate: e.format() })) : setValue((prev) => ({ ...prev, targetDate: "" })))}
              />
              {error.targetDate && <p className="text-red-500 text-[12px] text-start">{error.targetDate.toString()}</p>}
            </div>
            <div className={clsx("flex flex-col", error.targetDate && !error.color && "pb-4.5")}>
              <p className="text-theme-reverse-dark whitespace-nowrap text-[13px]">Color Theme</p>
              <ColorPicker
                styles={{
                  popupOverlayInner: { background: "var(--theme)", color: "var(--theme-revers)" },
                }}
                showText
                format="hex"
                value={value.color}
                onChangeComplete={(e) => setValue((prev) => ({ ...prev, color: e.toHexString() }))}
              />
              {error.color && <p className="text-red-500 text-[12px] text-start">{error.color}</p>}
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button
              type="button"
              onClick={handleCancel}
              text="Cancel"
              className="bg-theme !text-theme-reverse border w-1/2 border-gray hover:bg-theme shadow-none"
            />
            <Button disabled={submitting} text="Create Goal" className="shadow-none whitespace-nowrap w-1/2" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalPopup;

import { X } from "lucide-react";
import Input from "../Inputs/Input";
import TextArea from "../Inputs/TextArea";
import { DatePicker, Select } from "antd";
import { useState, type FormEvent } from "react";
import ButtonV from "../Inputs/ButtonV";
import validateForms from "@/utils/validateForms";
import type { TError, TnewTaskValue } from "@/utils/types";
import { defaultNewTaskData, defaultNewTaskError } from "@/utils/defaultData";
import { handleFormError } from "@/utils/errorHandler";
import callApi from "@/utils/callApi";
import { useNotification } from "@/contexts/UseContexts";

type AddTaskPopupProps = {
  setAppear: React.Dispatch<React.SetStateAction<boolean>>;
  goalId: string;
  refetch?: () => void;
};

type Error = TError & {
  task?: string;
  description?: string;
  targetDate?: string | Date;
  difficulty?: string;
};

const AddTaskPopup = ({ setAppear, goalId, refetch }: AddTaskPopupProps) => {
  const [error, setError] = useState<Error>(defaultNewTaskError);
  const [value, setValue] = useState<TnewTaskValue>(defaultNewTaskData);
  const [submitting, setSubmitting] = useState(false);
  const { openNotification } = useNotification();

  const submitter = async (e: FormEvent) => {
    e.preventDefault();
    setError(defaultNewTaskError);
    const validate = validateForms(value, setError, { task: true, description: true, targetDate: true, difficulty: true });
    if (validate) return;

    setSubmitting(true);

    try {
      const response = await callApi("/task", { method: "POST", body: { ...value, goalId }, token: true });
      console.log(response);
      setAppear(false);
      if (refetch) refetch();
      openNotification({ message: response.data.notification, type: "success", button: "default" });
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (setAppear) {
      setError(defaultNewTaskError);
      setValue(defaultNewTaskData);
      setAppear(false);
    }
  };

  return (
    <div className="flex backdrop-blur-[2px] backdrop-brightness-90 h-[100dvh] fixed w-full px-4 md:px-8 justify-center items-center z-[100] transition-all">
      <div className="px-6 py-10 bg-theme max-w-[580px] text-theme-reverse w-full rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold font-heading">Create New Task</h1>
          <X className="cursor-pointer text-gray size-7 p-1" size={20} onClick={handleCancel} />
        </div>
        <form className="flex flex-col gap-3" onSubmit={submitter}>
          <Input
            classWhenError="mb-5"
            initialFocus={value.task !== ""}
            error={error.task}
            label="Task"
            placeholder="Enter your task"
            value={value.task}
            onChange={(e) => setValue((prev) => ({ ...prev, task: e.target.value }))}
          />
          <TextArea
            classWhenError="mb-5"
            initialFocus={value.description !== "" && true}
            error={error.description}
            value={value.description}
            label="Descripton"
            placeholder="Enter description of your task"
            onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex flex-1/2 items-center gap-6">
            <div className="w-full">
              <DatePicker
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
            <div className="w-fit">
            <Select
              placeholder={"Difficulty"}
              options={[
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
                { value: "very hard", label: "Very hard" },
              ]}
              allowClear
              onChange={(e) => setValue((prev) => ({ ...prev, difficulty: e }))}
              />
              {error.difficulty && <p className="text-red-500 text-[12px] text-start">{error.difficulty.toString()}</p>}
              </div>
          </div>
          <div className="flex gap-3 mt-5">
            <ButtonV
              type="button"
              onClick={handleCancel}
              text="Cancel"
              className="bg-theme !text-theme-reverse border w-1/2 border-gray hover:bg-theme shadow-none"
            />
            <ButtonV disabled={submitting} text="Create Goal" className="shadow-none whitespace-nowrap w-1/2" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPopup;

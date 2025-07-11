import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData, useNotification } from "@/contexts/UseContexts";
import useValidate from "@/hooks/useValidate";
import callApi from "@/utils/callApi";
import { decrypt } from "@/utils/cryptoUtils";
import { defaultNewTaskData } from "@/utils/defaultData";
import { handleFormError } from "@/utils/errorHandler";
import { difficultyOptions } from "@/utils/selectOptions";
import { capitalEachWords } from "@/utils/stringManip";
import type { TError, TNewTaskValue } from "@/utils/types";
import { DatePicker, Select } from "antd";
import { CirclePlus } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";

export const CreateTaskPage = () => {
  const [valueCreate, setValueCreate] = useState<TNewTaskValue>(defaultNewTaskData);
  const [error, setError] = useState<TNewTaskValue & TError>({ ...defaultNewTaskData, error: null });
  const [isSubmitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const { taskId } = useParams();
  const { openNotification } = useNotification();
  const { getData: getGoalData } = useGoalData();
  const { handleChangeForm, validateForm } = useValidate(valueCreate, error, setValueCreate, setError);

  useEffect(() => {
    const goalId = decrypt(sessionStorage.getItem("goal-id"));
    if (goalId) setValueCreate((prev) => ({ ...prev, goalId }));
    else handleBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError({ ...defaultNewTaskData, error: null });
    const validate = validateForm(valueCreate, {
      task: { max: 50 },
      description: { max: 1000 },
      targetDate: true,
      difficulty: true,
    });
    if (validate) {
      setSubmitting(false);
      return;
    }

    try {
      const response = await callApi("/task", { method: "POST", body: { ...valueCreate, goalId: valueCreate.goalId } });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      if (response.data._id === taskId) {
        setValueCreate(response.data);
      }
      getGoalData(valueCreate.goalId, false);
      handleBack(`/goal/${valueCreate.goalId}`);
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = (to: string | number = -1) => {
    sessionStorage.removeItem("goal-id");
    if (typeof to === "string") navigate(to);
    else if (typeof to === "number") navigate(to);
  };

  return (
    <div className="px-3 text-theme-reverse flex justify-center items-center pb-10">
      {error.error && <ErrorPopup error={error} />}
      <form onSubmit={handleCreate} className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-200 shadow-lg mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] font-semibold">Create Task</h1>
        </div>
        <div className="bg-gray h-[1px]" />
        <div className="mt-4 flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <Input
              error={error.task}
              onChange={(e) => handleChangeForm({ task: e.target.value })}
              value={valueCreate.task}
              label="Task Title"
              placeholder="Your task title"
              TWBackgroundLabel="bg-theme-dark"
            />
            <TextArea
              error={error.description}
              onChange={(e) => handleChangeForm({ description: e.target.value })}
              value={valueCreate.description}
              placeholder="Your task description"
              label="Task Description"
              TWBackgroundLabel="bg-theme-dark"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4 h-12">
              <div className="w-1/2 h-full">
                <DatePicker
                  placement="bottomRight"
                  styles={{ root: { background: "transparent", color: "var(--theme-reverse)" } }}
                  classNames={{ popup: { root: "datepicker" } }}
                  needConfirm
                  status={error.targetDate && "error"}
                  size="small"
                  color="var(--theme)"
                  className="w-full h-12 text-theme-reverse datepicker"
                  placeholder="Choose target date of goal"
                  onChange={(e) => handleChangeForm(e ? { targetDate: e.format() } : { targetDate: "" })}
                />
                {error.targetDate && <p className="text-red-500 text-[12px] text-start">{error.targetDate.toString()}</p>}
              </div>
              <div className="w-1/2 h-full">
                <Select
                  placement="bottomLeft"
                  status={error.difficulty && "error"}
                  placeholder={"Difficulty"}
                  className="select !size-full"
                  options={difficultyOptions.map((option) => ({ value: option, label: capitalEachWords(option) }))}
                  allowClear
                  onChange={(e) => handleChangeForm(e ? { difficulty: e } : { difficulty: "" })}
                />
                {error.difficulty && <p className="text-red-500 text-[12px] text-start">{error.difficulty.toString()}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-10">
          <ButtonV
            type="button"
            disabled={isSubmitting}
            onClick={handleBack}
            text="Cancel"
            className="text-[12px] !px-3 !py-2 bg-theme-darker/20 border hover:!text-white hover:bg-red-600 hover:border-red-500 border-gray !text-theme-reverse"
          />
          <ButtonV text="Create Task" icon={<CirclePlus size={14} />} disabled={isSubmitting} className="text-[12px] !px-3 !py-2" />
        </div>
      </form>
    </div>
  );
};

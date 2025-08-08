import { useGoalData, useNotification } from "@/contexts/UseContexts";
import callApi from "@/utils/callApi";
import { handleError } from "@/utils/errorHandler";
import type { GoalData } from "@/types/types";
import { Plus } from "lucide-react";
import React, { type FormEvent, type KeyboardEvent } from "react";
import { useParams } from "react-router";
import ButtonV from "../Inputs/ButtonV";
import TextArea from "../Inputs/TextArea";
import clsx from "clsx";
import { encrypt } from "@/utils/cryptoUtils";

type AiInput = {
  value: string;
  error: null | string;
  loading: boolean;
};

type AddTaskComponentProps = {
  data: GoalData;
  loading: boolean;
  addTaskAIInput: boolean;
  setAiInput: React.Dispatch<React.SetStateAction<AiInput>>;
  aiInput: AiInput;
  setAddTaskAIInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AddTask({ data, loading, addTaskAIInput, setAiInput, aiInput, setAddTaskAIInput }: AddTaskComponentProps) {
  const { goalId } = useParams();
  const { clearGoalError, getData, setError } = useGoalData();
  const { openNotification } = useNotification();

  const generateWithAI = async () => {
    clearGoalError();
    if (aiInput.value.length < 20) {
      setAiInput((prev) => ({ ...prev, error: "Minimum character is 20 character" }));
      return;
    }

    try {
      setAiInput((prev) => ({ ...prev, loading: true, error: null }));
      const response = await callApi("/ai", { method: "POST", body: { query: aiInput.value, goalId } });
      openNotification({ message: response.data.notification, type: "success", button: "default" });
      if (goalId) getData(goalId);
      setAddTaskAIInput(false);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setAiInput((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (addTaskAIInput) generateWithAI();
    else setAddTaskAIInput(true);
  };

  const onTab = (e: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.key !== "Tab") return;
    else if (aiInput.value.trim() === "") {
      setAiInput((prev) => ({
        ...prev,
        value: `I want 5 task to achieve ${data.title}. Here's description of the goal, ${data.description}.`,
      }));
    }
  };

  const setGoalId = () => {
    if (!loading) {
      const encryptedData = encrypt(data.id);
      sessionStorage.setItem("goal-id", encryptedData);
    }
  };

  return (
    <div className="mt-10 lg:mt-0 w-full flex flex-col gap-3">
      <ButtonV
        link={{ to: !loading ? "/task/create" : "." }}
        onClick={setGoalId}
        style={{ background: data.color }}
        text="Create New Task"
        icon={<Plus className="bg-transparent" />}
        className="shadow-sm whitespace-nowrap w-full bg-(--goal-accent)! hover:bg-(--goal-accent-strong)! text-[13px]! md:text-[14px]!"
      />
      <form onSubmit={handleSubmit} onKeyUpCapture={onTab}>
        {addTaskAIInput && (
          <div className="flex w-full flex-col mb-3">
            <TextArea
              close={() => {
                setAddTaskAIInput(false);
                setAiInput((prev) => ({ ...prev, value: "", error: null }));
              }}
              labelAfterLabel={aiInput.value.trim() === "" ? "(Tab to apply text in placeholder)" : undefined}
              label="Generate Task"
              placeholder={`I want 5 task to achieve ${data.title.slice(0, 30)}...`}
              className="mt-2 w-full whitespace-break-spaces"
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              onChange={(e) =>
                setAiInput((prev) => (prev.value.length > 20 ? { ...prev, value: e.target.value, error: "" } : { ...prev, value: e.target.value }))
              }
              value={aiInput.value}
            />
            {aiInput.error && <p className="text-red-500 text-[12px] text-start">{aiInput.error}</p>}
          </div>
        )}
        <ButtonV
          disabled={aiInput.loading}
          text="Generate Tasks With AI"
          icon={
            <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.00975 3L7.35 5.1L7.7 6.85L8.65993 8.32057L9.8 9.3L11.2 9.65L14 10L11.2 10.35L9.8 10.7L8.65993 11.6089L7.7 13.5L7.35 14.55L7.00975 17L6.65 14.55L6.3 13.5L5.35957 11.6089L4.2 10.7L2.8 10.35L0 10L2.8 9.65L4.2 9.3L5.35957 8.32057L6.3 6.85L6.65 5.1L7.00975 3Z"
                className="fill-theme-reverse"
              />
              <path
                d="M14.5063 14L14.725 15.2L14.95 16.2L15.5671 17.0403L16.3 17.6L17.2 17.8L19 18L17.2 18.2L16.3 18.4L15.5671 18.9193L14.95 20L14.725 20.6L14.5063 22L14.275 20.6L14.05 20L13.4454 18.9193L12.7 18.4L11.8 18.2L10 18L11.8 17.8L12.7 17.6L13.4454 17.0403L14.05 16.2L14.275 15.2L14.5063 14Z"
                className="fill-theme-reverse"
              />
              <path
                d="M17.0056 0L17.2 1.2L17.4 2.2L17.9485 3.04033L18.6 3.6L19.4 3.8L21 4L19.4 4.2L18.6 4.4L17.9485 4.91935L17.4 6L17.2 6.6L17.0056 8L16.8 6.6L16.6 6L16.0626 4.91935L15.4 4.4L14.6 4.2L13 4L14.6 3.8L15.4 3.6L16.0626 3.04033L16.6 2.2L16.8 1.2L17.0056 0Z"
                className="fill-theme-reverse"
              />
            </svg>
          }
          className={clsx(
            "shadow-sm whitespace-nowrap w-full !text-theme-reverse md:text-[14px] bg-transparent border-accent border hover:bg-theme-dark hover:border-violet-500 text-[13px]!",
            aiInput.loading && "animate-transparent-shimmer -bg-linear-45 from-transparent from-40% via-violet-500 via-50% to-transparent to-60%"
          )}
        />
      </form>
    </div>
  );
}

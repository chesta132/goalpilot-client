import toCapitalize from "@/utils/toCapitalize";
import type { ErrorWithValues, TaskData } from "@/utils/types";
import clsx from "clsx";
import { Edit, Trash2Icon, X } from "lucide-react";
import ButtonV from "../Inputs/ButtonV";
import { useEffect, useState, type FormEvent } from "react";
import Input from "../Inputs/Input";
import validateForms from "@/utils/validateForms";
import { DatePicker, Select, Switch } from "antd";
import TextArea from "../Inputs/TextArea";
import { handleFormError } from "@/utils/errorHandler";
import dayjs from "dayjs";
import callApi from "@/utils/callApi";
import { useParams } from "react-router";

type EditTaskPopupProps = {
  data: TaskData;
  setClose: () => void;
  timeLeft: number;
  deletes: () => void;
  refetch: () => void;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
};

type DeletePopupProps = {
  deletes: () => void;
  setClose: () => void;
};

export const DeleteTaskPopup = ({ setClose, deletes }: DeletePopupProps) => {
  return (
    <div className="fixed z-[99999] px-10 max-w-[780px] text-[13px] top-1/2 left-1/2 -translate-1/2 w-full h-full backdrop-blur-[2px] flex items-center justify-center">
      <div className="px-6 py-10 bg-theme-dark text-theme-reverse w-full rounded-2xl shadow-lg gap-7 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-200 p-2 rounded-full size-10">
              <Trash2Icon className="stroke-red-400" />
            </div>
            <h1 className="font-heading font-semibold text-[16px]">Delete Task</h1>
          </div>
        </div>
        <div>
          <h2 className="text-[14px] text-theme-reverse-darker">Are you sure you want to delete this task?</h2>
        </div>
        <div className="flex justify-end gap-3">
          <ButtonV onClick={setClose} text="Cancel" className="shadow-none !py-2 !px-5 !text-theme-reverse" />
          <ButtonV
            onClick={deletes}
            text="Delete Task"
            className="bg-transparent shadow-none border border-red-700 hover:bg-red-700 !py-2 !px-5 !text-theme-reverse"
            icon={<Trash2Icon size={14} />}
          />
        </div>
      </div>
    </div>
  );
};

export const EditTaskPopup = ({ data, setClose, timeLeft, deletes, refetch, setIsCompleted }: EditTaskPopupProps) => {
  const [deletePopup, setDeletePopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [valueEdit, setValueEdit] = useState(data);
  const [errorEdit, setErrorEdit] = useState<ErrorWithValues>({ error: null });
  const [loadingEdit, setLoadingEdit] = useState(false);

  const { goalId } = useParams();

  const dateToDisplay = data?.isCompleted
    ? data.completedAt
      ? new Date(data.completedAt).toDateString()
      : new Date().toDateString()
    : data.targetDate
    ? new Date(data.targetDate).toDateString()
    : new Date(data.createdAt).toDateString();

  const timeLeftMonthPlural = timeLeft >= 0 ? (Math.floor(timeLeft / 30) > 1 ? "s" : "") : Math.floor(Math.abs(timeLeft) / 30) > 1 ? "s" : "";
  const timeLeftYearPlural = timeLeft >= 0 ? (Math.floor(timeLeft / 365) > 1 ? "s" : "") : Math.floor(Math.abs(timeLeft) / 365) > 1 ? "s" : "";
  const timeLeftToDisplay =
    timeLeft >= 0
      ? timeLeft === 0
        ? "Today"
        : timeLeft < 30
        ? `${timeLeft} day${timeLeft !== 1 ? "s" : ""} left`
        : timeLeft < 365 && timeLeft >= 30
        ? `${Math.floor(timeLeft / 30)} Month${timeLeftMonthPlural} left`
        : `${Math.floor(timeLeft / 365)} Year${timeLeftMonthPlural} left`
      : timeLeft > -30
      ? `${Math.abs(timeLeft)} day${Math.abs(timeLeft) !== 1 ? "s" : ""} ago`
      : timeLeft > -365 && timeLeft <= -30
      ? `${Math.floor(Math.abs(timeLeft) / 30)} Month${timeLeftYearPlural} ago`
      : `${Math.floor(Math.abs(timeLeft) / 365)} Year${timeLeftYearPlural} ago`;

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  const editTask = async (e: FormEvent) => {
    e.preventDefault();
    const validate = validateForms(valueEdit, setErrorEdit, {
      task: true,
      description: true,
      targetDate: true,
      difficulty: true,
      taskMaxChar: 50,
      descMaxChar: 1000,
    });
    if (validate) return;

    try {
      setLoadingEdit(true);
      await callApi("/task", { method: "PUT", token: true, body: { ...valueEdit, taskId: data._id, goalId } });
      refetch();
      setIsCompleted(valueEdit.isCompleted);
    } catch (err) {
      handleFormError(err, setErrorEdit);
    } finally {
      setLoadingEdit(false);
      setClose();
    }
  };

  return (
    <div className="flex backdrop-blur-[2px] backdrop-brightness-90 h-[100dvh] fixed top-1/2 left-1/2 -translate-1/2 w-full px-4 md:px-8 justify-center items-center z-[99] transition-all">
      {deletePopup && <DeleteTaskPopup setClose={() => setDeletePopup(false)} deletes={deletes} />}
      <div className="px-6 py-10 relative bg-theme max-w-[780px] text-[13px] text-theme-reverse w-full rounded-2xl shadow-lg gap-7 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-bold font-heading">{toCapitalize(data.task)}</h1>
            <div className="flex gap-2">
              <p
                className={clsx(
                  "bg-theme-darker/60 rounded-full text-[12px] px-2 py-1 inline w-fit",
                  data.isCompleted ? "text-green-400" : "text-red-600"
                )}
              >
                {data.isCompleted ? "Completed" : "Incomplete"}
              </p>
              <p className="bg-theme-darker/60 rounded-full text-[12px] px-2 py-1 inline w-fit">{toCapitalize(data.difficulty)} difficulty</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button disabled={loadingEdit} className="p-1 cursor-pointer" onClick={setClose}>
              <X />
            </button>
          </div>
        </div>

        {!editMode ? (
          <div className="px-3 flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="font-medium text-theme-reverse-dark">Task Title</h2>
                <h1 className="font-heading font-semibold text-[16px]">{data.task}</h1>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-medium text-theme-reverse-dark">
                  {data.isCompleted ? "Completed at" : data.targetDate ? "Target Date" : "Created at"}
                </h2>
                <div>
                  <h1 className="font-heading font-semibold text-[16px]">{dateToDisplay}</h1>
                  {data.targetDate && !data.isCompleted && (
                    <p
                      className={clsx(
                        "mt-1",
                        timeLeft > 3 && timeLeft <= 7 ? "text-yellow-500 font-medium" : timeLeft <= 3 && "text-red-600 font-medium"
                      )}
                    >
                      {timeLeftToDisplay}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-theme-reverse-dark">Description</h2>
              <h1 className="font-heading text-[15px] leading-6 max-h-50 overflow-auto">{data.description}</h1>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <ButtonV
                onClick={() => setEditMode(true)}
                text="Edit Task"
                className="shadow-none !py-2 !px-5 !text-theme-reverse"
                icon={<Edit size={14} />}
              />
              <ButtonV
                onClick={() => setDeletePopup(true)}
                text="Delete Task"
                className="bg-transparent shadow-none border border-red-700 hover:bg-red-700 !py-2 !px-5 !text-theme-reverse"
                icon={<Trash2Icon size={14} />}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={editTask} className="px-3 flex flex-col gap-4">
            <div className="flex justify-center flex-col gap-4">
              <div className="flex items-center gap-5">
                <Input
                  initialFocus={valueEdit.task !== "" && true}
                  onChange={(e) => setValueEdit((prev) => ({ ...prev, task: e.target.value }))}
                  className="w-full"
                  label="Task Title"
                  placeholder="Edit Task Title"
                  error={errorEdit.task}
                  value={valueEdit.task}
                />
                <div className="w-fit">
                  <Select
                    value={valueEdit.difficulty}
                    placeholder={"Difficulty"}
                    options={[
                      { value: "easy", label: "Easy" },
                      { value: "medium", label: "Medium" },
                      { value: "hard", label: "Hard" },
                      { value: "very hard", label: "Very hard" },
                    ]}
                    allowClear
                    onChange={(e) => setValueEdit((prev) => ({ ...prev, difficulty: e }))}
                  />
                  {errorEdit.difficulty && <p className="text-red-500 text-[12px] text-start">{errorEdit.difficulty.toString()}</p>}
                </div>
              </div>
              <TextArea
                classWhenError="mb-5"
                initialFocus={valueEdit.description !== "" && true}
                error={errorEdit.description}
                value={valueEdit.description}
                label="Descripton"
                placeholder="Enter description of your task"
                onChange={(e) => setValueEdit((prev) => ({ ...prev, description: e.target.value }))}
              />
              <div className="w-full">
                <DatePicker
                  styles={{ root: { background: "transparent", color: "var(--theme-reverse)" } }}
                  classNames={{ popup: { root: "datepicker" } }}
                  defaultValue={dayjs(data.targetDate || data.createdAt)}
                  needConfirm
                  status={errorEdit.targetDate && "error"}
                  size="small"
                  color="var(--theme)"
                  className="w-full h-12 text-theme-reverse datepicker"
                  placeholder="Choose target date of goal"
                  onChange={(e) =>
                    e ? setValueEdit((prev) => ({ ...prev, targetDate: e.format() })) : setValueEdit((prev) => ({ ...prev, targetDate: "" }))
                  }
                />
                {errorEdit.targetDate && <p className="text-red-500 text-[12px] text-start">{errorEdit.targetDate.toString()}</p>}
              </div>
              <div className="flex justify-between items-center bg-theme-darker/30 border-gray rounded-[8px] p-4.5">
                <div>
                  <h2 className="text-[14px] font-medium">Mark Completed</h2>
                  <p className="text-gray text-[12px]">Mark this task completed</p>
                </div>
                <Switch
                  style={{ backgroundColor: valueEdit.isCompleted ? "var(--accent)" : "var(--theme-darker)" }}
                  onChange={(e) => setValueEdit((prev) => ({ ...prev, isCompleted: e.valueOf() }))}
                  value={valueEdit.isCompleted}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <ButtonV disabled={loadingEdit} text="Save" className="shadow-none !py-2 !px-5 !text-theme-reverse" icon={<Edit size={14} />} />
              <ButtonV
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setErrorEdit({ error: null });
                }}
                text="Cancel"
                className="bg-theme-dark hover:bg-theme-darker shadow-none !py-2 !px-5 !text-theme-reverse"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

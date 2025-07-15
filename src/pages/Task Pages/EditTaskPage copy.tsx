import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import { DeletePopup } from "@/components/Popups/DeletePopup";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData, useNotification, useTaskData } from "@/contexts/UseContexts";
import useValidate from "@/hooks/useValidate";
import callApi from "@/utils/callApi";
import { defaultTaskData } from "@/utils/defaultData";
import { handleError, handleFormError } from "@/utils/errorHandler";
import { difficultyOptions } from "@/utils/selectOptions";
import { capitalEachWords } from "@/utils/stringManip";
import type { TaskData, TError } from "@/types/types";
import { DatePicker, Select, Switch } from "antd";
import dayjs from "dayjs";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { decrypt } from "@/utils/cryptoUtils";

export const EditTaskPage = () => {
  const { getData: getTaskData, data: taskData, setData: setTaskData } = useTaskData();

  const [valueEdit, setValueEdit] = useState<TaskData>(defaultTaskData);
  const [error, setError] = useState<TaskData & TError>({ ...defaultTaskData, error: null, difficulty: "" });
  const [isSubmitting, setSubmitting] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const navigate = useNavigate();

  const { taskId } = useParams();
  const { openNotification } = useNotification();
  const { getData: getGoalData, setData: setGoalData, data: goalData } = useGoalData();
  const { handleChangeForm, validateForm } = useValidate(valueEdit, error, setValueEdit, setError);

  useEffect(() => {
    const f = async () => {
      if (taskId && taskData.id !== taskId) {
        await getTaskData(taskId);
      }
      setValueEdit(taskData);
    };
    f();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskData]);

  useEffect(() => {
    if (!!valueEdit.id || !!valueEdit._id) {
      if (valueEdit.id !== taskId && taskId !== decrypt(sessionStorage.getItem("task-id"))) {
        sessionStorage.removeItem("task-id");
        setTaskData(defaultTaskData);
        navigate(-1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, taskId, valueEdit.id, valueEdit._id]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError({ ...defaultTaskData, error: null, difficulty: "" });
    const validate = validateForm({
      task: { max: 50 },
      description: { max: 1000 },
      targetDate: true,
      difficulty: true,
    });
    if (validate) {
      setSubmitting(false);
      return;
    }

    if (JSON.stringify(valueEdit) === JSON.stringify(taskData)) {
      openNotification({ message: "Items must have changes", type: "warning", button: "default" });
      setTimeout(() => {
        setSubmitting(false);
      }, 500);
      return;
    }

    try {
      const response = await callApi("/task", { method: "PUT", body: { ...valueEdit, taskId, goalId: valueEdit.goalId } });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      const editedTask = goalData.tasks.map((task) => (JSON.stringify(task) === JSON.stringify(taskData) ? response.data : task));
      if (response.data.goalId === goalData._id) setGoalData((prev) => ({ ...prev, tasks: editedTask }));
      setTaskData(response.data);
      handleBack(`/goal/${response.data.goalId}`);
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = (to: string | number = -1) => {
    sessionStorage.removeItem("task-id");
    if (typeof to === "string") navigate(to);
    else if (typeof to === "number") navigate(to);
  };

  const handleUndo = async (goalId: string) => {
    try {
      const response = await callApi("/task/restore", { method: "PUT", body: { taskId } });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      getGoalData(goalId, false);
    } catch (err) {
      handleError(err, setError);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const response = await callApi("/task", { method: "DELETE", body: { taskId, goalId: valueEdit.goalId } });
      openNotification({
        type: "success",
        buttonFunc: { f: handleUndo, label: "Undo", params: [valueEdit.goalId] },
        message: response.data.notification,
      });
      setGoalData((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== valueEdit.id) }));
      handleBack(`/goal/${valueEdit.goalId}`);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-3 text-theme-reverse flex justify-center items-center mb-25">
      {error.error && <ErrorPopup error={error} />}
      {deletePopup && <DeletePopup deletes={handleDelete} item="task" setClose={() => setDeletePopup(false)} />}
      <form onSubmit={handleSave} className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-250 shadow-lg mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] font-semibold">Edit Task</h1>
          <div className="flex gap-3">
            <ButtonV
              type="button"
              disabled={isSubmitting}
              onClick={() => handleBack()}
              text="Cancel"
              className="text-[12px] !px-3 !py-2 bg-theme-darker/20 border hover:!text-white hover:bg-red-600 hover:border-red-500 border-gray !text-theme-reverse"
            />
            <ButtonV text="Save Changes" icon={<Edit size={14} />} disabled={isSubmitting} className="text-[12px] !px-3 !py-2" />
          </div>
        </div>
        <div className="bg-gray h-[1px]" />
        <div className="mt-4 flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <Input
              error={error.task}
              onChange={(e) => handleChangeForm({ task: e.target.value }, { max: 50 })}
              value={valueEdit.task}
              focus
              label="Task Title"
              placeholder="Edit your task title"
              TWBackgroundLabel="bg-theme-dark"
            />
            <TextArea
              error={error.description}
              onChange={(e) => handleChangeForm({ description: e.target.value }, { max: 1000 })}
              value={valueEdit.description}
              focus
              placeholder="Edit your task description"
              label="Task Description"
              TWBackgroundLabel="bg-theme-dark"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4 h-12">
              <div className="w-1/2 h-full">
                <DatePicker
                  value={dayjs(valueEdit.targetDate)}
                  placement="topLeft"
                  styles={{ root: { background: "transparent", color: "var(--theme-reverse)" } }}
                  classNames={{ popup: { root: "datepicker" } }}
                  needConfirm
                  status={error.targetDate && "error"}
                  size="small"
                  color="var(--theme)"
                  className="w-full h-12 text-theme-reverse datepicker"
                  placeholder="Choose target date of task"
                  onChange={(e) => handleChangeForm(e ? { targetDate: e.format() } : { targetDate: "" })}
                />
                {error.targetDate && <p className="text-red-500 text-[12px] text-start">{error.targetDate.toString()}</p>}
              </div>
              <div className="w-1/2 h-full">
                <Select
                  status={error.difficulty && "error"}
                  defaultValue={valueEdit.difficulty}
                  placeholder={"Difficulty"}
                  className="select !size-full"
                  options={difficultyOptions.map((option) => ({ value: option, label: capitalEachWords(option) }))}
                  allowClear
                  onChange={(e) => handleChangeForm<TaskData>(e ? { difficulty: e } : { difficulty: "" })}
                />
                {error.difficulty && <p className="text-red-500 text-[12px] text-start">{error.difficulty.toString()}</p>}
              </div>
            </div>
            <div className="flex justify-between items-center bg-theme-darker/30 border-gray rounded-[8px] p-4.5">
              <div>
                <h2 className="text-[14px] font-medium">Mark as complete</h2>
                <p className="text-gray text-[12px]">Check to mark this task as finished</p>
              </div>
              <Switch
                style={{ backgroundColor: valueEdit.isCompleted ? "var(--accent)" : "var(--theme-darker)" }}
                onChange={(e) => handleChangeForm({ isCompleted: e.valueOf() })}
                value={valueEdit.isCompleted}
              />
            </div>
          </div>
        </div>
        <div className=" mt-3 flex justify-between items-end">
          <h2 className="text-gray text-[13px]">Created on {new Date(valueEdit.createdAt).toLocaleDateString()}</h2>
          <ButtonV
            type="button"
            icon={<Trash2 size={13} />}
            text="Delete Task"
            onClick={() => setDeletePopup(true)}
            className="text-[12px] !px-3 !py-2 text-white! bg-red-600 border hover:bg-red-700 border-none"
          />
        </div>
      </form>
    </div>
  );
};

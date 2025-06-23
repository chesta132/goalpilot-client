import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import { DeletePopup } from "@/components/Popups/DeletePopup";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData, useNotification, useUserData } from "@/contexts/UseContexts";
import callApi from "@/utils/callApi";
import { defaultTaskData } from "@/utils/defaultData";
import { errorAuthBool, handleError, handleFormError } from "@/utils/errorHandler";
import toCapitalize from "@/utils/toCapitalize";
import type { ErrorWithValues, TaskData } from "@/utils/types";
import validateForms from "@/utils/validateForms";
import { DatePicker, Select, Switch } from "antd";
import dayjs from "dayjs";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const selectOptions = ["easy", "medium", "hard", "very hard"];

export const EditTaskPage = () => {
  const { taskId } = useParams();
  const { openNotification } = useNotification();
  const { refetchData } = useUserData();
  const { getData: getGoalData } = useGoalData();

  const [valueEdit, setValueEdit] = useState<TaskData>(JSON.parse(sessionStorage.getItem("task-data") || JSON.stringify(defaultTaskData)));
  const [error, setError] = useState<ErrorWithValues>({ error: null });
  const [isSubmitting, setSubmitting] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const navigate = useNavigate();
  const errorAuth = errorAuthBool(error);

  useEffect(() => {
    if (valueEdit._id !== taskId || !valueEdit._id) navigate(-1);
  }, [navigate, taskId, valueEdit._id]);

  const handleSave = async () => {
    setSubmitting(true);
    setError({ error: null });
    const validate = validateForms(valueEdit, setError, {
      task: true,
      description: true,
      targetDate: true,
      difficulty: true,
      taskMaxChar: 50,
      descMaxChar: 1000,
    });
    if (validate) {
      setSubmitting(false);
      return;
    }
    try {
      const response = await callApi("/task", { method: "PUT", token: true, body: { ...valueEdit, taskId, goalId: valueEdit.goalId } });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      sessionStorage.setItem("task-data", JSON.stringify(response.data));
      if (response.data._id === taskId) {
        setValueEdit(response.data);
      }
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem("task-data");
    navigate(-1);
  };

  const handleUndo = async (goalId: string) => {
    try {
      const response = await callApi("/task/restore", { method: "PUT", body: { taskId }, token: true });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      refetchData();
      getGoalData(goalId, false);
    } catch (err) {
      handleError(err, setError);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const response = await callApi("/task", { method: "DELETE", token: true, body: { taskId, goalId: valueEdit.goalId } });
      openNotification({
        type: "success",
        buttonFunc: { f: handleUndo, label: "Undo", params: [valueEdit.goalId] },
        message: response.data.notification,
      });
      refetchData();
      getGoalData(valueEdit.goalId, false);
      navigate("/");
    } catch (err) {
      handleError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-22 px-3 text-theme-reverse flex justify-center items-center">
      {error.error && (
        <ErrorPopup
          title={error && error.error.title}
          message={error && error.error.message}
          showBackToDashboard={!errorAuth && error.error.code !== "ERR_NETWORK" && error.error.code !== "ERR_BAD_REQUEST"}
          showBackToLoginPage={!errorAuth}
        />
      )}
      {deletePopup && <DeletePopup deletes={handleDelete} item="task" setClose={() => setDeletePopup(false)} />}
      <div className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-250 shadow-lg mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] font-semibold">Edit Task</h1>
          <div className="flex gap-3">
            <ButtonV
              disabled={isSubmitting}
              onClick={handleBack}
              text="Cancel"
              className="text-[12px] !px-3 !py-2 bg-theme-darker/20 border hover:!text-white hover:bg-red-600 hover:border-red-500 border-gray !text-theme-reverse"
            />
            <ButtonV text="Save Changes" icon={<Edit size={14} />} disabled={isSubmitting} onClick={handleSave} className="text-[12px] !px-3 !py-2" />
          </div>
        </div>
        <div className="bg-gray h-[1px]" />
        <div className="mt-4 flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <Input
              error={error.task}
              onChange={(e) => setValueEdit((prev) => ({ ...prev, task: e.target.value }))}
              value={valueEdit.task}
              initialFocus
              label="Task Title"
              placeholder="Edit your task title"
              TWBackgroundLabel="bg-theme-dark"
            />
            <TextArea
              error={error.description}
              onChange={(e) => setValueEdit((prev) => ({ ...prev, description: e.target.value }))}
              value={valueEdit.description}
              initialFocus
              placeholder="Edit your task description"
              label="Task Description"
              TWBackgroundLabel="bg-theme-dark"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4 h-12">
              <div className="w-1/2 h-full">
                <DatePicker
                  defaultValue={dayjs(valueEdit.targetDate)}
                  placement="topLeft"
                  styles={{ root: { background: "transparent", color: "var(--theme-reverse)" } }}
                  classNames={{ popup: { root: "datepicker" } }}
                  needConfirm
                  status={error.targetDate && "error"}
                  size="small"
                  color="var(--theme)"
                  className="w-full h-12 text-theme-reverse datepicker"
                  placeholder="Choose target date of goal"
                  onChange={(e) =>
                    e ? setValueEdit((prev) => ({ ...prev, targetDate: e.format() })) : setValueEdit((prev) => ({ ...prev, targetDate: "" }))
                  }
                />
                {error.targetDate && <p className="text-red-500 text-[12px] text-start">{error.targetDate.toString()}</p>}
              </div>
              <div className="w-1/2 h-full">
                <Select
                  status={error.difficulty && "error"}
                  defaultValue={valueEdit.difficulty}
                  placeholder={"Goal Status"}
                  className="select !size-full"
                  options={selectOptions.map((option) => ({ value: option, label: toCapitalize(option) }))}
                  allowClear
                  onChange={(e) => setValueEdit((prev) => ({ ...prev, difficulty: e }))}
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
                onChange={(e) => setValueEdit((prev) => ({ ...prev, isCompleted: e.valueOf() }))}
                value={valueEdit.isCompleted}
              />
            </div>
          </div>
        </div>
        <div className=" mt-3 flex justify-between items-end">
          <h2 className="text-gray text-[13px]">Created on {new Date(valueEdit.createdAt).toLocaleDateString()}</h2>
          <ButtonV
            icon={<Trash2 size={13} />}
            text="Delete Goal"
            onClick={() => setDeletePopup(true)}
            className="text-[12px] !px-3 !py-2 text-white! bg-red-600 border hover:bg-red-700 border-none"
          />
        </div>
      </div>
    </div>
  );
};

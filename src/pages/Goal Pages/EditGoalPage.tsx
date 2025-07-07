import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import { DeletePopup } from "@/components/Popups/DeletePopup";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData, useNotification } from "@/contexts/UseContexts";
import callApi from "@/utils/callApi";
import { defaultGoalData } from "@/utils/defaultData";
import { handleError, handleFormError } from "@/utils/errorHandler";
import { statusOptions } from "@/utils/selectOptions";
import toCapitalize from "@/utils/toCapitalize";
import type { GoalData, TError } from "@/utils/types";
import validateForms from "@/utils/validateForms";
import { ColorPicker, DatePicker, Select, Switch } from "antd";
import dayjs from "dayjs";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

type TValueEdit = Omit<GoalData, "targetDate"> & { targetDate: Date | string };

export const EditGoalPage = () => {
  const defaultValue = JSON.parse(sessionStorage.getItem("goal-data") || JSON.stringify(defaultGoalData));
  const navigate = useNavigate();
  const { goalId } = useParams();
  const { setData, getData, deleteGoal } = useGoalData();
  const { openNotification } = useNotification();

  const [valueEdit, setValueEdit] = useState<TValueEdit>(defaultValue);
  const [error, setError] = useState<TValueEdit & TError>({ ...defaultGoalData, error: null, targetDate: "", status: "" });
  const [isSubmitting, setSubmitting] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    if (valueEdit._id !== goalId || !valueEdit._id) {
      sessionStorage.removeItem("goal-data");
      navigate(-1);
    }
  }, [goalId, valueEdit._id, navigate]);

  const handleSave = async () => {
    setSubmitting(true);
    setError({ ...defaultGoalData, error: null, targetDate: "", status: "" });
    const validate = validateForms(valueEdit, setError, {
      title: true,
      description: true,
      targetDate: true,
      color: true,
      status: true,
      titleMaxChar: 100,
      descMaxChar: 1500,
    });
    if (validate) {
      setSubmitting(false);
      return;
    }

    if (JSON.stringify(valueEdit) === JSON.stringify(defaultValue)) {
      openNotification({ message: "Items must have changes", type: "warning", button: "default" });
      setTimeout(() => {
        setSubmitting(false);
      }, 500);
      return;
    }

    try {
      const response = await callApi("/goal", { method: "PUT", body: { ...valueEdit, goalId } });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      sessionStorage.setItem("goal-data", JSON.stringify(response.data));
      if (response.data._id === goalId) setData(response.data);
      else if (goalId) getData(goalId, false);
      handleBack(`/goal/${valueEdit._id}`);
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = (to: string | number = -1) => {
    sessionStorage.removeItem("task-data");
    if (typeof to === "string") navigate(to);
    else if (typeof to === "number") navigate(to);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteGoal();
      handleBack("/");
    } catch (err) {
      handleError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-3 text-theme-reverse flex justify-center items-center pb-10 relative">
      {error.error && <ErrorPopup error={error} />}
      {deletePopup && <DeletePopup deletes={handleDelete} item="goal" setClose={() => setDeletePopup(false)} />}
      <div className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-250 shadow-lg mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] font-semibold">Edit Goal</h1>
          <div className="flex gap-3">
            <ButtonV
              disabled={isSubmitting}
              onClick={() => handleBack(`/goal/${valueEdit._id}`)}
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
              error={error.title}
              onChange={(e) => setValueEdit((prev) => ({ ...prev, title: e.target.value }))}
              value={valueEdit.title}
              initialFocus
              label="Goal Title"
              placeholder="Edit your goal title"
              TWBackgroundLabel="bg-theme-dark"
            />
            <TextArea
              error={error.description}
              onChange={(e) => setValueEdit((prev) => ({ ...prev, description: e.target.value }))}
              value={valueEdit.description}
              initialFocus
              placeholder="Edit your goal description"
              label="Goal Description"
              TWBackgroundLabel="bg-theme-dark"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div>
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
            <div className="flex justify-between items-center gap-4 h-12">
              <div className="w-1/2 h-full">
                <Select
                  status={error.status && "error"}
                  defaultValue={valueEdit.status}
                  placeholder={"Goal Status"}
                  className="select !size-full"
                  options={statusOptions.map((option) => ({ value: option, label: toCapitalize(option) }))}
                  allowClear
                  onChange={(e) => setValueEdit((prev) => ({ ...prev, status: e }))}
                />
                {error.status && <p className="text-red-500 text-[12px] text-start">{error.status.toString()}</p>}
              </div>
              <div className="w-1/2 h-full">
                <div className="flex flex-col h-full">
                  <p className="text-theme-reverse-dark whitespace-nowrap text-[13px]">Goal Color Theme</p>
                  <ColorPicker
                    className="colorpicker"
                    styles={{ popup: { backgroundColor: "var(--theme)" } }}
                    showText
                    format="hex"
                    value={valueEdit.color}
                    onChangeComplete={(e) => setValueEdit((prev) => ({ ...prev, color: e.toHexString() }))}
                  />
                  {error.color && <p className="text-red-500 text-[12px] text-start">{error.color}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-theme-darker/30 border-gray rounded-[8px] p-4.5">
              <div>
                <h2 className="text-[14px] font-medium">Make Public</h2>
                <p className="text-gray text-[12px]">Allow others to see this goal</p>
              </div>
              <Switch
                style={{ backgroundColor: valueEdit.isPublic ? "var(--accent)" : "var(--theme-darker)" }}
                onChange={(e) => setValueEdit((prev) => ({ ...prev, isPublic: e.valueOf() }))}
                value={valueEdit.isPublic}
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

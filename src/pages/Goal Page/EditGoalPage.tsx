import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData, useNotification } from "@/contexts/UseContexts";
import callApi from "@/utils/callApi";
import { defaultGoalData } from "@/utils/defaultData";
import { errorAuthBool, handleFormError } from "@/utils/errorHandler";
import toCapitalize from "@/utils/toCapitalize";
import type { ErrorWithValues, GoalData } from "@/utils/types";
import validateForms from "@/utils/validateForms";
import { ColorPicker, DatePicker, Select, Switch } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const selectOptions = ["active", "completed", "paused", "pending", "canceled"];

type TValueEdit = Omit<GoalData, "targetDate"> & { targetDate: Date | string };

export const EditGoalPage = () => {
  const data: TValueEdit = JSON.parse(sessionStorage.getItem("goal-data") || JSON.stringify(defaultGoalData));
  const navigate = useNavigate();
  const { goalId } = useParams();
  const { setData, getData } = useGoalData();
  const { openNotification } = useNotification();

  const [valueEdit, setValueEdit] = useState<TValueEdit>(data);
  const [error, setError] = useState<ErrorWithValues>({ error: null });
  const [isSubmitting, setSubmitting] = useState(false);

  const errorAuth = errorAuthBool(error);

  useEffect(() => {
    if (data._id !== goalId || !data._id) navigate(-1);
  }, [goalId, data._id, navigate]);

  const handleSave = async () => {
    setSubmitting(true);
    setError({ error: null });
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
    try {
      const response = await callApi("/goal", { method: "PUT", token: true, body: { ...valueEdit, goalId } });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      sessionStorage.setItem("goal-data", JSON.stringify(response.data));
      if (response.data._id === goalId) setData(response.data);
      else if (goalId) getData(goalId, false);
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem("goal-data");
    navigate(-1);
  };

  return (
    <div className="pt-22 px-3 text-theme-reverse flex justify-center">
      {error.error && (
        <ErrorPopup
          title={error && error.error.title}
          message={error && error.error.message}
          showBackToDashboard={!errorAuth && error.error.code !== "ERR_NETWORK" && error.error.code !== "ERR_BAD_REQUEST"}
          showBackToLoginPage={!errorAuth}
        />
      )}
      <div className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-250 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] lg:text-[20px] font-semibold">Edit Goal</h1>
          <div className="flex gap-3">
            <ButtonV
              disabled={isSubmitting}
              onClick={handleBack}
              text="Cancel"
              className="text-[12px] !px-3 !py-2 lg:!px-4 lg:!py-2 lg:text-[14px] bg-theme-darker/20 border hover:bg-red-600 hover:border-red-500 border-gray !text-theme-reverse"
            />
            <ButtonV
              text="Save Changes"
              disabled={isSubmitting}
              onClick={handleSave}
              className="text-[12px] !px-3 !py-2 lg:!px-4 lg:!py-2 lg:text-[14px]"
            />
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
                  options={selectOptions.map((option) => ({ value: option, label: toCapitalize(option) }))}
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
      </div>
    </div>
  );
};

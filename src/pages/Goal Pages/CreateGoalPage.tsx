import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useNotification, useUserData } from "@/contexts/UseContexts";
import callApi from "@/utils/callApi";
import { defaultNewGoalData } from "@/utils/defaultData";
import { handleFormError } from "@/utils/errorHandler";
import type { TError, TNewGoalValue } from "@/utils/types";
import validateForms from "@/utils/validateForms";
import { ColorPicker, DatePicker, Switch } from "antd";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const CreateGoalPage = () => {
  const { openNotification } = useNotification();
  const { data, refetchData, setData } = useUserData();

  const [valueCreate, setValueCreate] = useState<TNewGoalValue>(defaultNewGoalData);
  const [error, setError] = useState<TNewGoalValue & TError>({ ...defaultNewGoalData, error: null, color: "" });
  const [isSubmitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user-id");

  useEffect(() => {
    const initial = async () => {
      if (!data || !data._id || !userId) {
        await refetchData(false);
        sessionStorage.setItem("user-id", data!._id);
      }
    };
    initial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleCreate = async () => {
    setSubmitting(true);
    setError({ ...defaultNewGoalData, error: null, color: "" });
    const validate = validateForms(valueCreate, setError, {
      title: true,
      description: true,
      targetDate: true,
      color: true,
      titleMaxChar: 100,
      descMaxChar: 1500,
    });
    if (validate) {
      setSubmitting(false);
      return;
    }

    try {
      const response = await callApi("/goal", { method: "POST", body: valueCreate });
      openNotification({ message: response.data.notification, button: "default", type: "success" });
      setValueCreate(response.data);
      if (data) setData((prev) => ({ ...prev!, goals: [response.data, ...prev!.goals] }));
      else refetchData();
      handleBack("/");
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
    sessionStorage.removeItem("user-id");
    if (typeof to === "string") navigate(to);
    else if (typeof to === "number") navigate(to);
  };

  return (
    <div className="px-3 text-theme-reverse flex justify-center items-center pb-10">
      {error.error && <ErrorPopup error={error} />}
      <div className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-200 shadow-lg mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] font-semibold">Create Goal</h1>
        </div>
        <div className="bg-gray h-[1px]" />
        <div className="mt-4 flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <Input
              error={error.title}
              onChange={(e) => setValueCreate((prev) => ({ ...prev, title: e.target.value }))}
              value={valueCreate.title}
              label="Goal Title"
              placeholder="Your goal title"
              TWBackgroundLabel="bg-theme-dark"
            />
            <TextArea
              error={error.description}
              onChange={(e) => setValueCreate((prev) => ({ ...prev, description: e.target.value }))}
              value={valueCreate.description}
              placeholder="Your goal description"
              label="Goal Description"
              TWBackgroundLabel="bg-theme-dark"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center h-13 gap-4">
              <div className="w-1/2 h-full">
                <DatePicker
                  placement="topLeft"
                  styles={{ root: { background: "transparent", color: "var(--theme-reverse)" } }}
                  classNames={{ popup: { root: "datepicker" } }}
                  needConfirm
                  status={error.targetDate && "error"}
                  size="small"
                  color="var(--theme)"
                  className="text-theme-reverse datepicker size-full"
                  placeholder="Choose target date of goal"
                  onChange={(e) =>
                    e ? setValueCreate((prev) => ({ ...prev, targetDate: e.format() })) : setValueCreate((prev) => ({ ...prev, targetDate: "" }))
                  }
                />
                {error.targetDate && <p className="text-red-500 text-[12px] text-start">{error.targetDate.toString()}</p>}
              </div>
              <div className="w-1/2 h-full flex flex-col">
                <p className="text-theme-reverse-dark whitespace-nowrap text-[13px]">Goal Color Theme</p>
                <ColorPicker
                  className="colorpicker"
                  styles={{ popup: { backgroundColor: "var(--theme)" } }}
                  showText
                  format="hex"
                  value={valueCreate.color}
                  onChangeComplete={(e) => setValueCreate((prev) => ({ ...prev, color: e.toHexString() }))}
                />
                {error.color && <p className="text-red-500 text-[12px] text-start">{error.color}</p>}
              </div>
            </div>
            <div className="flex justify-between items-center bg-theme-darker/30 border-gray rounded-[8px] p-4.5">
              <div>
                <h2 className="text-[14px] font-medium">Make Public</h2>
                <p className="text-gray text-[12px]">Allow others to see this goal</p>
              </div>
              <Switch
                style={{ backgroundColor: valueCreate.isPublic ? "var(--accent)" : "var(--theme-darker)" }}
                onChange={(e) => setValueCreate((prev) => ({ ...prev, isPublic: e.valueOf() }))}
                value={valueCreate.isPublic}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-10">
          <ButtonV
            disabled={isSubmitting}
            onClick={handleBack}
            text="Cancel"
            className="text-[12px] !px-3 !py-2 bg-theme-darker/20 border hover:!text-white hover:bg-red-600 hover:border-red-500 border-gray !text-theme-reverse"
          />
          <ButtonV
            text="Create Goal"
            icon={<CirclePlus size={14} />}
            disabled={isSubmitting}
            onClick={handleCreate}
            className="text-[12px] !px-3 !py-2"
          />
        </div>
      </div>
    </div>
  );
};

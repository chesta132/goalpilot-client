import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useNotification, useTheme, useUserData } from "@/contexts/UseContexts";
import useValidate from "@/hooks/useValidate";
import callApi from "@/utils/callApi";
import { decrypt, encrypt } from "@/utils/cryptoUtils";
import { defaultNewGoalData } from "@/utils/defaultData";
import { handleFormError } from "@/utils/errorHandler";
import { statusOptions } from "@/utils/selectOptions";
import { capitalEachWords } from "@/utils/stringManip";
import type { TError, TNewGoalValue } from "@/utils/types";
import { ColorPicker, DatePicker, Select, Switch } from "antd";
import clsx from "clsx";
import { CirclePlus } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

export const CreateGoalPage = () => {
  const [valueCreate, setValueCreate] = useState<TNewGoalValue>(defaultNewGoalData);
  const [error, setError] = useState<TNewGoalValue & TError>({ ...defaultNewGoalData, error: null, color: "" });
  const [isSubmitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const userId = decrypt(sessionStorage.getItem("user-id"));

  const { openNotification } = useNotification();
  const { data, refetchData, setData } = useUserData();
  const { handleChangeForm, validateForm } = useValidate(valueCreate, error, setValueCreate, setError);
  const { settings } = useTheme();

  useEffect(() => {
    const initial = async () => {
      if (!data || !data._id || !userId) {
        await refetchData(false);
        try {
          const encryptedData = encrypt(JSON.stringify(data!.id));
          sessionStorage.setItem("user-id", encryptedData);
        } catch (e) {
          console.error(e);
        }
      }
    };
    initial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError({ ...defaultNewGoalData, error: null, color: "" });
    const validate = validateForm({
      title: { max: 100 },
      description: { max: 1500 },
      targetDate: true,
      color: true,
      status: true,
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
      <form onSubmit={handleCreate} className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-200 shadow-lg mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] font-semibold">Create Goal</h1>
        </div>
        <div className="bg-gray h-[1px]" />
        <div className="mt-4 flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <Input
              error={error.title}
              onChange={(e) => handleChangeForm({ title: e.target.value }, { max: 100 })}
              value={valueCreate.title}
              label="Goal Title"
              placeholder="Your goal title"
              TWBackgroundLabel="bg-theme-dark"
            />
            <TextArea
              error={error.description}
              onChange={(e) => handleChangeForm({ description: e.target.value }, { max: 1500 })}
              value={valueCreate.description}
              placeholder="Your goal description"
              label="Goal Description"
              TWBackgroundLabel="bg-theme-dark"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className={clsx("flex flex-col h-13", error.targetDate && "h-16")}>
              <DatePicker
                id="targetDate"
                placement="topLeft"
                styles={{ root: { background: "transparent", color: "var(--theme-reverse)" } }}
                classNames={{ popup: { root: "datepicker" } }}
                needConfirm
                status={error.targetDate && "error"}
                size="small"
                color="var(--theme)"
                className="text-theme-reverse datepicker size-full"
                placeholder="Choose target date of goal"
                onChange={(e) => handleChangeForm(e ? { targetDate: e.format() } : { targetDate: "" })}
              />
              {error.targetDate && <p className="text-red-500 text-[12px] text-start">{error.targetDate.toString()}</p>}
            </div>
            <div className="flex items-center h-13 gap-4">
              <div className="w-1/2 h-full">
                <Select
                  defaultValue={settings.defaultGoalStatus || undefined}
                  placement="bottomLeft"
                  status={error.status && "error"}
                  placeholder={"Status"}
                  className="select !size-full"
                  options={statusOptions.slice(0, -2).map((option) => ({ value: option, label: capitalEachWords(option) }))}
                  allowClear
                  onChange={(e) => handleChangeForm<TNewGoalValue>(e ? { status: e } : { status: "" })}
                />
                {error.status && <p className="text-red-500 text-[12px] text-start">{error.status.toString()}</p>}
              </div>
              <div className="w-1/2 h-full flex flex-col">
                <p className="text-theme-reverse-dark whitespace-nowrap text-[13px]">Goal Color Theme</p>
                <ColorPicker
                  className="colorpicker"
                  styles={{ popup: { backgroundColor: "var(--theme)" } }}
                  showText
                  value={valueCreate.color}
                  onChangeComplete={(e) => handleChangeForm({ color: e.toHexString() })}
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
                id="isPublic"
                style={{ backgroundColor: valueCreate.isPublic ? "var(--accent)" : "var(--theme-darker)" }}
                onChange={(e) => handleChangeForm({ isPublic: e.valueOf() })}
                value={valueCreate.isPublic}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-10">
          <ButtonV
            type="button"
            disabled={isSubmitting}
            onClick={() => handleBack()}
            text="Cancel"
            className="text-[12px] !px-3 !py-2 bg-theme-darker/20 border hover:!text-white hover:bg-red-600 hover:border-red-500 border-gray !text-theme-reverse"
          />
          <ButtonV text="Create Goal" icon={<CirclePlus size={14} />} disabled={isSubmitting} className="text-[12px] !px-3 !py-2" />
        </div>
      </form>
    </div>
  );
};

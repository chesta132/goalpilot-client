import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import TextArea from "@/components/Inputs/TextArea";
import { DeletePopup } from "@/components/Popups/DeletePopup";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData, useNotification } from "@/contexts/UseContexts";
import useValidate from "@/hooks/useValidate";
import callApi from "@/utils/callApi";
import { decrypt, encrypt } from "@/utils/cryptoUtils";
import { defaultGoalData } from "@/utils/defaultData";
import { handleError, handleFormError } from "@/utils/errorHandler";
import { statusOptions } from "@/utils/selectOptions";
import { capitalEachWords } from "@/utils/stringManip";
import type { GoalData, TError } from "@/types/types";
import { ColorPicker, DatePicker, Select, Switch } from "antd";
import dayjs from "dayjs";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";

type TValueEdit = Omit<GoalData, "targetDate"> & { targetDate: Date | string };

export const EditGoalPage = () => {
  const defaultValue = decrypt(sessionStorage.getItem("goal-data"), { parse: true }) || JSON.stringify(defaultGoalData);
  const navigate = useNavigate();
  const { setData, getData, deleteGoal, data } = useGoalData();

  const [valueEdit, setValueEdit] = useState<TValueEdit>(data as TValueEdit);
  const [error, setError] = useState<TValueEdit & TError>({ ...defaultGoalData, error: null, targetDate: "", status: "" });
  const [isSubmitting, setSubmitting] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const { goalId } = useParams();
  const { openNotification } = useNotification();
  const { handleChangeForm, validateForm } = useValidate(valueEdit, error, setValueEdit, setError);

  useEffect(() => {
    setValueEdit(data as TValueEdit);
  }, [data]);
  const previewGoalData = sessionStorage.getItem("preview-goal-data");
  useEffect(() => {
    if (!previewGoalData && JSON.stringify(data) === JSON.stringify(defaultGoalData)) {
      const f = async () => {
        await getData(goalId);
        sessionStorage.setItem("goal-data", encrypt(data));
      };
      f();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId, data]);

  useEffect(() => {
    const goalData = decrypt(sessionStorage.getItem("goal-data"), { parse: true });
    if (goalData && !previewGoalData) setData(goalData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError({ ...defaultGoalData, error: null, targetDate: "", status: "" });
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
      const encryptedData = encrypt(response.data);
      sessionStorage.setItem("goal-data", encryptedData);
      if (response.data._id === goalId) setData(response.data);
      else if (goalId) getData(goalId, false);
      handleBack();
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = (to: string | number = "./..") => {
    sessionStorage.removeItem("goal-data");
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

  const handlePreview = () => {
    sessionStorage.setItem("preview-goal-data", encrypt(valueEdit));
    navigate("./../info");
  };

  return (
    <div className="px-3 text-theme-reverse flex justify-center items-center pb-10 relative">
      {error.error && <ErrorPopup error={error} />}
      {deletePopup && <DeletePopup deletes={handleDelete} item="goal" setClose={() => setDeletePopup(false)} />}
      <form onSubmit={handleSave} className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-250 shadow-lg mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-[18px] font-semibold">Edit Goal</h1>
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
              error={error.title}
              onChange={(e) => handleChangeForm({ title: e.target.value }, { max: 100 })}
              value={valueEdit.title}
              focus
              label="Goal Title"
              placeholder="Edit your goal title"
              TWBackgroundLabel="bg-theme-dark"
            />
            <TextArea
              error={error.description}
              onChange={(e) => handleChangeForm({ description: e.target.value }, { max: 1500 })}
              value={valueEdit.description}
              focus
              placeholder="Edit your goal description"
              label="Goal Description"
              TWBackgroundLabel="bg-theme-dark"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <DatePicker
                id="targetDate"
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
                onChange={(e) => handleChangeForm(e ? { targetDate: e.format() } : { targetDate: "" })}
              />
              {error.targetDate && <p className="text-red-500 text-[12px] text-start">{error.targetDate.toString()}</p>}
            </div>
            <div className="flex justify-between items-center gap-4 h-12">
              <div className="w-1/2 h-full">
                <Select
                  id="status"
                  status={error.status && "error"}
                  defaultValue={valueEdit.status}
                  placeholder={"Goal Status"}
                  className="select !size-full"
                  options={statusOptions.map((option) => ({ value: option, label: capitalEachWords(option) }))}
                  allowClear
                  onChange={(e) => handleChangeForm<TValueEdit>(e ? { status: e } : { status: "" })}
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
                    value={valueEdit.color}
                    onChangeComplete={(e) => handleChangeForm({ color: e.toHexString() })}
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
                id="isPublic"
                style={{ backgroundColor: valueEdit.isPublic ? "var(--accent)" : "var(--theme-darker)" }}
                onChange={(e) => handleChangeForm({ isPublic: e.valueOf() })}
                value={valueEdit.isPublic}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-3">
          <ButtonV
            type="button"
            icon={<Eye size={13} />}
            text="Preview Edit"
            onClick={handlePreview}
            className="text-[12px] !px-3 !py-2 bg-goal-accent hover:bg-goal-accent-strong border-none"
          />
          <ButtonV
            type="button"
            icon={<Trash2 size={13} />}
            text="Delete Goal"
            onClick={() => setDeletePopup(true)}
            className="text-[12px] !px-3 !py-2 text-white! bg-red-600 border hover:bg-red-700 border-none"
          />
        </div>
      </form>
    </div>
  );
};

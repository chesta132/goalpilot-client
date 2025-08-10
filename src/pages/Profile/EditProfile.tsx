import ButtonV from "@/components/Inputs/ButtonV";
import Input from "@/components/Inputs/Input";
import { useNotification, useUserData } from "@/contexts/UseContexts";
import useValidate from "@/hooks/useValidate";
import type { UserData, TError } from "@/types/types";
import callApi from "@/utils/callApi";
import { pick } from "@/utils/commonUtils";
import { decrypt, encrypt } from "@/utils/cryptoUtils";
import { handleError } from "@/utils/errorHandler";
import clsx from "clsx";
import { Edit, Eye } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

type TValueEdit = { fullName?: string; username?: string };

export const EditProfile = () => {
  const { data, loading, getProfileInitial, setData } = useUserData();
  const { openNotification } = useNotification();

  const defaultValue = { username: "", fullName: "" };
  const decr = decrypt(sessionStorage.getItem("preview-profile-edit"), { parse: true });
  const defaultError = { ...defaultValue, error: null };
  const dataFullUserName = data && pick(data, ["fullName", "username"]);

  const [valueEdit, setValueEdit] = useState<TValueEdit>(decr || dataFullUserName || defaultValue);
  const [error, setError] = useState<TValueEdit & TError>(defaultError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleChangeForm, validateForm } = useValidate(valueEdit, error, setValueEdit, setError);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && !decr) setValueEdit({ fullName: data.fullName, username: data.username });
  }, [data, decr]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const profileName = getProfileInitial(data?.fullName);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(defaultError);
    setIsSubmitting(true);
    const validate = validateForm({
      fullName: true,
      username: true,
    });
    if (validate) {
      setIsSubmitting(false);
      return;
    }

    if (data ? Object.compare(dataFullUserName!, valueEdit) : true) {
      openNotification({ message: "Items must have changes", type: "warning", button: "default" });
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
      return;
    }

    try {
      const response = await callApi<UserData & { notification: string }>("/user/edit", { method: "PUT", body: valueEdit });
      const { notification, username, fullName } = response.data;
      openNotification({ message: notification, button: "default", type: "success" });
      setData((prev) => prev && { ...prev, username, fullName });
      navigate("/profile");
    } catch (err) {
      handleError(err, setError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePreview = () => {
    sessionStorage.setItem("preview-profile-edit", encrypt(valueEdit));
    navigate("/profile");
  };

  const handleCancel = () => {
    sessionStorage.removeItem("preview-profile-edit");
    navigate("/profile");
  };

  return (
    <div>
      <div className="px-3 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
        <div className="flex justify-center items-center flex-col gap-3 text-center">
          <div
            className={clsx(
              "bg-[#66b2ff] text-white cursor-default rounded-full size-25 text-4xl font-semibold flex items-center justify-center relative",
              loading && "animate-shimmer"
            )}
          >
            {profileName && profileName.toUpperCase()}
            {data?.status === "online" && (
              <div className="size-2.5 bg-green-500 rounded-full absolute top-0 right-0 translate-y-1 -translate-x-1"></div>
            )}
          </div>
          <form onSubmit={handleSave} className="px-6 py-7 bg-theme-dark rounded-xl gap-4 flex flex-col w-full max-w-250 shadow-lg mx-auto mt-10">
            <div className="flex justify-between items-center">
              <h1 className="font-heading text-[18px] font-semibold">Edit User Profile</h1>
              <div className="flex gap-3">
                <ButtonV
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCancel}
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
                  labelClass="bg-theme-dark!"
                  error={error.username}
                  label="Username"
                  value={valueEdit.username}
                  placeholder="Your username"
                  onChange={(e) => handleChangeForm({ username: e.target.value })}
                />
                <Input
                  labelClass="bg-theme-dark!"
                  error={error.fullName}
                  label="Full name"
                  value={valueEdit.fullName}
                  placeholder="Your full name"
                  onChange={(e) => handleChangeForm({ fullName: e.target.value })}
                />
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

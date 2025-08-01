import ButtonV from "@/components/Inputs/ButtonV";
import { ReadMore } from "@/components/Inputs/ReadMore";
import { DeletePopup } from "@/components/Popups/DeletePopup";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData } from "@/contexts/UseContexts";
import { getBgByStatus, getTimeLeftToDisplay } from "@/utils/commonUtils";
import { decrypt } from "@/utils/cryptoUtils";
import { handleError } from "@/utils/errorHandler";
import { capitalWord } from "@/utils/stringManip";
import clsx from "clsx";
import { ArrowLeftIcon, Clock, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const InfoGoalPage = () => {
  const [deletePopup, setDeletePopup] = useState(false);

  const { data, setData, deleteGoal, error, setError, getData } = useGoalData();
  const { goalId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("goal-data")) setData(decrypt(sessionStorage.getItem("goal-data"), { parse: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTo = (to: "info" | "edit") => {
    navigate(`./../${to}`);
  };

  const previewData = decrypt(sessionStorage.getItem("preview-goal-data"), { parse: true });
  useEffect(() => {
    if (previewData) setData(previewData);
    else getData(goalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    try {
      await deleteGoal();
      navigate("/");
    } catch (err) {
      handleError(err, setError);
    }
  };

  const intervalMs = new Date(data.targetDate).getTime() - new Date().getTime();
  const timeLeft = Math.ceil(intervalMs / (1000 * 60 * 60 * 24));
  const timeLeftToDisplay = getTimeLeftToDisplay(timeLeft);

  const timelineInfoProps = [
    { title: "created date", date: data.createdAt },
    { title: "target date", date: data.targetDate },
    { title: "completed date", date: data?.completedAt },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-3 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
      {error.error && <ErrorPopup error={error} />}
      {deletePopup && <DeletePopup deletes={handleDelete} item="goal" setClose={() => setDeletePopup(false)} />}
      <div className="rounded-2xl bg-theme-dark overflow-hidden">
        <div className="px-6 py-7 bg-goal-accent/10 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="w-full text-[11px] gap-4 flex flex-col lg:justify-between lg:flex-row">
              <div className="flex flex-col gap-2">
                <ReadMore text={data.title} className="font-heading text-[19px] font-bold" />
                <div className="flex gap-2 items-center">
                  <p className={clsx("text-white rounded-full px-2 py-1 inline size-fit", getBgByStatus(data.status))}>{capitalWord(data.status)}</p>•
                  <p className="text-gray-500 text-[12px]">{data.isPublic ? "Public" : "Non-public"}</p>•
                  <div className="gap-2 flex items-center">
                    <p className="text-[12px] text-gray-500">Goal Color</p>
                    <div className="w-9 h-4 rounded-sm bg-goal-accent" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:flex-row">
                <ButtonV
                  onClick={() => handleTo("edit")}
                  text="Edit"
                  icon={<Edit2 size={14} />}
                  className="px-4! py-2! text-[12px] h-fit bg-goal-accent! hover:bg-goal-accent-strong!"
                />
                <ButtonV
                  onClick={() => setDeletePopup(true)}
                  type="button"
                  icon={<Trash2 size={13} />}
                  text="Delete"
                  className="text-[12px] !px-3 !py-2 text-white! bg-red-600 hover:bg-red-700 h-fit"
                />
                <ButtonV
                  onClick={() => navigate(-1)}
                  type="button"
                  icon={<ArrowLeftIcon size={13} />}
                  text="Back"
                  className="text-[12px] !px-3 !py-2 text-theme-reverse! border-goal-accent border hover:border-goal-accent-strong h-fit bg-transparent!"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1.5">
              <h2 className="font-heading font-medium">Progress</h2>
              <h2 className="font-heading text-goal-accent font-medium">{data.progress.toFixed(2)}%</h2>
            </div>
            <div className="rounded-full bg-theme-dark h-3">
              <div className="rounded-full h-full bg-goal-accent" style={{ width: `${data.progress}%` }} />
            </div>
            <div className="text-[13px] flex justify-between items-center">
              <p>
                {data.tasks.filter((task) => task.isCompleted).length} of {data.tasks.length} tasks completed
              </p>
              {data.status !== "completed" && (
                <p className={clsx(timeLeft > 7 && timeLeft <= 14 ? "text-yellow-500 font-medium" : timeLeft <= 7 && "text-red-600 font-medium")}>
                  {timeLeftToDisplay} overdue
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="overflow-auto">
            <h1 className="font-heading text-[17px] font-semibold mb-2">Description</h1>
            <p className="text-theme-reverse-darker text-[13px] leading-5.5">{data.description}</p>
          </div>
          <div className="rounded-xl flex flex-col gap-4 bg-theme-darker p-4">
            <div className="flex gap-2 items-center">
              <Clock size={15} className="text-accent" />
              <h1 className="text-[15px] font-semibold font-heading">Timeline Information</h1>
            </div>
            <div className="flex flex-col gap-2">
              {timelineInfoProps.map((info) =>
                info.title === "completed date" && !data.completedAt ? null : (
                  <div className="flex justify-between" key={info.title}>
                    <h2 className="text-[13px] text-theme-reverse-darker">{capitalWord(info.title)}</h2>
                    <h2 className="font-semibold text-[13px]">{info.date.toFormattedString()}</h2>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import ButtonV from "@/components/Inputs/ButtonV";
import { ReadMore } from "@/components/Inputs/ReadMore";
import { DeletePopup } from "@/components/Popups/DeletePopup";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useGoalData, useTaskData } from "@/contexts/UseContexts";
import { getTimeLeftToDisplay } from "@/utils/commonUtils";
import { decrypt } from "@/utils/cryptoUtils";
import { handleError } from "@/utils/errorHandler";
import { capitalWord } from "@/utils/stringManip";
import clsx from "clsx";
import { ArrowLeftIcon, Clock, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const InfoTaskPage = () => {
  const [deletePopup, setDeletePopup] = useState(false);

  const { data, setData, deleteTask, error, setError } = useTaskData();
  const { data: goalData } = useGoalData();

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("task-data")) setData(decrypt(sessionStorage.getItem("task-data"), { parse: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTo = (to: "info" | "edit") => {
    navigate(`./../${to}`);
  };

  useEffect(() => {
    const previewData = decrypt(sessionStorage.getItem("preview-task-data"), { parse: true });
    if (previewData) {
      setData(previewData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    try {
      await deleteTask();
      navigate("/");
    } catch (err) {
      handleError(err, setError);
    }
  };

  const intervalMs = new Date(data.targetDate!).getTime() - new Date().getTime();
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
      {deletePopup && <DeletePopup deletes={handleDelete} item="task" setClose={() => setDeletePopup(false)} />}
      <div className="rounded-2xl bg-theme-dark overflow-hidden">
        <div className="p-6 bg-goal-accent/10 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="w-full text-[11px] gap-4 flex flex-col lg:justify-between lg:flex-row">
              <div className="flex flex-col gap-2">
                <ReadMore text={data.task} className="font-heading text-[19px] font-bold" />
                <div className="flex gap-2 items-center">
                  <p
                    className={clsx(
                      "rounded-full px-2 py-1 inline size-fit",
                      data.isCompleted ? "text-green-500 bg-green-600/20" : "text-red-500 bg-red-600/20"
                    )}
                  >
                    {data.isCompleted ? "Completed" : "Incomplete"}
                  </p>
                  •<p className="text-gray-500 text-[12px]">{capitalWord(data.difficulty)} difficulty</p>•
                  <div className="gap-2 flex items-center">
                    <p className="text-[12px] text-gray-500">Task of {goalData.title}</p>
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
          <div className="text-[13px] flex justify-between items-center">
            {!data.isCompleted && (
              <p className={clsx(timeLeft > 3 && timeLeft <= 7 ? "text-yellow-500 font-medium" : timeLeft <= 3 && "text-red-600 font-medium")}>
                {timeLeftToDisplay} overdue
              </p>
            )}
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
                    <h2 className="font-semibold text-[13px]">{new Date(info.date!).toFormattedString()}</h2>
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

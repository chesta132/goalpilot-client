import useScrollNavigation from "@/hooks/useScrollNavigation";
import { capitalEachWords } from "@/utils/stringManip";
import clsx from "clsx";
import { Book, Calendar, Edit, Goal, Info } from "lucide-react";
import StatsCard from "../Cards/StatsCard";
import { useGoalData, useTaskData } from "@/contexts/UseContexts";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getTimeLeftToDisplay } from "@/utils/commonUtils";
import { GoalCardCompact } from "../Cards/GoalCardCompact";
import { useViewportWidth } from "@/hooks/useViewport";
import { ReadMore } from "../Inputs/ReadMore";

export const SidebarTask = ({ withEdit = true }) => {
  const { data } = useTaskData();
  const { timelineStatus } = useScrollNavigation();
  const { description, task } = data;
  const { data: goalData, getData: getGoalData } = useGoalData();

  const navigate = useNavigate();
  const {createdAt, completedAt} = data
  const targetDate = new Date(data.targetDate);
  const width = useViewportWidth();

  const handleTo = (path: "edit" | "info") => {
    navigate(`/task/${data._id}/${path}`);
  };

  useEffect(() => {
    if (goalData.id !== data.goalId) {
      getGoalData(data.goalId, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.goalId, goalData]);

  const date = targetDate
    ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
  const intervalMs = date.getTime() - new Date().getTime();
  const timeLeft = Math.ceil(intervalMs / (1000 * 60 * 60 * 24));

  const timeLeftToDisplay = getTimeLeftToDisplay(timeLeft);

  if (width < 1024) return;

  return (
    <div
      className={clsx(
        "bg-theme-dark rounded-2xl px-6 py-7 mx-3 md:mx-6 lg:mx-0 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-[padding] duration-600 ease-in-out relative",
        timelineStatus && "lg:!pt-8"
      )}
    >
      <div className="flex justify-between">
        <div className="flex gap-2 flex-col w-full">
          <ReadMore text={capitalEachWords(task)} className="text-[20px] font-[600] font-heading max-w-[85%]" />
          {data.isCompleted ? (
            <h1 className="text-green-500 bg-green-500/10 font-heading size-fit rounded-2xl px-2 py-1 flex gap-3 text-[13px]">Completed</h1>
          ) : (
            <h1
              className={clsx(
                "font-heading size-fit rounded-2xl px-2 py-1 flex gap-3 text-[14px]",
                timeLeft > 3 && timeLeft <= 7
                  ? "text-yellow-500 bg-yellow-500/10 font-medium"
                  : timeLeft <= 3 && "text-red-600 bg-red-600/10 font-medium"
              )}
            >
              {timeLeftToDisplay}
            </h1>
          )}
        </div>
        <div className="mx-2 absolute right-0 mr-5">
          {withEdit ? (
            <div className="!cursor-pointer" onClick={() => handleTo("edit")}>
              <Edit size={19.5} />
            </div>
          ) : (
            <div className="cursor-pointer!" onClick={() => handleTo("info")}>
              <Info size={19.5} />
            </div>
          )}
        </div>
      </div>
      <StatsCard
        header="Description"
        className="!bg-theme max-h-100"
        classStats="text-[15px] font-medium mt-2"
        icon={<Book className="h-8 w-8 p-1 object-contain rounded-md bg-accent" />}
        stats={<ReadMore text={description} />}
      />
      <StatsCard
        header={completedAt ? "Completed At" : "Target Date"}
        classStats="text-[15px] font-medium mt-2"
        icon={
          <Calendar
            className={clsx(
              "h-8 w-8 object-contain rounded-md p-1.5 bg-white/10",
              timeLeft > 3 && timeLeft <= 7
                ? "text-yellow-500 bg-yellow-500/10 font-medium"
                : timeLeft <= 3 && "text-red-600 bg-red-600/10 font-medium",
              data.isCompleted && "bg-green-500/10! text-green-500!"
            )}
          />
        }
        stats={
          completedAt
            ? new Date(completedAt.getFullYear(), completedAt.getMonth(), completedAt.getDate()).toDateString()
            : new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).toDateString()
        }
      />
      <StatsCard header="Goal" icon={<Goal className="h-8 w-8 p-1 object-contain rounded-md" style={{ background: goalData.color }} />} stats="">
        <div className="cursor-pointer" onClick={() => navigate(`/goal/${goalData.id}`)}>
          <GoalCardCompact data={goalData} />
        </div>
      </StatsCard>
    </div>
  );
};

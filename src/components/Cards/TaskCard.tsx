import toCapitalize from "@/utils/toCapitalize";
import type { GoalData, TaskData } from "@/utils/types";
import ButtonV from "../Inputs/ButtonV";
import clsx from "clsx";

type TaskProps = {
  task: TaskData;
  goal: GoalData;
};

const TaskCard = ({ task, goal }: TaskProps) => {
  const createdAt = new Date(task.createdAt);
  const targetDate = task.targetDate ? new Date(task.targetDate) : null;

  const date = targetDate
    ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());

  const intervalMs = date.getTime() - new Date().getTime();
  const timeLeft = Math.ceil(intervalMs / (1000 * 60 * 60 * 24));

  const dateToDisplay = timeLeft > 0 ? `${timeLeft} days left` : timeLeft < 0 ? `${Math.abs(timeLeft)} days ago` : "Today";

  return (
    <div className="border rounded-xl p-6.5 shadow-md bg-theme border-theme-darker gap-5 flex flex-col">
      <div className="relative flex flex-col gap-3">
        <h1 className="font-heading font-semibold text-[18px]">{toCapitalize(task.task)}</h1>
        <div className="flex gap-3">
          <p style={{ color: goal.color }} className="bg-theme-darker/60 rounded-full text-[12px] px-2 py-1 inline">
            {task.isCompleted ? "Completed" : "Incomplete"}
          </p>
          <p className="text-[14px] text-gray">{date.toDateString()}</p>
          {!task.isCompleted && (
            <p className={clsx("text-[14px] text-gray", timeLeft > 3 ? "text-yellow-500 font-medium" : timeLeft <= 0 && "text-red-600 font-medium")}>
              {dateToDisplay}
            </p>
          )}
        </div>
        <p className="text-[15px] text-theme-reverse-darker">{task.description}</p>
      </div>
      {!task.isCompleted && (
        <div className="flex justify-end gap-4">
          <ButtonV text="Delete Task" className="h-10 w-fit !px-6 text-[13px] bg-theme !text-theme-reverse border-red-800 border hover:bg-red-700 hover:!text-white" />
          <ButtonV text="Mark Complete" className="h-10 w-fit !px-6 text-[13px]" />
        </div>
      )}
    </div>
  );
};

export default TaskCard;

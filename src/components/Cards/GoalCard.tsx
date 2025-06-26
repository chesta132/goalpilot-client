import toCapitalize from "@/utils/toCapitalize";
import type { GoalData } from "@/utils/types";

type GoalProps = {
  goal: GoalData;
};

const GoalCard = ({ goal }: GoalProps) => {
  return (
    <div className="border rounded-lg p-6.5 shadow-md bg-theme border-theme-darker gap-5 flex flex-col">
      <div className="relative flex flex-col gap-3">
        <h1 className="font-heading font-semibold text-[18px]">{toCapitalize(goal.title)}</h1>
        <div className="flex gap-3 items-center">
          <p style={{ color: goal.color }} className="bg-theme-darker/60 rounded-full text-[12px] px-2 py-1 inline">
            {goal.status}
          </p>
          <p className="text-[14px] text-gray">•</p>
          <p className="text-[14px] text-gray">{goal.progress}% Complete</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="text-[14px] font-medium">Progress</h2>
          <h2 className="text-[14px] font-semibold" style={{ color: goal.color }}>
            {goal.progress}%
          </h2>
        </div>
        <div className="rounded-full bg-theme-dark h-3">
          <div className="rounded-full h-full" style={{ width: `${goal.progress}%`, background: goal.color }} />
        </div>
      </div>
    </div>
  );
};

export default GoalCard;

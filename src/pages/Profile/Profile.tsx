import { GoalCardCompact } from "@/components/Cards/GoalCardCompact";
import { useUserData } from "@/contexts/UseContexts";
import type { UserData } from "@/types/types";
import { getTimeLeftToDisplay } from "@/utils/commonUtils";
import { capitalEachWords } from "@/utils/stringManip";
import clsx from "clsx";

type ProfileProps = {
  userData?: UserData;
};

const StatsCard = ({ label, value, loading }: { label: string; value: any; loading: boolean }) => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center gap-1.5 py-5.5 bg-theme-dark rounded-xl w-full shadow-md",
        loading && "animate-shimmer"
      )}
    >
      <h2 className={clsx("text-2xl font-semibold text-accent", loading && "text-transparent!")}>{value}</h2>
      <p className={clsx("text-[12px] md:text-[13px] text-gray", loading && "text-transparent!")}>{label}</p>
    </div>
  );
};

export const Profile = ({ userData }: ProfileProps) => {
  const { data: contextData, loading } = useUserData();
  const data = userData || contextData;
  const splittedFullName = data && data.fullName.split(" ");
  const profileName = splittedFullName && splittedFullName[0][0] + splittedFullName[1][0];
  const stats = [{ "completed goals": data?.goalsCompleted }, { "completed tasks": data?.tasksCompleted }];

  const lastActiveDate = new Date(data?.lastActive || "Invalid Date").toFormattedString({ includeThisYear: true });
  const intervalMs = data?.lastActive && data?.lastActive.getTime() - new Date().getTime();
  const timeLeft = intervalMs && Math.ceil(intervalMs / (1000 * 60 * 60 * 24));
  const lastActive =
    data?.lastActive && timeLeft && data.lastActive > new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      ? lastActiveDate
      : getTimeLeftToDisplay(timeLeft!);

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
          <div className="cursor-default">
            <h1 className="text-2xl font-heading font-semibold">{data && capitalEachWords(data.fullName)}</h1>
            <h2 className="flex gap-2 justify-center items-center">
              {data && "@" + data.username}
              {data && data.role !== "user" && (
                <h3
                  className={clsx(
                    "text-[12px] inline px-3 py-1 rounded-full",
                    data.role === "admin" && "bg-green-400/20 text-green-500",
                    data.role === "moderator" && "bg-yellow-400/20 text-yellow-500"
                  )}
                >
                  {capitalEachWords(data.role)}
                </h3>
              )}
            </h2>
            {data?.status === "offline" && <h3 className="text-[12px] text-gray">Last Active: {lastActive}</h3>}
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          {stats.map((stat) => {
            const label = Object.keys(stat)[0];
            const value = Object.values(stat)[0];
            return <StatsCard key={label} label={capitalEachWords(label)} value={value?.toString()} loading={loading} />;
          })}
        </div>
        <div className="flex flex-col px-5 pb-15 py-7 bg-theme-darker rounded-lg shadow-md">
          <h1 className="font-heading text-[20px] font-semibold mb-4">Goals</h1>
          {data?.goals && (
            <div className="flex flex-col gap-1.5 px-1">
              {data.goals.map((goal) => (
                <GoalCardCompact key={goal.id} data={goal} className="cursor-pointer! bg-theme-dark" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

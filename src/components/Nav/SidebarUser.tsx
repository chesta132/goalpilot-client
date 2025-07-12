import { ChartLineIcon, Goal, Plus, Verified } from "lucide-react";
import ButtonV from "../Inputs/ButtonV";
import { useTheme, useUserData } from "@/contexts/UseContexts";
import useScrollNavigation from "@/hooks/useScrollNavigation";
import clsx from "clsx";
import StatsCard from "../Cards/StatsCard";
import { useViewportWidth } from "@/hooks/useViewport";
import { avgCalc } from "@/utils/math";
import { useNavigate } from "react-router";
import { encrypt } from "@/utils/cryptoUtils";
import { GoalCardCompact } from "../Cards/GoalCardCompact";

export const SidebarUser = () => {
  const { timelineStatus } = useScrollNavigation();
  const { data, loading } = useUserData();
  const { settings } = useTheme();

  const width = useViewportWidth();
  const navigate = useNavigate();

  const handleCreateGoal = () => {
    if (data) {
      const encryptedData = encrypt(JSON.stringify(data.id));
      sessionStorage.setItem("user-id", encryptedData);
    }
    navigate("/goal/create");
  };

  return (
    <div
      className={clsx(
        "bg-theme-dark rounded-2xl px-4 py-8 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-[padding] duration-600 ease-in-out relative mx-3 md:mx-6 lg:mx-0",
        timelineStatus && "lg:!pt-8"
      )}
    >
      <h1 className="text-[20px] font-[600] font-heading mb-2">Quick Stats</h1>
      <StatsCard
        loading={loading}
        header="Total Goals"
        className="!bg-theme"
        icon={<Goal className={clsx("h-8 bg-accent w-8 p-1 object-contain rounded-md", loading && "hidden")} />}
        stats={data?.goals && data?.goals.length.toString()}
      />
      <StatsCard
        loading={loading}
        header="Avg Progress"
        icon={<ChartLineIcon className={clsx("h-8 bg-[#10B981] w-8 object-contain rounded-md p-1.5", loading && "hidden")} />}
        stats={`${data?.goals && avgCalc(data?.goals.map((goal) => goal.progress)).toFixed(2)}%`}
      />
      <StatsCard
        loading={loading}
        header="Completed Goals"
        icon={
          <Verified className={clsx("h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1 fill-theme-reverse stroke-[#F59E0B]", loading && "hidden")} />
        }
        stats={data?.goals && data?.goals.filter((goal) => goal.progress === 100).length.toString()}
      />
      {settings.showGoalsShortcut && width > 1024 && (
        <div className="flex flex-col gap-1.5 overflow-auto h-80 px-1">
          {data?.goals.map((goal) => (
            <GoalCardCompact key={goal.id} data={goal} className="cursor-pointer" />
          ))}
        </div>
      )}
      {width < 1024 && (
        <div className="mt-10 w-full">
          <ButtonV
            text="Create New Goal"
            icon={<Plus className="bg-transparent" />}
            className="shadow-sm whitespace-nowrap w-full"
            onClick={handleCreateGoal}
          />
        </div>
      )}
    </div>
  );
};

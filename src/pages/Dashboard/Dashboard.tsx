import { useEffect, useState } from "react";
import { Link } from "react-router";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { errorAuthBool } from "@/utils/errorHandler";
import { avgCalc } from "@/utils/math";
import { ChartLineIcon, Goal, Plus, Verified } from "lucide-react";
import ButtonV from "@/components/Inputs/ButtonV";
import useScrollNavigation from "@/hooks/useScrollNavigation";
import clsx from "clsx";
import AddGoalPopup from "@/components/Popups/AddGoalPopup";
import GoalCard from "@/components/Cards/GoalCard";
import StatsCard from "@/components/Cards/StatsCard";
import { ColorPicker, Empty } from "antd";
import { useUserData, useTheme } from "@/contexts/UseContexts";
import { useViewportWidth } from "@/hooks/useViewport";

const Dashboard = () => {
  const [goalPopup, setGoalPopup] = useState(false);
  const [newGoalSubmitting, setNewGoalSubmitting] = useState(false);

  const { data, loading, error } = useUserData();
  const { timelineStatus } = useScrollNavigation();
  const { updateSettings } = useTheme();

  const width = useViewportWidth();
  const errorAuth = errorAuthBool(error);

  useEffect(() => {
    if (goalPopup) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [goalPopup]);

  const existingGoals = data?.goals?.filter((goal) => !goal.isRecycled) || [];

  return (
    <div>
      {/* Header/absolute */}
      {goalPopup && <AddGoalPopup setAppear={setGoalPopup} submitting={newGoalSubmitting} setSubmitting={setNewGoalSubmitting} />}
      {error.error && (
        <ErrorPopup
          title={error && error.error.title}
          message={error && error.error.message}
          showBackToDashboard={!errorAuth && error.error.code !== "ERR_NETWORK"}
          showBackToLoginPage={!errorAuth}
        />
      )}

      {/* Dashboard */}
      <div className={clsx("lg:pl-[25%] pt-22 px-3 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10")}>
        <div
          className={clsx(
            "bg-theme-dark rounded-lg px-4 py-8 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-[padding] duration-600 ease-in-out relative",
            timelineStatus && "lg:!pt-8"
          )}
        >
          <ColorPicker className="colorpicker" onChangeComplete={(e) => updateSettings({ accent: e.toCssString() })} />
          <div className="flex">
            <div className="size-50 bg-accent-soft" />
            <div className="size-50 bg-accent" />
            <div className="size-50 bg-accent-strong" />
          </div>
          <h1 className="text-[20px] font-[600] font-heading mb-2">Quick Stats</h1>
          <StatsCard
            loading={loading}
            header="Total Goals"
            className="!bg-theme"
            icon={<Goal className={clsx("h-8 bg-accent w-8 p-1 object-contain rounded-md", loading && "hidden")} />}
            stats={existingGoals && existingGoals.length.toString()}
          />
          <StatsCard
            loading={loading}
            header="Avg Progress"
            icon={<ChartLineIcon className={clsx("h-8 bg-[#10B981] w-8 object-contain rounded-md p-1.5", loading && "hidden")} />}
            stats={`${existingGoals && avgCalc(existingGoals.map((goal) => goal.progress)).toFixed(2)}%`}
          />
          <StatsCard
            loading={loading}
            header="Completed Goals"
            icon={
              <Verified
                className={clsx("h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1 fill-theme-reverse stroke-[#F59E0B]", loading && "hidden")}
              />
            }
            stats={existingGoals && existingGoals.filter((goal) => goal.progress === 100).length.toString()}
          />
          {width < 1024 && (
            <div className="mt-10 w-full">
              <ButtonV
                text="Create New Goal"
                icon={<Plus className="bg-transparent" />}
                className="shadow-sm whitespace-nowrap w-full"
                onClick={() => !loading && setGoalPopup(true)}
              />
            </div>
          )}
        </div>
        <div className="bg-theme-dark rounded-lg px-3 lg:px-4 py-8 text-theme-reverse shadow-md flex flex-col gap-10">
          <div className="flex flex-col gap-4 relative px-1 lg:px-0">
            <h1 className="text-2xl font-bold font-heading">My Goals</h1>
            <h2 className="font-medium">
              Hi, {data?.fullName.split(" ")[0]}! Ready to {data && data?.goals.length > 0 ? "crush" : "create"} your goals today?
            </h2>
            <div className={clsx("absolute top-0 right-0 bg-theme-darker rounded-full px-3 py-1.5", loading && "animate-shimmer")}>
              <p className={clsx("text-gray text-[14px]", loading && "text-transparent cursor-default")}>{data?.goals.length} goals</p>
            </div>
          </div>
          {width >= 1024 && (
            <div className="mx-5 mb-4">
              <ButtonV
                text="Create New Goal"
                icon={<Plus className="bg-transparent" />}
                className="shadow-sm whitespace-nowrap w-full"
                onClick={() => !loading && setGoalPopup(true)}
              />
            </div>
          )}
          <div className="flex flex-col gap-6">
            {data && data?.goals.length > 0 ? (
              data?.goals.map((goal) => (
                <Link to={`/goal/${goal._id}`} key={goal._id} onClickCapture={() => window.scrollTo(0, 0)}>
                  <GoalCard goal={goal} />
                </Link>
              ))
            ) : (
              <Empty className="flex flex-col justify-center">
                <p className="text-gray">No Goal Found</p>
                <div className="relative h-12">
                  <ButtonV
                    text="Create New Goal"
                    className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap h-7 shadow-sm"
                    onClick={() => setGoalPopup(true)}
                  />
                </div>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

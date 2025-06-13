import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Nav from "@/components/Nav/Nav";
import callApi from "@/utils/callApi";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import Loading from "@/components/Static UI/Loading";
import { handleFormError } from "@/utils/errorHandler";
import { avgCalc } from "@/utils/math";
import { ChartLineIcon, Goal, Plus, Verified } from "lucide-react";
import ButtonV from "@/components/Inputs/ButtonV";
import useScrollNavigation from "@/hooks/useScrollNavigation";
import clsx from "clsx";
import AddGoalPopup from "@/components/Popups/AddGoalPopup";
import type { TnewGoalValue } from "@/utils/types";
import GoalCard from "@/components/Cards/GoalCard";
import StatsCard from "@/components/Cards/StatsCard";
import { ColorPicker, Empty } from "antd";
import { useUserData, useNotification, useTheme } from "@/contexts/UseContexts";

const Dashboard = () => {
  const { data, refetchData, loading, error, setError } = useUserData();
  const [goalPopup, setGoalPopup] = useState(false);
  const { navRef, timelineStatus } = useScrollNavigation();
  const [newGoalSubmitting, setNewGoalSubmitting] = useState(false);
  const { openNotification } = useNotification();
  const [newGoalValue, setNewGoalValue] = useState<TnewGoalValue>({
    title: "",
    description: "",
    targetDate: "",
    color: "#66b2ff",
    isPublic: true,
  });
  const { updateSettings } = useTheme();

  const navigate = useNavigate();
  const params = useParams();

  const errorAuth = ["TOKEN_EXPIRED", "USER_NOT_FOUND", "INVALID_AUTH"].includes(error?.error?.code ?? "");

  // Handle back to login page (used for error popup)
  const handleBackToLoginPage = () => {
    sessionStorage.removeItem("jwt-token");
    localStorage.removeItem("jwt-token");
    navigate("/signin");
  };

  // Handle create new goal
  const handleNewGoal = async () => {
    setError({ error: null });
    try {
      const response = await callApi("/goal", { method: "POST", token: true, body: newGoalValue });
      await refetchData(false);
      setGoalPopup(false);
      setNewGoalValue({ title: "", description: "", targetDate: "", color: "#66b2ff", isPublic: true });
      openNotification({ message: response.data.notification, type: "success", button: "default" });
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setNewGoalSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  console.log(error);

  const existingGoals = data?.goals?.filter((goal) => !goal.isRecycled) || [];

  return (
    <div>
      {/* Header/absolute */}
      <AddGoalPopup
        appear={goalPopup}
        setAppear={setGoalPopup}
        value={newGoalValue}
        setValue={setNewGoalValue}
        handleSubmit={handleNewGoal}
        submitting={newGoalSubmitting}
        setSubmitting={setNewGoalSubmitting}
      />
      <Nav data={data} param={params.goalId} scrollNav={{ navRef, timelineStatus }} />
      {error.error && (
        <ErrorPopup
          title={error && error.error.title}
          message={error && error.error.message}
          showBackToDashboard={!errorAuth && error.error.code !== "ERR_NETWORK"}
          showBackToLoginPage={errorAuth}
          onBackToLoginPage={handleBackToLoginPage}
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
          <ColorPicker onChangeComplete={(e) => updateSettings({ accent: e.toCssString() })} />
          <div className="flex">
            <div className="size-50 bg-accent-soft" />
            <div className="size-50 bg-accent" />
            <div className="size-50 bg-accent-strong" />
          </div>
          <h1 className="text-[20px] font-[600] font-heading mb-2">Quick Stats</h1>
          <StatsCard
            header="Total Goals"
            className="!bg-theme"
            icon={<Goal className="h-8 bg-accent w-8 p-1 object-contain rounded-md " />}
            stats={existingGoals && existingGoals.length.toString()}
          />
          <StatsCard
            header="Avg Progress"
            icon={<ChartLineIcon className="h-8 bg-[#10B981] w-8 object-contain rounded-md p-1.5" />}
            stats={`${existingGoals && avgCalc(existingGoals.map((goal) => goal.progress)).toFixed(2)}%`}
          />
          <StatsCard
            header="Completed Goals"
            icon={<Verified className="h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1 fill-theme-reverse stroke-[#F59E0B]" />}
            stats={existingGoals && existingGoals.filter((goal) => goal.progress === 100).length.toString()}
          />
          <div className="mt-10 w-full">
            <ButtonV
              text="Create New Goal"
              icon={<Plus className="bg-transparent lg:hidden" />}
              className="shadow-sm whitespace-nowrap w-full"
              onClick={() => setGoalPopup(true)}
            />
          </div>
        </div>
        <div className="bg-theme-dark rounded-lg px-3 lg:px-4 py-8 text-theme-reverse shadow-md flex flex-col gap-10">
          <div className="flex flex-col gap-4 relative px-1 lg:px-0">
            <h1 className="text-2xl font-bold font-heading">My Goals</h1>
            <h2 className="font-medium">
              Hi, {data?.fullName.split(" ")[0]}! Ready to {data && data?.goals.length > 0 ? "crush" : "create"} your goals today?
            </h2>
            <div className="absolute top-0 right-0 bg-theme-darker rounded-full px-3 py-1.5">
              <p className="text-gray text-[14px]">{data?.goals.length} goals</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {data && data?.goals.length > 0 ? (
              data?.goals.map((goal) => (
                <Link to={`/goal/${goal._id}`} key={goal._id}>
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

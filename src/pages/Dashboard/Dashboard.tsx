import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Nav from "@/components/Nav/Nav";
import callApi from "@/utils/callApi";
import ErrorPopup from "@/components/ErrorPopUp";
import type { UserData } from "@/utils/types";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/errorHandler";
import { avgCalc } from "@/utils/math";
import { ChartLineIcon, Goal, Plus, Verified } from "lucide-react";
import Button from "@/components/Button";
import useScrollNavigation from "@/hooks/useScrollNavigation";
import clsx from "clsx";
import AddGoalPopup from "@/components/Add Goal Popup/AddGoalPopup";
import type { TnewGoalValue, Error } from "@/utils/types";
import toCapitalize from "@/utils/toCapitalize";

const Dashboard = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [goalPopup, setGoalPopup] = useState(false);
  const { navRef, timelineStatus } = useScrollNavigation();
  const [newGoalValue, setNewGoalValue] = useState<TnewGoalValue>({
    title: "",
    description: "",
    targetDate: "",
    color: "#66b2ff",
    isPublic: true,
  });
  const [newGoalSubmitting, setNewGoalSubmitting] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const getData = async (direct: boolean = false) => {
    setError(null);
    const response = await callApi("/user", { method: "PATCH", token: true, directToken: direct });
    return response;
  };

  useEffect(() => {
    // Fetch data for the dashboard
    const initiateData = async () => {
      setLoading(true);
      try {
        const response = await getData(true);
        setData(response.data);
      } catch (error) {
        errorHandler(error, setError);
      } finally {
        setLoading(false);
      }
    };

    initiateData();
  }, [navigate]);

  const errorAuth =
    (error && error.error && error?.error.code === "TOKEN_EXPIRED") ||
    (error && error.error && error?.error.code === "USER_NOT_FOUND") ||
    (error && error.error && error?.error.code === "INVALID_AUTH");

  const handleBackToLoginPage = () => {
    sessionStorage.removeItem("jwt-token");
    localStorage.removeItem("jwt-token");
    navigate("/signin");
  };

  useEffect(() => {
    // Heartbeat to keep the session alive
    const interval = setInterval(() => {
      callApi("/user/heartbeat", { method: "PATCH", token: true });
    }, 50000); // 50 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNewGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await callApi("/goal", { method: "POST", token: true, body: newGoalValue });
      const response = await getData(false);
      setData(response.data);
      setGoalPopup(false);
      setNewGoalValue({ title: "", description: "", targetDate: "", color: "#66b2ff", isPublic: true });
    } catch (err) {
      errorHandler(err, setError);
    } finally {
      setNewGoalSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  const existingGoals = data?.goals.filter((goal) => !goal.isRecycled);

  return (
    <div>
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
      {error && (
        <ErrorPopup
          title={error && error.error ? error.error.title : undefined}
          message={error && error.error ? error.error.message : undefined}
          showBackToDashboard={!errorAuth}
          showBackToLoginPage={errorAuth !== null && errorAuth}
          onBackToLoginPage={handleBackToLoginPage}
        />
      )}
      <div className={clsx("lg:pl-[25%] pt-22 px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10")}>
        <div
          className={clsx(
            "bg-theme-dark p-4 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-all duration-600 ease-in-out relative",
            timelineStatus && "lg:!pt-8"
          )}
        >
          <h1 className="text-[18px] font-[600] font-heading mb-2">Quick Stats</h1>
          <div className="w-full flex items-center justify-between p-4 bg-theme rounded-md shadow-sm">
            <div>
              <p className="text-gray text-[14px]">Total Goals</p>
              <h2 className="font-heading text-2xl font-bold">{existingGoals && existingGoals.length}</h2>
            </div>
            <Goal className="h-8 bg-accent w-8 p-1 object-contain rounded-md" />
          </div>
          <div className="w-full flex items-center justify-between p-4 bg-theme-darker rounded-md shadow-sm">
            <div>
              <p className="text-gray text-[14px]">Avg Progress</p>
              <h2 className="font-heading text-2xl font-bold">{existingGoals && avgCalc(existingGoals.map((goal) => goal.progress)).toFixed(2)}%</h2>
            </div>
            <ChartLineIcon className="h-8 bg-[#10B981] w-8 object-contain rounded-md p-1.5" />
          </div>
          <div className="w-full flex items-center justify-between p-4 bg-theme-darker rounded-md shadow-sm">
            <div>
              <p className="text-gray text-[14px]">Completed Goals</p>
              <h2 className="font-heading text-2xl font-bold">{existingGoals && existingGoals.filter((goal) => goal.progress === 100).length}</h2>
            </div>
            <Verified className="h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1.5 fill-black stroke-[#F59E0B]" />
          </div>
          <Button
            text="Create New Goal"
            icon={<Plus className="bg-transparent" />}
            className="mt-4 shadow-sm lg:absolute lg:bottom-5"
            onClick={() => setGoalPopup(true)}
          />
        </div>
        <div className="bg-theme-dark rounded-lg p-4 text-theme-reverse shadow-md flex flex-col gap-10">
          <div className="flex flex-col gap-4 relative">
            <h1 className="text-2xl font-bold font-heading">My Goals</h1>
            <h2 className="font-medium">Hi, {data?.fullName.split(" ")[0]}! Ready to crush your goals today?</h2>
            <div className="absolute top-0 right-0 bg-theme-darker rounded-full px-3 py-1.5">
              <p className="text-gray text-[14px]">{data?.goals.length} goals</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {data?.goals.map((goal) => (
              <Link
                to={`/goal/${goal._id}`}
                key={goal._id}
                className="border rounded-xl p-6.5 shadow-md bg-theme border-theme-darker gap-5 flex flex-col"
              >
                <div className="relative flex flex-col gap-3">
                  <h1 className="font-heading font-semibold text-[18px]">{toCapitalize(goal.title)}</h1>
                  <div className="flex gap-3 items-center">
                    <p style={{ color: goal.color }} className="bg-theme-darker/20 rounded-full text-[12px] px-2 py-1 inline">
                      {goal.status}
                    </p>
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
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[200vh]"></div>
    </div>
  );
};

export default Dashboard;

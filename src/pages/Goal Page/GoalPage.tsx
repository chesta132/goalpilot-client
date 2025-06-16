import ErrorPopup from "@/components/Popups/ErrorPopup";
import callApi from "@/utils/callApi";
import { handleError, errorAuthBool } from "@/utils/errorHandler";
import type { TError, GoalData } from "@/utils/types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useScrollNavigation from "@/hooks/useScrollNavigation";
import StatsCard from "@/components/Cards/StatsCard";
import ButtonV from "@/components/Inputs/ButtonV";
import { Goal, Verified, Plus, Calendar, Minus } from "lucide-react";
import toCapitalize from "@/utils/toCapitalize";
import Loading from "@/components/Static UI/Loading";
import TaskCard from "@/components/Cards/TaskCard";
import { Empty } from "antd";

const GoalPage = () => {
  const [data, setData] = useState<GoalData | null>(null);
  const [error, setError] = useState<TError>({ error: null });
  const [loading, setLoading] = useState(true);
  const [addTaskPopup, setAddTaskPopup] = useState(false); // Card
  const [addTaskButton, setaddTaskButton] = useState(false); // Toggle show button

  const goalId = useParams().goalId;
  const errorAuth = errorAuthBool(error);
  const { timelineStatus } = useScrollNavigation();

  useEffect(() => {
    const initiateData = async () => {
      setLoading(true);
      try {
        const response = await callApi(`/goal?goalId=${goalId}`, { method: "GET", token: true });
        setData(response.data);
      } catch (err) {
        handleError(err, setError);
      } finally {
        setLoading(false);
      }
    };
    initiateData();
  }, [goalId]);

  if (loading) return <Loading />;
  if (!data) return;

  const { color, description, progress, tasks, title, status } = data;
  const createdAt = new Date(data.createdAt);
  const targetDate = data.targetDate ? new Date(data.targetDate) : null;

  const existingTasks = tasks.filter((task) => !task.isRecycled);

  return (
    <div>
      {/* Header/absolute */}
      {error.error && (
        <ErrorPopup
          title={error && error.error.title}
          message={error && error.error.message}
          showBackToDashboard={!errorAuth && error.error.code !== "ERR_NETWORK"}
          showBackToLoginPage={errorAuth}
        />
      )}

      {/* Goal Page */}
      <div className="lg:pl-[25%] pt-22 lg:pt-13 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
        <div>
          <div
            className={clsx(
              "bg-theme-dark rounded-lg px-4 mx-3 lg:mx-0 py-8 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-[padding] duration-600 ease-in-out relative",
              timelineStatus && "lg:!pt-8"
            )}
          >
            <div className="flex gap-2 flex-col lg:flex-row lg:justify-between">
              <h1 className="text-[20px] font-[600] font-heading">{toCapitalize(title)}</h1>
              <h1
                className={clsx(
                  "text-[13px] font-heading mb-2 size-fit rounded-2xl px-2 py-1 text-white",
                  status === "Active"
                    ? "bg-green-700"
                    : status === "Pending"
                    ? "bg-yellow-600"
                    : status === "Paused" || status === "Canceled"
                    ? "bg-red-700"
                    : status === "Completed" && "bg-green-500 !text-black"
                )}
              >
                {status}
              </h1>
            </div>
            <StatsCard
              header="Description"
              className="!bg-theme"
              classStats="text-[15px] font-medium mt-2"
              icon={<Goal className="h-8 w-8 p-1 object-contain rounded-md " style={{ background: data.color }} />}
              stats={description}
            />
            <StatsCard
              className="!bg-theme"
              header="Progress"
              classStats="text-[17px] font-medium mt-2"
              icon={<Verified className="h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1 fill-theme-reverse stroke-[#F59E0B]" />}
              stats={progress.toString() + "%"}
            >
              <div className="rounded-full bg-theme-dark h-3 w-full">
                <div className="rounded-full h-full" style={{ width: `${progress}%`, background: color }} />
              </div>
            </StatsCard>
            <StatsCard
              header={targetDate ? "Target Date" : "Created Date"}
              classStats="text-[15px] font-medium mt-2"
              icon={<Calendar className="h-8 bg-accent w-8 object-contain rounded-md p-1.5" />}
              stats={
                targetDate
                  ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).toDateString()
                  : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate()).toDateString()
              }
            />
            <div className={clsx("mt-10 w-full flex flex-col gap-3 lg:absolute lg:bottom-0 lg:mb-5 lg:w-auto")}>
              <ButtonV
                text="Create New Task"
                icon={<Plus className="bg-transparent" />}
                className={clsx("shadow-sm whitespace-nowrap w-full lg:-translate-x-[100dvh] lg:duration-500", addTaskButton && "!translate-0")}
                onClick={() => setAddTaskPopup(true)}
              />
              <ButtonV
                text="Generate Tasks With AI"
                icon={
                  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.00975 3L7.35 5.1L7.7 6.85L8.65993 8.32057L9.8 9.3L11.2 9.65L14 10L11.2 10.35L9.8 10.7L8.65993 11.6089L7.7 13.5L7.35 14.55L7.00975 17L6.65 14.55L6.3 13.5L5.35957 11.6089L4.2 10.7L2.8 10.35L0 10L2.8 9.65L4.2 9.3L5.35957 8.32057L6.3 6.85L6.65 5.1L7.00975 3Z"
                      className="fill-theme-reverse"
                    />
                    <path
                      d="M14.5063 14L14.725 15.2L14.95 16.2L15.5671 17.0403L16.3 17.6L17.2 17.8L19 18L17.2 18.2L16.3 18.4L15.5671 18.9193L14.95 20L14.725 20.6L14.5063 22L14.275 20.6L14.05 20L13.4454 18.9193L12.7 18.4L11.8 18.2L10 18L11.8 17.8L12.7 17.6L13.4454 17.0403L14.05 16.2L14.275 15.2L14.5063 14Z"
                      className="fill-theme-reverse"
                    />
                    <path
                      d="M17.0056 0L17.2 1.2L17.4 2.2L17.9485 3.04033L18.6 3.6L19.4 3.8L21 4L19.4 4.2L18.6 4.4L17.9485 4.91935L17.4 6L17.2 6.6L17.0056 8L16.8 6.6L16.6 6L16.0626 4.91935L15.4 4.4L14.6 4.2L13 4L14.6 3.8L15.4 3.6L16.0626 3.04033L16.6 2.2L16.8 1.2L17.0056 0Z"
                      className="fill-theme-reverse"
                    />
                  </svg>
                }
                className={clsx(
                  "shadow-sm whitespace-nowrap lg:-translate-x-[100dvh] lg:duration-500 lg:delay-50 w-full !text-theme-reverse lg:text-[14px] bg-theme border-accent border hover:bg-theme-dark hover:border-violet-500",
                  addTaskButton && "!translate-0"
                )}
                onClick={() => setAddTaskPopup(true)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 bg-theme-dark px-3 py-10 mx-1 rounded-xl shadow-lg">
          <h1 className="text-[20px] font-[600] font-heading ml-3">Tasks of {toCapitalize(title)}</h1>
          {existingTasks.length > 0 ? (
            existingTasks.map((task) => <TaskCard task={task} goal={data} />)
          ) : (
            <Empty className="flex flex-col justify-center">
              <p className="text-gray">No Task Found</p>
              <div className="relative h-12">
                <ButtonV
                  text="Create New Task"
                  className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap h-7 shadow-sm"
                  onClick={() => setAddTaskPopup(true)}
                />
              </div>
            </Empty>
          )}
        </div>
      </div>
      <div
        className={clsx(
          "fixed cursor-pointer hidden lg:flex bottom-0 right-0 p-2 bg-accent rounded-full mb-3 mr-3 transition duration-500",
          timelineStatus && "translate-y-50"
        )}
      >
        {addTaskButton ? (
          <Minus size={30} className="text-theme-reverse" onClick={() => setaddTaskButton(false)} />
        ) : (
          <Plus size={30} className="text-theme-reverse" onClick={() => setaddTaskButton(true)} />
        )}
      </div>
    </div>
  );
};

export default GoalPage;

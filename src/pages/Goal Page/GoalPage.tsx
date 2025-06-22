import ErrorPopup from "@/components/Popups/ErrorPopup";
import callApi from "@/utils/callApi";
import { handleError, errorAuthBool } from "@/utils/errorHandler";
import type { GoalData } from "@/utils/types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useScrollNavigation from "@/hooks/useScrollNavigation";
import StatsCard from "@/components/Cards/StatsCard";
import ButtonV from "@/components/Inputs/ButtonV";
import { Goal, Verified, Plus, Calendar, X, Edit } from "lucide-react";
import toCapitalize from "@/utils/toCapitalize";
import TaskCard from "@/components/Cards/TaskCard";
import { Empty } from "antd";
import AddTaskPopup from "@/components/Popups/AddTaskPopup";
import { useGoalData, useNotification } from "@/contexts/UseContexts";
import TextArea from "@/components/Inputs/TextArea";
import { useViewportWidth } from "@/hooks/useViewport";

type AiInput = {
  value: string;
  error: null | string;
  loading: boolean;
};

type AddTaskComponentProps = {
  data: GoalData;
  loading: boolean;
  setTaskPopupAppear: React.Dispatch<React.SetStateAction<boolean>>;
  addTaskAIInput: boolean;
  setAiInput: React.Dispatch<React.SetStateAction<AiInput>>;
  aiInput: AiInput;
  setAddTaskAIInput: React.Dispatch<React.SetStateAction<boolean>>;
  generateWithAI: () => void;
};

function ReadMore({ text, title, onClose }: { text: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed h-[100dvh] w-full z-[999] flex justify-center items-center backdrop-blur-[2px] backdrop-brightness-90">
      <div className="w-[80%] lg:w-1/2 max-h-100 bg-theme px-8 py-10 flex flex-col rounded-2xl relative">
        <button
          className="absolute right-0 mr-8 translate-x-3 -translate-y-3 cursor-pointer p-1 text-theme-reverse hover:text-theme-reverse-dark transition-colors duration-400"
          onClick={onClose}
        >
          <X />
        </button>
        <h1 className="text-start text-theme-reverse font-bold text-[19px] mb-7">{title}</h1>
        <p className="text-theme-reverse-dark overflow-auto leading-6.5">{text}</p>
      </div>
    </div>
  );
}

function AddTaskComponent({
  data,
  loading,
  setTaskPopupAppear,
  addTaskAIInput,
  setAiInput,
  aiInput,
  setAddTaskAIInput,
  generateWithAI,
}: AddTaskComponentProps) {
  return (
    <div className="mt-10 lg:mt-0 w-full flex flex-col gap-3">
      <ButtonV
        style={{ background: data.color }}
        text="Create New Task"
        icon={<Plus className="bg-transparent" />}
        className="shadow-sm whitespace-nowrap w-full"
        onClick={() => !loading && setTaskPopupAppear(true)}
      />
      {addTaskAIInput && (
        <div className="flex justify-between items-center gap-5">
          <div className="w-full">
            <TextArea
              close={() => {
                setAddTaskAIInput(false);
                setAiInput((prev) => ({ ...prev, value: "", error: null }));
              }}
              label="Generate Task"
              placeholder="Generate with Gemini"
              className="my-2 w-full"
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              onChange={(e) => setAiInput((prev) => ({ ...prev, value: e.target.value }))}
              value={aiInput.value}
            />
            {aiInput.error && <p className="text-red-500 text-[12px] text-start">{aiInput.error}</p>}
          </div>
        </div>
      )}
      <ButtonV
        disabled={aiInput.loading}
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
          "shadow-sm whitespace-nowrap w-full !text-theme-reverse lg:text-[14px] bg-transparent border-accent border hover:bg-theme-dark hover:border-violet-500",
          aiInput.loading && "animate-transparent-shimmer -bg-linear-45 from-transparent from-40% via-violet-500 via-50% to-transparent to-60%"
        )}
        onClick={generateWithAI}
      />
    </div>
  );
}

const GoalPage = () => {
  const { data, error, setError, getData, loading, clearError, setData } = useGoalData();
  const [taskPopupAppear, setTaskPopupAppear] = useState(false);
  const [addTaskAIInput, setAddTaskAIInput] = useState(false);
  const [aiInput, setAiInput] = useState<AiInput>({ value: "", error: null, loading: false });
  const [readMore, setReadMore] = useState({ title: false, desc: false, taskTitle: false });

  const goalId = useParams().goalId;
  const errorAuth = errorAuthBool(error);
  const width = useViewportWidth();
  const navigate = useNavigate();
  const { timelineStatus } = useScrollNavigation();
  const { openNotification } = useNotification();

  useEffect(() => {
    if (goalId) getData(goalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  const generateWithAI = async () => {
    clearError();
    if (!addTaskAIInput) {
      setAddTaskAIInput(true);
      return;
    }
    if (aiInput.value.length < 20) {
      setAiInput((prev) => ({ ...prev, error: "Minimum input is 20 character" }));
      return;
    }

    try {
      setAiInput((prev) => ({ ...prev, loading: true, error: null }));
      const response = await callApi("/ai", { method: "POST", body: { query: aiInput.value, goalId }, token: true });
      openNotification({ message: response.data.notification, type: "success", button: "default" });
      if (goalId) getData(goalId);
      setAddTaskAIInput(false);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setAiInput((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (taskPopupAppear || readMore.desc) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [taskPopupAppear, readMore.desc]);

  const { color, description, progress, tasks, title, status } = data;
  const createdAt = new Date(data.createdAt);
  const targetDate = data.targetDate ? new Date(data.targetDate) : null;

  const existingTasks = tasks.filter((task: { isRecycled: boolean }) => !task.isRecycled);

  const undoDeleteTask = async (taskId: string) => {
    try {
      const response = await callApi("/task/restore", { method: "PUT", body: { taskId }, token: true });
      openNotification({ message: response.data.notification, type: "success", button: "default" });
      if (goalId) getData(goalId, false);
    } catch (err) {
      handleError(err, setError);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await callApi("/task", { method: "DELETE", body: { goalId, taskId }, token: true });
      openNotification({ message: response.data.notification, type: "success", undo: { f: undoDeleteTask, id: taskId } });
      const deletedTaskId = response.data._id;
      setData((prev) => ({ ...prev, tasks: tasks.filter((task) => task._id !== deletedTaskId) }));
    } catch (err) {
      handleError(err, setError);
    }
  };

  const handleToEdit = () => {
    sessionStorage.setItem("goal-data", JSON.stringify(data));
    navigate("./edit");
  };

  return (
    <div>
      {/* Header/absolute */}
      {error.error && (
        <ErrorPopup
          title={error && error.error.title}
          message={error && error.error.message}
          showBackToDashboard={!errorAuth && error.error.code !== "ERR_NETWORK" && error.error.code !== "ERR_BAD_REQUEST"}
          showBackToLoginPage={!errorAuth}
        />
      )}
      {taskPopupAppear && <AddTaskPopup setAppear={setTaskPopupAppear} goalId={data._id} refetch={() => goalId && getData(goalId, false)} />}
      {readMore.desc && <ReadMore text={description} title="Description" onClose={() => setReadMore((prev) => ({ ...prev, desc: false }))} />}

      {/* Goal Page */}
      <div className="lg:pl-[25%] pt-22 lg:pt-13 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
        <div>
          <div
            className={clsx(
              "bg-theme-dark rounded-lg px-4 mx-3 lg:mx-0 py-8 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-[padding] duration-600 ease-in-out relative",
              timelineStatus && "lg:!pt-8"
            )}
          >
            <div className="flex justify-between">
              <div className={clsx("flex gap-2 flex-col", loading && "animate-shimmer rounded-md")}>
                <h1 className={clsx("text-[20px] font-[600] font-heading", loading && "!text-transparent !bg-transparent")}>
                  {title.length > 30 ? (
                    <>
                      {readMore.taskTitle ? toCapitalize(title) : `${toCapitalize(title).substring(0, 30)}...`}
                      <br />
                      <button
                        className={clsx("text-gray cursor-pointer w-fit text-[14px] font-normal", loading && "text-transparent")}
                        onClick={() => setReadMore((prev) => ({ ...prev, taskTitle: !prev.taskTitle }))}
                      >
                        {readMore.taskTitle ? "Read less" : "Read more"}
                      </button>
                    </>
                  ) : (
                    toCapitalize(title)
                  )}
                </h1>
                <h1
                  className={clsx(
                    "text-[13px] font-heading mb-2 size-fit rounded-2xl px-2 py-1 text-white",
                    status.toLowerCase() === "active"
                      ? "bg-green-700"
                      : status.toLowerCase() === "pending"
                      ? "bg-yellow-600"
                      : status.toLowerCase() === "paused" || status.toLowerCase() === "canceled"
                      ? "bg-red-700"
                      : status.toLowerCase() === "completed" && "bg-green-500 !text-black",
                    loading && "!text-transparent !bg-transparent"
                  )}
                >
                  {toCapitalize(status)}
                </h1>
              </div>
              <div className="mx-2 cursor-pointer" onClick={handleToEdit}>
                <Edit />
              </div>
            </div>
            <StatsCard
              loading={loading}
              header="Description"
              className="!bg-theme"
              classStats="text-[15px] font-medium mt-2"
              icon={<Goal className={clsx("h-8 w-8 p-1 object-contain rounded-md bg-accent", loading && "hidden")} />}
              stats={
                description.length > 100 ? (
                  <>
                    {`${description.substring(0, 100)}...`}
                    <br />
                    <button
                      className={clsx("text-gray cursor-pointer w-fit text-[13px] font-normal", loading && "text-transparent")}
                      onClick={() => setReadMore((prev) => ({ ...prev, desc: true }))}
                    >
                      Read more
                    </button>
                  </>
                ) : (
                  description
                )
              }
            />
            <StatsCard
              loading={loading}
              className="!bg-theme"
              header="Progress"
              classStats="text-[17px] font-medium mt-2"
              icon={
                <Verified
                  className={clsx("h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1 fill-theme-reverse stroke-[#F59E0B]", loading && "hidden")}
                />
              }
              stats={progress.toString() + "%"}
            >
              <div className={clsx("rounded-full bg-theme-dark h-3 w-full", loading && "bg-transparent")}>
                <div className={clsx("rounded-full h-full", loading && "hidden")} style={{ width: `${progress}%`, background: color }} />
              </div>
            </StatsCard>
            <StatsCard
              loading={loading}
              header={targetDate ? "Target Date" : "Created Date"}
              classStats="text-[15px] font-medium mt-2"
              icon={<Calendar className={clsx("h-8 w-8 object-contain rounded-md p-1.5", loading && "hidden")} style={{ background: data.color }} />}
              stats={
                targetDate
                  ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).toDateString()
                  : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate()).toDateString()
              }
            />
            {width < 1024 && (
              <AddTaskComponent
                data={data}
                addTaskAIInput={addTaskAIInput}
                aiInput={aiInput}
                generateWithAI={generateWithAI}
                loading={loading}
                setAddTaskAIInput={setAddTaskAIInput}
                setAiInput={setAiInput}
                setTaskPopupAppear={setTaskPopupAppear}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:gap-11 bg-theme-dark px-3 py-10 mx-2 rounded-xl shadow-lg">
          <h1 className="text-[20px] font-[600] font-heading ml-3">
            Tasks of{" "}
            {title.length > 30 ? (
              <>
                {readMore.title ? toCapitalize(title) : `${toCapitalize(title).substring(0, 30)}...`}
                <br />
                <button
                  className={clsx("text-gray cursor-pointer w-fit text-[14px] font-normal", loading && "text-transparent")}
                  onClick={() => setReadMore((prev) => ({ ...prev, title: !prev.title }))}
                >
                  {readMore.title ? "Read less" : "Read more"}
                </button>
              </>
            ) : (
              toCapitalize(title)
            )}
          </h1>
          {width >= 1024 && (
            <div className="px-5">
              <AddTaskComponent
                data={data}
                addTaskAIInput={addTaskAIInput}
                aiInput={aiInput}
                generateWithAI={generateWithAI}
                loading={loading}
                setAddTaskAIInput={setAddTaskAIInput}
                setAiInput={setAiInput}
                setTaskPopupAppear={setTaskPopupAppear}
              />
            </div>
          )}
          {existingTasks.length > 0 ? (
            existingTasks.map((task) => (
              <TaskCard refetch={() => goalId && getData(goalId)} deletes={deleteTask} task={task} setError={setError} key={task._id} goal={data} />
            ))
          ) : (
            <Empty className="flex flex-col justify-center">
              <p className="text-gray">No Task Found</p>
              <div className="relative h-12">
                <ButtonV
                  text="Create New Task"
                  className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap h-7 shadow-sm"
                  onClick={() => !loading && setTaskPopupAppear(true)}
                />
              </div>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalPage;

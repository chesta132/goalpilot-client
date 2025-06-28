import ErrorPopup from "@/components/Popups/ErrorPopup";
import { errorAuthBool } from "@/utils/errorHandler";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ButtonV from "@/components/Inputs/ButtonV";
import { X } from "lucide-react";
import toCapitalize from "@/utils/toCapitalize";
import TaskCard from "@/components/Cards/TaskCard";
import { Empty } from "antd";
import { useGoalData, useTheme } from "@/contexts/UseContexts";
import { useViewportWidth } from "@/hooks/useViewport";
import { AddTask } from "@/components/Forms/AddTask";
import TaskCardCompact from "@/components/Cards/TaskCardCompact";

type AiInput = {
  value: string;
  error: null | string;
  loading: boolean;
};

export function ReadMore({ text, title, onClose }: { text: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed h-[100dvh] top-0 w-full z-[9999] flex justify-center items-center backdrop-blur-[2px] backdrop-brightness-90">
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

const GoalPage = () => {
  const { data, error, setError, getData, loading } = useGoalData();
  const { settings } = useTheme();

  const [addTaskAIInput, setAddTaskAIInput] = useState(false);
  const [aiInput, setAiInput] = useState<AiInput>({ value: "", error: null, loading: false });
  const [readMore, setReadMore] = useState({ title: false, desc: false, taskTitle: false });

  const goalId = useParams().goalId;
  const errorAuth = errorAuthBool(error);
  const width = useViewportWidth();
  const navigate = useNavigate();

  useEffect(() => {
    const gettingData = async () => {
      if (goalId) await getData(goalId);
    };
    gettingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  useEffect(() => {
    if (readMore.desc) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [readMore.desc]);

  const { description, tasks, title } = data;

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
      {readMore.desc && <ReadMore text={description} title="Description" onClose={() => setReadMore((prev) => ({ ...prev, desc: false }))} />}

      {/* Goal Page */}
      <div className=" md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
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
              <AddTask
                data={data}
                addTaskAIInput={addTaskAIInput}
                aiInput={aiInput}
                loading={loading}
                setAddTaskAIInput={setAddTaskAIInput}
                setAiInput={setAiInput}
              />
            </div>
          )}
          <div
            className={clsx(
              "flex flex-col gap-6 lg:gap-8 px-3",
              settings.taskCard === "compact" && "gap-4!"
            )}
          >
            {tasks.length > 0 ? (
              settings.taskCard === "regular" ? (
                tasks.map((task) => <TaskCard task={task} setError={setError} key={task._id} />)
              ) : (
                tasks.map((task) => <TaskCardCompact task={task} setError={setError} key={task._id} />)
              )
            ) : (
              <Empty className="flex flex-col justify-center">
                <p className="text-gray">No Task Found</p>
                <div className="relative h-12">
                  <ButtonV
                    text="Create New Task"
                    className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap h-7 shadow-sm bg-goal-accent hover:bg-goal-accent-strong"
                    onClick={() => {
                      if (!loading) {
                        sessionStorage.setItem("goal-id", data._id);
                        navigate("/task/create");
                      }
                    }}
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

export default GoalPage;

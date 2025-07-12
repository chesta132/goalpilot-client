import ErrorPopup from "@/components/Popups/ErrorPopup";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ButtonV from "@/components/Inputs/ButtonV";
import { capitalWord } from "@/utils/stringManip";
import TaskCard from "@/components/Cards/TaskCard";
import { Empty } from "antd";
import { useGoalData, useTheme } from "@/contexts/UseContexts";
import { useViewportWidth } from "@/hooks/useViewport";
import { AddTask } from "@/components/Forms/AddTask";
import TaskCardCompact from "@/components/Cards/TaskCardCompact";
import { encrypt } from "@/utils/cryptoUtils";

type AiInput = {
  value: string;
  error: null | string;
  loading: boolean;
};

const GoalPage = () => {
  const { data, error, setError, getData, loading } = useGoalData();
  const { settings } = useTheme();

  const [addTaskAIInput, setAddTaskAIInput] = useState(false);
  const [aiInput, setAiInput] = useState<AiInput>({ value: "", error: null, loading: false });
  const [readMore, setReadMore] = useState({ title: false, desc: false, taskTitle: false });

  const { goalId } = useParams();
  const width = useViewportWidth();
  const navigate = useNavigate();

  useEffect(() => {
    const gettingData = async () => {
      if (goalId) await getData(goalId);
    };
    if (goalId !== data.id) {
      gettingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  useEffect(() => {
    if (readMore.desc) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [readMore.desc]);

  const { tasks, title } = data;

  useEffect(() => {
    sessionStorage.removeItem("goal-data");
  }, []);

  return (
    <div>
      {/* Header/absolute */}
      {error.error && <ErrorPopup error={error} />}

      {/* Goal Page */}
      <div className="px-3 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
        <div className="flex flex-col gap-6 lg:gap-11 bg-theme-dark px-3 py-10 rounded-xl shadow-lg">
          <h1 className="text-[20px] font-[600] font-heading ml-3">
            Tasks of{" "}
            {title.length > 30 ? (
              <>
                {readMore.title ? capitalWord(title) : `${capitalWord(title).substring(0, 30)}...`}
                <br />
                <button
                  className={clsx("text-gray cursor-pointer w-fit text-[14px] font-normal", loading && "text-transparent")}
                  onClick={() => setReadMore((prev) => ({ ...prev, title: !prev.title }))}
                >
                  {readMore.title ? "Read less" : "Read more"}
                </button>
              </>
            ) : (
              capitalWord(title)
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
          <div className={clsx("flex flex-col gap-6 lg:gap-8 px-3", settings.taskCard === "compact" && "gap-4!")}>
            {tasks.length > 0 ? (
              settings.taskCard === "regular" ? (
                tasks.map((task, index) => <TaskCard index={index} task={task} setError={setError} key={task._id} />)
              ) : (
                tasks.map((task, index) => <TaskCardCompact index={index} task={task} setError={setError} key={task._id} />)
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
                        const encryptedData = encrypt(JSON.stringify(data.id));
                        sessionStorage.setItem("goal-id", encryptedData);
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

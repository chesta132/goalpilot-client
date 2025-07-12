import useScrollNavigation from "@/hooks/useScrollNavigation";
import { capitalEachWords } from "@/utils/stringManip";
import clsx from "clsx";
import { Calendar, Edit, Goal, Verified } from "lucide-react";
import StatsCard from "../Cards/StatsCard";
import { useGoalData } from "@/contexts/UseContexts";
import { useViewportWidth } from "@/hooks/useViewport";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AddTask } from "../Forms/AddTask";
import { decrypt, encrypt } from "@/utils/cryptoUtils";
import { defaultGoalData } from "@/utils/defaultData";

type TAiInput = {
  value: string;
  error: null | string;
  loading: boolean;
};

type TReadMore = {
  title: boolean;
  desc: boolean;
  taskTitle: boolean;
};

export const SidebarGoal = () => {
  const { loading, data, setData } = useGoalData();

  const { timelineStatus } = useScrollNavigation();

  const [readMore, setReadMore] = useState<TReadMore>({ title: false, desc: false, taskTitle: false });
  const [addTaskAIInput, setAddTaskAIInput] = useState(false);
  const [aiInput, setAiInput] = useState<TAiInput>({ value: "", error: null, loading: false });

  const width = useViewportWidth();
  const location = useLocation();
  const navigate = useNavigate();

  const { color, description, progress, title, status } = data;
  const createdAt = new Date(data.createdAt);
  const targetDate = data.targetDate ? new Date(data.targetDate) : null;

  const handleToEdit = () => {
    const encryptedData = encrypt(JSON.stringify(data));
    sessionStorage.setItem("goal-data", encryptedData);
    navigate(`/goal/${data._id}/edit`);
  };

  useEffect(() => {
    if (JSON.stringify(data) === JSON.stringify(defaultGoalData)) {
      if (sessionStorage.getItem("goal-data")) {
        setData(JSON.parse(decrypt(sessionStorage.getItem("goal-data"))));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div
      className={clsx(
        "bg-theme-dark rounded-2xl px-4 mx-3 md:mx-6 lg:mx-0 py-8 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-[padding] duration-600 ease-in-out relative",
        timelineStatus && "lg:!pt-8"
      )}
    >
      <div className="flex justify-between">
        <div className={clsx("flex gap-2 flex-col w-full", loading && "animate-shimmer rounded-md")}>
          <h1
            className={clsx(
              "text-[20px] font-[600] font-heading max-w-[85%]",
              loading && "!text-transparent !bg-transparent",
              readMore.title && "overflow-auto"
            )}
          >
            {title.length > 30 ? (
              <>
                {readMore.taskTitle ? capitalEachWords(title) : `${capitalEachWords(title).substring(0, 30)}...`}
                <br />
                <button
                  className={clsx("text-gray cursor-pointer w-fit text-[14px] font-normal", loading && "text-transparent")}
                  onClick={() => setReadMore((prev) => ({ ...prev, taskTitle: !prev.taskTitle }))}
                >
                  {readMore.taskTitle ? "Read less" : "Read more"}
                </button>
              </>
            ) : (
              capitalEachWords(title)
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
            {capitalEachWords(status)}
          </h1>
        </div>
        <div className="mx-2 !cursor-pointer absolute right-0 mr-5" onClick={handleToEdit}>
          <Edit />
        </div>
      </div>
      <StatsCard
        loading={loading}
        header="Description"
        className={clsx("!bg-theme max-h-100", readMore.desc && "overflow-auto")}
        classStats="text-[15px] font-medium mt-2"
        icon={<Goal className={clsx("h-8 w-8 p-1 object-contain rounded-md bg-accent", loading && "hidden")} />}
        stats={
          description.length > 100 ? (
            <>
              {readMore.desc ? capitalEachWords(description) : `${capitalEachWords(description).substring(0, 30)}...`}
              <br />
              <button
                className={clsx("text-gray cursor-pointer w-fit text-[14px] font-normal", loading && "text-transparent")}
                onClick={() => setReadMore((prev) => ({ ...prev, desc: !prev.desc }))}
              >
                {readMore.desc ? "Read less" : "Read more"}
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
          <Verified className={clsx("h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1 fill-theme-reverse stroke-[#F59E0B]", loading && "hidden")} />
        }
        stats={progress.toString() + "%"}
      >
        <div className={clsx("rounded-full bg-theme-dark h-3 w-full", loading && "bg-transparent")}>
          <div className={clsx("rounded-full h-full bg-(--goal-accent)", loading && "hidden")} style={{ width: `${progress}%` }} />
        </div>
      </StatsCard>
      <StatsCard
        loading={loading}
        header={targetDate ? "Target Date" : "Created Date"}
        classStats="text-[15px] font-medium mt-2"
        icon={<Calendar className={clsx("h-8 w-8 object-contain rounded-md p-1.5", loading && "hidden")} style={{ background: color }} />}
        stats={
          targetDate
            ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).toDateString()
            : new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate()).toDateString()
        }
      />
      {location.pathname === `/goal/${data._id}` && width < 1024 && (
        <AddTask
          data={data}
          addTaskAIInput={addTaskAIInput}
          aiInput={aiInput}
          loading={loading}
          setAddTaskAIInput={setAddTaskAIInput}
          setAiInput={setAiInput}
        />
      )}
    </div>
  );
};

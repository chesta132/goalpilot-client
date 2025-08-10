import useScrollNavigation from "@/hooks/useScrollNavigation";
import { capitalEachWords } from "@/utils/stringManip";
import clsx from "clsx";
import { Book, Calendar, Edit, Info, Verified } from "lucide-react";
import StatsCard from "../Cards/StatsCard";
import { useGoalData } from "@/contexts/UseContexts";
import { useViewportWidth } from "@/hooks/useViewport";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AddTask } from "../Forms/AddTask";
import { decrypt, encrypt } from "@/utils/cryptoUtils";
import { defaultGoalData } from "@/utils/defaultData";
import { getBgByStatus } from "@/utils/commonUtils";
import { ReadMore } from "../Inputs/ReadMore";

type TAiInput = {
  value: string;
  error: null | string;
  loading: boolean;
};

export const SidebarGoal = ({ withEdit = true, withInfo = true }) => {
  const { loading, data, setData } = useGoalData();

  const { timelineStatus } = useScrollNavigation();

  const [addTaskAIInput, setAddTaskAIInput] = useState(false);
  const [aiInput, setAiInput] = useState<TAiInput>({ value: "", error: null, loading: false });

  const width = useViewportWidth();
  const location = useLocation();

  const { color, description, progress, title, status } = data;
  const createdAt = data.createdAt;
  const targetDate = data.targetDate ? new Date(data.targetDate) : null;

  const setGoalData = () => {
    const encryptedData = encrypt(data);
    sessionStorage.setItem("goal-data", encryptedData);
  };

  useEffect(() => {
    if (Object.compare(data, defaultGoalData)) {
      if (sessionStorage.getItem("goal-data")) {
        setData(decrypt(sessionStorage.getItem("goal-data"), { parse: true }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div
      className={clsx(
        "bg-theme-dark rounded-2xl px-6 py-7 mx-3 md:mx-6 lg:mx-0 border-theme-darker shadow-md gap-3 flex flex-col lg:left-0 lg:pt-24 lg:top-0 lg:rounded-t-none lg:rounded-b-none lg:h-[100dvh] lg:w-[23%] lg:fixed transition-[padding] duration-600 ease-in-out relative",
        timelineStatus && "lg:!pt-8"
      )}
    >
      <div className="flex justify-between">
        <div className={clsx("flex gap-2 flex-col w-full", loading && "animate-shimmer rounded-md")}>
          <ReadMore
            text={capitalEachWords(title)}
            className={clsx("text-[20px] font-[600] font-heading max-w-[85%]", loading && "!text-transparent !bg-transparent")}
            readMoreClass={clsx(loading && "text-transparent")}
          />
          <h1
            className={clsx(
              "text-[13px] font-heading mb-2 size-fit rounded-2xl px-2 py-1 text-white",
              getBgByStatus(status),
              loading && "!text-transparent !bg-transparent"
            )}
          >
            {capitalEachWords(status)}
          </h1>
        </div>
        <div className="mx-2 absolute right-0 mr-5 flex gap-2">
          {withInfo && (
            <Link className="cursor-pointer!" to={`/goal/${data._id}/info`} onClick={setGoalData}>
              <Info size={19.5} />
            </Link>
          )}
          {withEdit && (
            <Link className="!cursor-pointer" to={`/goal/${data._id}/edit`} onClick={setGoalData}>
              <Edit size={19.5} />
            </Link>
          )}
        </div>
      </div>
      <StatsCard
        loading={loading}
        header="Description"
        className={clsx("!bg-theme max-h-100 overflow-auto")}
        classStats="text-[15px] font-medium mt-2"
        icon={<Book className={clsx("h-8 w-8 p-1 object-contain rounded-md bg-accent", loading && "hidden")} />}
        stats={<ReadMore text={description} readMoreClass={clsx(loading && "text-transparent")} />}
      />
      <StatsCard
        loading={loading}
        className="!bg-theme"
        header="Progress"
        classStats="text-[17px] font-medium mt-2"
        icon={
          <Verified className={clsx("h-8 bg-[#F59E0B] w-8 object-contain rounded-md p-1 fill-theme-reverse stroke-[#F59E0B]", loading && "hidden")} />
        }
        stats={progress.toFixed(2) + "%"}
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

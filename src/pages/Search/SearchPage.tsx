import { useSearch } from "@/contexts/UseContexts";
import { SearchBar } from "./SearchBar";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Link } from "react-router";
import { UserCardCompact } from "@/components/Cards/UserCardCompact";
import { Empty } from "antd";
import { GoalCardCompact } from "@/components/Cards/GoalCardCompact";
import TaskCardCompact from "@/components/Cards/TaskCardCompact";
import type { SearchData } from "@/contexts/SearchContext";
import type { GoalData, SearchProfile, TaskData } from "@/types/types";
import { capitalWord } from "@/utils/stringManip";
import clsx from "clsx";

const ListComponent = ({
  data,
  setFullView,
  fullView,
  dataProp,
}: {
  data: SearchProfile[] | GoalData[] | TaskData[];
  setFullView: React.Dispatch<React.SetStateAction<FullView>>;
  fullView: FullView;
  dataProp: "profiles" | "goals" | "tasks";
}) => {
  const { params } = useSearch();
  const { type } = params;

  const isUserType = dataProp === "profiles";
  const isGoalType = dataProp === "goals";
  if (!dataProp.toUpperCase().includes(type) && type !== "ALL") return;
  return (
    <div className="px-3 py-4 flex flex-col gap-3 border-t-1 border-gray/40">
      <div className="flex gap-2">
        <h1>
          {isUserType ? "User profiles" : `Your ${dataProp}`} ({data.length || 0})
        </h1>
        <button
          onClick={() => setFullView((prev) => ({ ...prev, [dataProp]: !prev[dataProp] }))}
          className={clsx("cursor-pointer transition", fullView[dataProp] && "rotate-180")}
        >
          <ChevronUp />
        </button>
      </div>
      {fullView[dataProp] && (
        <div className="flex flex-col gap-6">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Link
                to={isUserType ? `/profile/${item.id}` : isGoalType ? `/goal/${item.id}` : `/task/${item.id}/info`}
                key={item.id}
                onClickCapture={() => window.scrollTo(0, 0)}
              >
                {isUserType ? (
                  <UserCardCompact user={item as SearchProfile} />
                ) : isGoalType ? (
                  <GoalCardCompact data={item as GoalData} />
                ) : (
                  <TaskCardCompact task={item as TaskData} index={index} buttons={{ edit: false, info: false, checkbox: false }} />
                )}
              </Link>
            ))
          ) : (
            <Empty className="flex flex-col justify-center" description>
              <p className="text-gray">No {capitalWord(dataProp.slice(0, -1))} Found</p>
            </Empty>
          )}
        </div>
      )}
    </div>
  );
};

type FullView = {
  profiles: boolean;
  goals: boolean;
  tasks: boolean;
};

export const SearchPage = () => {
  const { data, error } = useSearch();
  const [fullView, setFullView] = useState<FullView>({ profiles: true, goals: true, tasks: true });
  return (
    <div className="px-3 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
      {error.error && <ErrorPopup error={error} />}
      <div className="flex flex-col justify-center items-center bg-theme-dark rounded-xl shadow-lg px-3 py-10 gap-6">
        <SearchBar />
        <div className="w-full">
          {Object.entries(data)
            .filter(([key]) => key !== "isNext" && key !== "nextOffset")
            .map(([key, value]) => (
              <ListComponent
                data={value as SearchProfile[] | GoalData[] | TaskData[]}
                dataProp={key as keyof Omit<SearchData, "isNext" | "nextOffset">}
                fullView={fullView}
                setFullView={setFullView}
                key={key}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

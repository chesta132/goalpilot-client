import { useSearch } from "@/contexts/UseContexts";
import { SearchBar, searchItemTerms } from "./SearchBar";
import ErrorPopup from "@/components/Popups/ErrorPopup";
import { useEffect, useRef, useState } from "react";
import { ChevronUp, Search } from "lucide-react";
import { Link } from "react-router";
import { UserCardCompact } from "@/components/Cards/UserCardCompact";
import { Empty } from "antd";
import { GoalCardCompact } from "@/components/Cards/GoalCardCompact";
import TaskCardCompact from "@/components/Cards/TaskCardCompact";
import type { SearchData } from "@/contexts/SearchContext";
import type { GoalData, SearchProfile, TaskData } from "@/types/types";
import { capitalEachWords, capitalWord } from "@/utils/stringManip";
import clsx from "clsx";
import { Loading } from "@/components/Static/Loading";
import ButtonV from "@/components/Inputs/ButtonV";

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
  const { params, data: searchData, getSequelProfile } = useSearch();
  const { type } = params;
  const [isLoad, setIsLoad] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const isUserType = dataProp === "profiles";
  const isGoalType = dataProp === "goals";

  useEffect(() => {
    if (type === "profiles") {
      const loader = loaderRef.current;
      const observer = new IntersectionObserver(
        async ([entry]) => {
          if (entry.isIntersecting) {
            await getSequelProfile();
          }
        },
        { root: null, rootMargin: "20px", threshold: 1 }
      );
      if (loader) {
        observer.observe(loader);
      }
      return () => {
        if (loader) {
          observer.unobserve(loader);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (!type.includes(dataProp) && type !== "all") return;
  return (
    <div className="px-3 py-4 flex flex-col gap-3 border-t-1 border-gray/30">
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
                to={isUserType ? `/profile/${(item as SearchProfile).username}` : isGoalType ? `/goal/${item.id}` : `/task/${item.id}/info`}
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
          {type === "profiles" && dataProp === "profiles" && searchData.isNext && <Loading ref={loaderRef} />}
          {(type === "profiles" || type === "all") && dataProp === "profiles" && searchData.isNext && (
            <ButtonV
              disabled={isLoad}
              text="Load more User"
              className="px-3! py-1! text-[12px] inset-shadow-xs inset-shadow-accent-strong"
              onClick={async () => {
                setIsLoad(true);
                await getSequelProfile();
                setIsLoad(false);
              }}
            />
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
  const { data, error, params, setParams, getData, setData } = useSearch();
  const [fullView, setFullView] = useState<FullView>({ profiles: true, goals: true, tasks: true });

  const filterConfig = ["all", "profiles", "goals", "tasks"];

  const handleChangeType = (filter: string) => {
    const indexOfType = params.type.indexOf(filter);
    let updatedType =
      indexOfType === -1 ? `${params.type}_${filter}` : params.type.slice(0, indexOfType) + params.type.slice(indexOfType + filter.length);

    if (filter === "all" || params.type.includes("all")) {
      if (filter === "all") {
        updatedType = "all";
      } else {
        const indexOfAll = updatedType.indexOf("all");
        updatedType = updatedType.slice(0, indexOfAll) + updatedType.slice(indexOfAll + 3);
      }
    }
    if (updatedType[0] === "_") updatedType = updatedType.slice(1);
    if (updatedType[updatedType.length - 1] === "_") updatedType = updatedType.slice(0, -1);
    if (!updatedType) updatedType = "all";
    if (updatedType.includes("profiles") && updatedType.includes("goals") && updatedType.includes("tasks")) updatedType = "all";

    setParams((params) => {
      const dataKeys = Object.keys(data).filter((data) => data !== "isNext" && data !== "nextOffset");
      const dataIncludesNewType = updatedType.split("_").every((type) => dataKeys.includes(type));
      const allIsTrue = filterConfig.slice(1).every((config) => dataKeys.includes(config));
      if (!dataIncludesNewType && !allIsTrue) {
        const oldData = data;
        delete oldData.isNext;
        delete oldData.nextOffset;

        getData({ type: updatedType }).then(() => {
          setData((prev) => ({ ...prev, ...oldData }));
        });
      }
      return { ...params, type: updatedType };
    });
  };

  return (
    <div className="px-3 md:px-6 text-theme-reverse bg-theme w-full h-full gap-10 flex flex-col pb-10">
      {error.error && <ErrorPopup error={error} />}
      <div className="flex flex-col bg-theme-dark rounded-xl shadow-lg px-3 py-10 gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex justify-center items-center">
            <SearchBar />
          </div>
          <div className="flex gap-2">
            {filterConfig.map((filter) => (
              <button
                key={filter}
                className={clsx("text-[13px] px-4 py-2 rounded-xl bg-gray/10 cursor-pointer", params.type.includes(filter) && "bg-accent!")}
                onClick={() => handleChangeType(filter)}
              >
                {capitalEachWords(filter)}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full">
          {data.initiate && (
            <div className="flex justify-center items-center flex-col gap-5 border-t border-gray/30 py-10">
              <Search size={64} strokeWidth={0.8} />
              <div className="text-center">
                <h2 className="font-heading">Start searching</h2>
                <p className="text-gray text-[13px]">Enter a search term to find {searchItemTerms(params.type)}</p>
              </div>
            </div>
          )}
          {!data.initiate &&
            Object.entries(data)
              .filter(([key]) => key !== "isNext" && key !== "nextOffset" && key !== "initiate")
              .map(([key, value]) => (
                <ListComponent
                  data={value as SearchProfile[] | GoalData[] | TaskData[]}
                  dataProp={key as keyof Omit<SearchData, "isNext" | "nextOffset" | "initiate">}
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

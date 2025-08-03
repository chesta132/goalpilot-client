import { useSearch } from "@/contexts/UseContexts";
import { useDebounce } from "@/hooks/useDebounce";
import clsx from "clsx";
import { useEffect, type FormEvent } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const searchItemTerms = (type: string) => {
  const isUserType = type.includes("profiles") || type.includes("all");
  const isGoalType = type.includes("goals") || type.includes("all");
  const isTaskType = type.includes("tasks") || type.includes("all");

  return `${isUserType ? (isTaskType || isGoalType ? "users, " : "users") : ""}${isGoalType ? (isTaskType ? "goals, " : "goals") : ""}${
    isTaskType ? "tasks" : ""
  }`;
};

export const SearchBar = ({ className }: { className?: string }) => {
  const { getData, query, setQuery, params } = useSearch();
  const { type } = params;
  const debounce = useDebounce(() => getData({ offset: 0 }), 600);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await getData({ offset: 0 });
  };

  const reset = (e: FormEvent) => {
    e.preventDefault();
    setQuery("");
  };

  useEffect(() => {
    debounce();
  }, [query, debounce]);

  return (
    <form
      onSubmit={submit}
      onReset={reset}
      className={clsx(
        "form text-theme-reverse relative w-2/3 lg:w-1/2 h-[40px] flex items-center px-3 rounded-4xl transition-[border-radius] duration-500 ease bg-theme focus-within:rounded-[1px] inset-shadow-xs inset-shadow-gray/30",
        className
      )}
    >
      <button className="cursor-pointer border-none bg-none">
        <svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
          <path
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
            stroke="currentColor"
            strokeWidth="1.333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        className="text-[13px] md:text-[15px] bg-transparent size-full px-2 py-3 focus:outline-none focus-within:before:scale-100"
        placeholder={`Search ${searchItemTerms(type)}`}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className={clsx("reset border-none bg-none opacity-0 invisible cursor-pointer", query.trim() !== "" && "opacity-100 visible")}
        type="reset"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  );
};

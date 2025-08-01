import type { GoalData, SearchProfile, SearchType, TaskData, TError } from "@/types/types";
import callApi from "@/utils/callApi";
import { handleError } from "@/utils/errorHandler";
import { createContext, useState, type ReactNode } from "react";

export type SearchData = {
  isNext?: boolean;
  nextOffset?: number;
  profiles?: SearchProfile[];
  goals?: GoalData[];
  tasks?: TaskData[];
};

type TSearchContext = {
  data: SearchData;
  getData: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<SearchData>>;
  error: TError & { search: string };
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<TError & { search: string }>>;
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

type Params = { type: SearchType; offset: number };
const defaultParams = { type: "ALL", offset: 0 } as Params;

const SearchContext = createContext<TSearchContext>({
  data: { profiles: [], goals: [], tasks: [] },
  getData: async () => {},
  setData: () => {},
  error: { error: null, search: "" },
  clearError: () => {},
  setError: () => {},
  params: defaultParams,
  setParams: () => {},
  query: "",
  setQuery: () => {},
});

const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SearchData>({ profiles: [], goals: [], tasks: [] });
  const [error, setError] = useState<TError & { search: string }>({ error: null, search: "" });
  const [params, setParams] = useState<Params>(defaultParams);
  const [query, setQuery] = useState("");

  const getData = async () => {
    try {
      if (!query.trim()) return;
      const response = await callApi(`/search?query=${query}&type=${params.type}${params.offset ? `&offset=${params.offset}` : ""}`, {
        method: "GET",
      });
      setData(response.data);
    } catch (err) {
      handleError(err, setError);
    }
  };
  const clearError = () => setError({ error: null, search: "" });

  const contextValue: TSearchContext = {
    data,
    getData,
    setData,
    error,
    setError,
    clearError,
    params,
    setParams,
    query,
    setQuery,
  };

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export { SearchContext, SearchProvider };

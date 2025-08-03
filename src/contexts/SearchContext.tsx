import type { GoalData, SearchProfile, TaskData, TError } from "@/types/types";
import callApi from "@/utils/callApi";
import { handleFormError } from "@/utils/errorHandler";
import { createContext, useState, type ReactNode } from "react";

export type SearchData = {
  isNext?: boolean;
  nextOffset?: number;
  profiles?: SearchProfile[];
  goals?: GoalData[];
  tasks?: TaskData[];
  initiate?: boolean;
};

type GetDataProps = {
  type?: string;
  query?: string;
  offset?: number;
  recycled?: boolean;
};

type TSearchContext = {
  data: SearchData;
  getData: (options?: GetDataProps) => Promise<void>;
  getSequelProfile: (options?: Omit<GetDataProps, "type">) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<SearchData>>;
  error: TError & { search: string };
  clearError: () => void;
  setError: React.Dispatch<React.SetStateAction<TError & { search: string }>>;
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

type Params = { type: string };
const defaultParams: Params = { type: "all" };

const SearchContext = createContext<TSearchContext>({
  data: { profiles: [], goals: [], tasks: [] },
  getData: async () => {},
  getSequelProfile: async () => {},
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
  const [data, setData] = useState<SearchData>({ profiles: [], goals: [], tasks: [], initiate: true });
  const [error, setError] = useState<TError & { search: string }>({ error: null, search: "" });
  const [params, setParams] = useState<Params>(defaultParams);
  const [query, setQuery] = useState("");

  const fetch = async (options?: GetDataProps) => {
    const { type: optionType, offset: optionOffset, query: optionQuery, recycled } = options || {};
    if (!query.trim()) return;
    return await callApi(
      `/search?query=${optionQuery ?? query}&type=${optionType || params.type}&recycled=${!!recycled}${
        optionOffset ?? data.nextOffset ? `&offset=${optionOffset ?? data.nextOffset}` : ""
      }`,
      {
        method: "GET",
      }
    );
  };

  const getData = async (options?: GetDataProps) => {
    try {
      const response = await fetch({ ...options, offset: 0 });
      if (!response) return;
      setData(response.data);
    } catch (err) {
      handleFormError(err, setError);
    }
  };

  const getSequelProfile = async (options?: Omit<GetDataProps, "type">) => {
    try {
      const response = await fetch({ ...options, type: "profiles" });
      if (!response) return;
      const { data } = response;
      const { isNext, nextOffset } = data;
      setData((prev) => ({ ...prev, isNext, nextOffset, profiles: [...(prev.profiles || []), ...data.profiles] }));
    } catch (err) {
      handleFormError(err, setError);
    }
  };
  const clearError = () => setError({ error: null, search: "" });

  const contextValue: TSearchContext = {
    data,
    getData,
    getSequelProfile,
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

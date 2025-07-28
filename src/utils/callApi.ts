import axios from "axios";
import { codeAuthError } from "./errorHandler";
import { API_URL } from "@/App";
import { isIsoDateValid } from "./commonUtils";

type Options =
  | {
      method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
      body?: null | object;
      headers?: object;
      directToken?: boolean;
    }
  | undefined;

export const sanitizeDatesInObject = (obj: any) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }
    const value = obj[key];

    if (isIsoDateValid(value)) {
      obj[key] = new Date(value);
    } else if (Array.isArray(value)) {
      obj[key] = value.map((item) => sanitizeDatesInObject(item));
    } else if (typeof value === "object" && value !== null) {
      sanitizeDatesInObject(value);
    }
  }
  return obj;
};

export default async function callApi(endpoint: string = "", options: Options = { method: "GET", body: null, headers: {}, directToken: false }) {
  const apiURL = API_URL;
  const createdError = new Error();
  const callerLine = createdError.stack?.split("\n")[2];

  try {
    const response = await axios({
      method: options.method,
      url: `${apiURL}${endpoint}`,
      ...(options.body && { data: options.body }),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      withCredentials: true,
    });
    if (import.meta.env.VITE_ENV !== "production") {
      console.log(`Endpoint:\n${response.config.url?.slice(apiURL.length)}\n\nCalled by: ${callerLine?.trim()}\n\n`, response);
    }
    sanitizeDatesInObject(response.data);
    return response;
  } catch (error) {
    console.error("Error in API call:", error);
    if (options.directToken) {
      if (axios.isAxiosError(error) && codeAuthError.slice(1).includes(error.response?.data.code)) {
        window.location.href = "/signin";
      }
    }
    throw error as Error;
  }
}

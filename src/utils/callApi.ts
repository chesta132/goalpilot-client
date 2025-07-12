import axios from "axios";
import { codeAuthError } from "./errorHandler";

type Options =
  | {
      method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
      body?: null | object;
      headers?: object;
      directToken?: boolean;
    }
  | undefined;

export default async function callApi(endpoint: string = "", options: Options = { method: "GET", body: null, headers: {}, directToken: false }) {
  const apiURL = import.meta.env.VITE_API_URL_DEV;
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
    if (import.meta.env.VITE_ENV !== "production") console.log(`Endpoint:\n${response.config.url?.slice(apiURL.length)}\n`, response, "\n\n");
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

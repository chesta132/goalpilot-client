import axios from "axios";
import { codeAuthError } from "./defaultData";

type Options =
  | {
      method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
      body?: null | object;
      headers?: object;
      token?: boolean;
      directToken?: boolean;
    }
  | undefined;

export default async function callApi(
  endpoint: string = "",
  options: Options = { method: "GET", body: null, headers: {}, token: false, directToken: false }
) {
  const apiURL = import.meta.env.VITE_API_URL;
  const sessionToken = sessionStorage.getItem("jwt-token");
  const localToken = localStorage.getItem("jwt-token");
  // refactor kalo nanti backend migrate udh clear
  // if (options.directToken) {
  //   if (!localToken && !sessionToken && window.location.pathname !== "/signin" && window.location.pathname !== "/signup") {
  //     window.location.href = "/signin";
  //     return { data: { message: "Error Authentication" } };
  //   }
  // }
  // if (options.token) {
  //   if (!localToken && !sessionToken) throw { data: { message: "Authentication Needed", code: "INVALID_AUTH" } };
  // }
  try {
    const response = await axios({
      method: options.method,
      url: `${apiURL}${endpoint}`,
      ...(options.body && { data: options.body }),
      headers: {
        "Content-Type": "application/json",
        ...(options.token && { Authorization: `Bearer ${sessionToken || localToken}` }),
        ...options.headers,
      },
      withCredentials: true,
    });
    if (import.meta.env.VITE_ENV !== "production") console.log(`Endpoint:\n${response.config.url}\n`, response, '\n\n');
    return response;
  } catch (error) {
    console.error("Error in API call:", error);
    if (options.directToken) {
      if (axios.isAxiosError(error) && codeAuthError.includes(error.response?.data.code)) {
        return (window.location.href = "/signin");
      }
    }
    throw error;
  }
}

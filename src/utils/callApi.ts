import axios from "axios";

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
  if (options.directToken) {
    if (!localToken && !sessionToken && window.location.pathname !== '/signin') {
      window.location.href = "/signin";
      return { data: { message: "Error Authentication" } };
    }
  }
  if (options.token) {
    if (!localToken && !sessionToken) throw { data: { message: "Authentication Needed", code: "INVALID_AUTH" } };
  }
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
    });
    return response;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
}

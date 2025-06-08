import axios from "axios";

type Options =
  | {
      method: string;
      body?: null | object;
      headers?: object;
      token?: boolean;
    }
  | undefined;

export default async function callApi(endpoint: string = "", options: Options = { method: "GET", body: null, headers: {}, token: false }) {
  const apiURL = import.meta.env.VITE_API_URL;
  const sessionToken = sessionStorage.getItem("jwt-token");
  const localToken = localStorage.getItem("jwt-token");
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
    if (axios.isAxiosError(error) && error.response) throw error.response;
    else throw error;
  }
}

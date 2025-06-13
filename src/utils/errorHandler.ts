import axios, { AxiosError } from "axios";
import type { ApiErrorResponseData, ErrorWithValues, TError } from "./types"; // Import tipe yg udah kita buat

function isAxiosErrorWithResponseData(error: unknown): error is AxiosError<ApiErrorResponseData> {
  if (!axios.isAxiosError(error)) return false;
  if (!error.response || typeof error.response.data !== "object" || error.response.data === null) return false;
  const responseData = error.response.data as Partial<ApiErrorResponseData>;
  if (!("message" in responseData)) return false;
  return true;
}

export function handleError<T extends TError>(err: unknown, setError: React.Dispatch<React.SetStateAction<T>>) {
  if (isAxiosErrorWithResponseData(err)) {
    const responseData = err.response?.data;
    setError((prev) => ({ ...prev, error: { message: responseData?.message, title: err?.name, code: responseData?.code || err.code } } as T));
  } else if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
    setError((prev) => ({ ...prev, error: { title: err.message, message: "Network Error, please check your connection", code: err.code } } as T));
  } else if (axios.isAxiosError(err) && err.response?.data.code === "INVALID_AUTH")
    setError((prev) => ({ ...prev, error: { title: err.response?.data.message, message: err.response?.data.message, code: err.code } }));
  else {
    setError((prev) => ({ ...prev, error: { title: undefined, message: undefined } } as T));
  }
}

export function handleFormError<T extends ErrorWithValues>(err: unknown, setError: React.Dispatch<React.SetStateAction<T>>) {
  if (axios.isAxiosError(err) && err.response && err.response.data) {
    const responseData = err.response.data as ApiErrorResponseData;

    // email validation
    if (responseData.code === "EMAIL_NOT_FOUND" || responseData.code === "EMAIL_UNAVAILABLE") {
      setError((prev) => ({ ...prev, email: responseData.message } as T));
    }
    // password validation
    else if (responseData.code === "INCORRECT_PASSWORD") {
      setError((prev) => ({ ...prev, password: responseData.message } as T));
    }
    // username validation
    else if (responseData.code === "USERNAME_UNAVAILABLE") {
      setError((prev) => ({ ...prev, username: responseData.message } as T));
    } else {
      handleError(err, setError);
    }
  } else {
    handleError(err, setError);
  }
}

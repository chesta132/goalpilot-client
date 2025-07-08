import axios, { AxiosError } from "axios";
import type { ApiErrorResponseData, CodeAuthError, ErrorWithValues, TError } from "./types"; // Import tipe yg udah kita buat

export function handleError<T extends TError>(error: unknown, setError: React.Dispatch<React.SetStateAction<T>>) {
  const err = error as AxiosError<ApiErrorResponseData>;
  const data = err.response?.data;
  if (err.code === "ERR_NETWORK")
    setError((prev) => ({ ...prev, error: { title: err.message, message: "Network Error, please check your connection", code: data?.code } } as T));
  else if (data) {
    setError((prev) => ({ ...prev, error: { code: data.code, title: data.title, message: data.message } }));
  } else {
    setError(
      (prev) =>
        ({
          ...prev,
          error: {
            title: "Oops! Something went wrong",
            message: "We encountered an unexpected error. Please try again or contact support if the problem persists.",
          },
        } as T)
    );
  }
}

export function handleFormError<T extends ErrorWithValues>(err: unknown, setError: React.Dispatch<React.SetStateAction<T>>) {
  if (axios.isAxiosError(err) && err.response && err.response.data) {
    const responseData = err.response.data as ApiErrorResponseData;

    // email validation
    if (responseData.code === "INVALID_EMAIL_FIELD") {
      setError((prev) => ({ ...prev, email: responseData.message } as T));
    }
    // password validation
    else if (responseData.code === "INVALID_PASSWORD_FIELD") {
      setError((prev) => ({ ...prev, password: responseData.message } as T));
    }
    // username validation
    else if (responseData.code === "INVALID_USERNAME_FIELD") {
      setError((prev) => ({ ...prev, username: responseData.message } as T));
    } else {
      handleError(err, setError);
    }
  } else {
    handleError(err, setError);
  }
}

export const codeAuthError: CodeAuthError[] = [
  "INVALID_AUTH",
  "INVALID_JWT",
  "REFRESH_TOKEN_INVALID",
  "ACCESS_TOKEN_INVALID",
  "TOKEN_BLACKLISTED",
  "INVALID_ROLE",
  "INVALID_AUTH_METHODS",
];

export function errorAuthBool(error: TError): boolean {
  if (!error?.error?.code) return false;
  return codeAuthError.includes(error?.error?.code);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function errorHandler(err: unknown, setError: any) {
  interface ErrorResponse {
    code?: string;
    message: string;
    name?: string;
  }
  const response: ErrorResponse | undefined = (err as { data?: ErrorResponse })?.data;
  // email validation
  if (response?.code === "EMAIL_NOT_FOUND" || response?.code === "EMAIL_UNAVAILABLE") setError((prev: any) => ({ ...prev, email: response.message }));
  // password validation
  else if (response?.code === "INCORRECT_PASSWORD") setError((prev: any) => ({ ...prev, password: response.message }));
  // username validation
  else if (response?.code === "USERNAME_UNAVAILABLE") setError((prev: any) => ({ ...prev, username: response.message }));
  // non custom error
  else {
    setError((prev: any) => ({
      ...prev,
      error: { message: response?.message, title: response?.name, code: response?.code },
    }));
  }
}

import type { Values, ErrorWithValues } from "./types";

type DynamicConfig<T> = {
  [K in keyof T]?: boolean;
};

type Config = DynamicConfig<Values> & {
  regexEmail?: boolean;
  usernameSpace?: boolean;
  emailSpace?: boolean;
  usernameLowerCased?: boolean;
};

const validateForms = (value: Values, setError: React.Dispatch<React.SetStateAction<ErrorWithValues>>, config: Config): boolean => {
  let err = false;

  if (config.title && (value.title === undefined || value.title.trim() === "")) {
    setError((prev) => ({ ...prev, title: "Title is required" }));
    err = true;
  }
  if (config.description && (value.description === undefined || value.description.trim() === "")) {
    setError((prev) => ({ ...prev, description: "Description is required" }));
    err = true;
  }
  if (config.targetDate && (value.targetDate === undefined || value.targetDate === "")) {
    setError((prev) => ({ ...prev, targetDate: "Target Date is required" }));
    err = true;
  }
  if (config.email && (value.email === undefined || value.email.trim() === "")) {
    setError((prev) => ({ ...prev, email: "Email is required" }));
    err = true;
  }
  if (config.password && (value.password === undefined || value.password.trim() === "")) {
    setError((prev) => ({ ...prev, password: "Password is required" }));
    err = true;
  }
  if (config.username && (value.username === undefined || value.username.trim() === "")) {
    setError((prev) => ({ ...prev, username: "Username is required" }));
    err = true;
  }
  if (config.firstName && (value.firstName === undefined || value.firstName.trim() === "")) {
    setError((prev) => ({ ...prev, firstName: "First name is required" }));
    err = true;
    if ((config.color && value.color === undefined) || value.color?.trim() === "") {
      setError((prev) => ({ ...prev, color: "Color is required" }));
      err = true;
    }
  }
  if (config.regexEmail && value.email !== undefined && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.email)) {
    setError((prev) => ({ ...prev, email: "Please input a valid email" }));
    err = true;
  }
  if (config.usernameSpace && value.username !== undefined && value.username.includes(" ")) {
    setError((prev) => ({ ...prev, username: "Username can't have spaces" }));
    err = true;
  }
  if (config.emailSpace && value.email !== undefined && value.email.includes(" ")) {
    setError((prev) => ({ ...prev, email: "Email can't have spaces" }));
    err = true;
  }
  if (config.usernameLowerCased && value.username !== value.username?.toLowerCase()) {
    setError((prev) => ({ ...prev, username: "Username must be lowercased" }));
    err = true;
  }

  return err;
};

export default validateForms;

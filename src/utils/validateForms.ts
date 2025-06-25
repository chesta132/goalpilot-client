import type { TError, Values } from "./types";

type DynamicConfig<T> = {
  [K in keyof T]?: boolean;
};

type Config = DynamicConfig<Values> & {
  regexEmail?: boolean;
  usernameSpace?: boolean;
  usernameLowerCased?: boolean;
  titleMaxChar?: number;
  taskMaxChar?: number;
  descMaxChar?: number;
};

const validateForms = <T extends Partial<Values>>(value: T, setError: React.Dispatch<React.SetStateAction<T & TError>>, config: Config): boolean => {
  let err = false;

  // Title
  if (config.title && (value.title === undefined || value.title.trim() === "")) {
    setError((prev) => ({ ...prev, title: "Title is required" }));
    err = true;
  }
  // Description
  if (config.description && (value.description === undefined || value.description.trim() === "")) {
    setError((prev) => ({ ...prev, description: "Description is required" }));
    err = true;
  }
  // Target Date
  if (config.targetDate && (value.targetDate === undefined || value.targetDate === "")) {
    setError((prev) => ({ ...prev, targetDate: "Target Date is required" }));
    err = true;
  }
  // Email
  if (config.email && (value.email === undefined || value.email.trim() === "")) {
    setError((prev) => ({ ...prev, email: "Email is required" }));
    err = true;
  }
  // Password
  if (config.password && (value.password === undefined || value.password.trim() === "")) {
    setError((prev) => ({ ...prev, password: "Password is required" }));
    err = true;
  }
  // Username
  if (config.username && (value.username === undefined || value.username.trim() === "")) {
    setError((prev) => ({ ...prev, username: "Username is required" }));
    err = true;
  }
  // First Name
  if (config.firstName && (value.firstName === undefined || value.firstName.trim() === "")) {
    setError((prev) => ({ ...prev, firstName: "First name is required" }));
    err = true;
  }
  // Color
  if (config.color && (value.color === undefined || value.color?.trim() === "")) {
    setError((prev) => ({ ...prev, color: "Color is required" }));
    err = true;
  }
  // Task
  if (config.task && (value.task === undefined || value.task?.trim() === "")) {
    setError((prev) => ({ ...prev, task: "Task is required" }));
    err = true;
  }
  // Difficulty
  if (
    config.difficulty &&
    (value.difficulty === undefined || value.difficulty?.trim() === "" || !["easy", "medium", "hard", "very hard"].includes(value.difficulty.trim()))
  ) {
    setError((prev) => ({ ...prev, difficulty: "Please select a valid difficulty" }));
    err = true;
  }
  // Status
  if (config.status && (value.status === undefined || value.status?.trim() === "")) {
    setError((prev) => ({ ...prev, status: "Please select a valid status" }));
    err = true;
  }
  if (config.regexEmail && value.email !== undefined && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.email)) {
    // Email Regex
    setError((prev) => ({ ...prev, email: "Please input a valid email" }));
    err = true;
  }
  // Username spaces
  if (config.usernameSpace && value.username !== undefined && value.username.includes(" ")) {
    setError((prev) => ({ ...prev, username: "Username can't have spaces" }));
    err = true;
  }
  // Username is lowercased
  if (config.usernameLowerCased && value.username !== value.username?.toLowerCase()) {
    setError((prev) => ({ ...prev, username: "Username must be lowercased" }));
    err = true;
  }
  // Title max char
  if (config.titleMaxChar && value.title !== undefined && value.title.length > config.titleMaxChar) {
    setError((prev) => ({ ...prev, title: `Maximum title character is ${config.titleMaxChar}` }));
    err = true;
  }
  // Task max char
  if (config.taskMaxChar && value.task !== undefined && value.task.length > config.taskMaxChar) {
    setError((prev) => ({ ...prev, task: `Maximum task character is ${config.taskMaxChar}` }));
    err = true;
  }
  // Description max char
  if (config.descMaxChar && value.description !== undefined && value.description.length > config.descMaxChar) {
    setError((prev) => ({ ...prev, description: `Maximum description character is ${config.descMaxChar}` }));
    err = true;
  }

  return err;
};

export default validateForms;

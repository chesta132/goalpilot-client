import dayjs from "dayjs";
import type { GoalData } from "../types/types";

export const getBgByStatus = (status: GoalData["status"]) => {
  return status.toLowerCase() === "active"
    ? "bg-green-700/20 text-green-500!"
    : status.toLowerCase() === "pending"
    ? "bg-yellow-600/20 text-yellow-500!"
    : status.toLowerCase() === "paused" || status.toLowerCase() === "canceled"
    ? "bg-red-700/20 text-red-500!"
    : status.toLowerCase() === "completed" && "bg-green-500/20 text-green-500!";
};

export const isJSON = (item: any) => {
  try {
    JSON.parse(item);
    return true;
  } catch {
    return false;
  }
};

JSON.isJSON = isJSON;

export const getTimeLeftToDisplay = (timeLeft: number) => {
  const timeLeftMonthPlural = timeLeft >= 0 ? (Math.floor(timeLeft / 30) > 1 ? "s" : "") : Math.floor(Math.abs(timeLeft) / 30) > 1 ? "s" : "";
  const timeLeftYearPlural = timeLeft >= 0 ? (Math.floor(timeLeft / 365) > 1 ? "s" : "") : Math.floor(Math.abs(timeLeft) / 365) > 1 ? "s" : "";

  return timeLeft >= 0
    ? timeLeft === 0
      ? "Today"
      : timeLeft < 30
      ? `${timeLeft} day${timeLeft !== 1 ? "s" : ""} left`
      : timeLeft < 365 && timeLeft >= 30
      ? `${Math.floor(timeLeft / 30)} Month${timeLeftMonthPlural} left`
      : `${Math.floor(timeLeft / 365)} Year${timeLeftMonthPlural} left`
    : timeLeft > -30
    ? `${Math.abs(timeLeft)} day${Math.abs(timeLeft) !== 1 ? "s" : ""} ago`
    : timeLeft > -365 && timeLeft <= -30
    ? `${Math.floor(Math.abs(timeLeft) / 30)} Month${timeLeftYearPlural} ago`
    : `${Math.floor(Math.abs(timeLeft) / 365)} Year${timeLeftYearPlural} ago`;
};

Date.prototype.toFormattedString = function (optionsProp = { includeThisYear: true, includeHour: false }) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const hourOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  try {
    if (this.toString() === "Invalid Date") {
      return "Invalid Date";
    }
    const { includeHour, includeThisYear } = optionsProp;
    const formatter = new Intl.DateTimeFormat("en-US", includeHour ? { ...options, ...hourOptions } : options);
    const formattedDate = formatter.format(this);
    const thisYear = new Date().getFullYear().toString();

    if (formattedDate.includes(thisYear) && !includeThisYear) {
      const splittedDate = formattedDate.split(", " + thisYear);
      return splittedDate.join("");
    }

    return formattedDate;
  } catch (error) {
    console.error(error);
    return "Invalid Date";
  }
};

export const isIsoDateValid = (dateString: string | Date) => {
  const parsedDate = dayjs(dateString);
  return parsedDate.isValid() && dateString.toString().includes("T") && dateString.toString().includes("Z");
};

/**
 * Only pick some fields in object, other properties will deleted.
 *
 * @param data - Object to initiate.
 * @param picks - Keys of data to pick.
 * @returns The object with only picked properties.
 */
export const pick = <T extends Record<string, any>, Z extends (keyof T)[]>(data: T, picks?: Z): Pick<T, Z[number]> => {
  const pickedData = data;
  if (picks)
    for (const pick of Object.keys(data)) {
      if (!picks.includes(pick as keyof object)) {
        delete pickedData[pick as keyof object];
      }
    }
  return pickedData;
};

/**
 * Only omit some fields in object, other properties will remain.
 *
 * @param data - Object to initiate.
 * @param omits - Keys of data to omit.
 * @returns The object with omitted properties.
 */
export const omit = <T extends Record<string, any>, Z extends (keyof T)[]>(data: T, omits?: Z): Omit<T, Z[number]> => {
  const omittedData = data;
  if (omits)
    for (const omit of omits) {
      delete omittedData[omit];
    }
  return omittedData;
};

export const searchItemTerms = (type: string) => {
  const isUserType = type.includes("profiles") || type.includes("all");
  const isGoalType = type.includes("goals") || type.includes("all");
  const isTaskType = type.includes("tasks") || type.includes("all");

  return `${isUserType ? (isTaskType || isGoalType ? "users, " : "users") : ""}${isGoalType ? (isTaskType ? "goals, " : "goals") : ""}${
    isTaskType ? "tasks" : ""
  }`;
};

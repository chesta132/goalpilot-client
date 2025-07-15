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

Date.prototype.toFormattedString = function () {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  try {
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(this);
    return formattedDate;
  } catch (error) {
    console.error(error);
    return "Invalid Date";
  }
};

import type { GoalData } from "./types";

export const getBgByStatus = (status: GoalData["status"]) => {
  return status.toLowerCase() === "active"
    ? "bg-green-700"
    : status.toLowerCase() === "pending"
    ? "bg-yellow-600"
    : status.toLowerCase() === "paused" || status.toLowerCase() === "canceled"
    ? "bg-red-700"
    : status.toLowerCase() === "completed" && "bg-green-500 !text-black";
};

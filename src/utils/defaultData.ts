import type { Friend, FriendUser, GoalData, TaskData, TEditTaskValue, TNewGoalValue, TNewTaskValue, UserData } from "../types/types";

export const defaultTaskData: TaskData = {
  id: "",
  _id: "",
  goalId: "",
  task: "",
  description: "",
  isCompleted: false,
  completedAt: null,
  deletedAt: null,
  difficulty: "easy",
  isRecycled: false,
  targetDate: "",
  notification: undefined,
  createdAt: new Date(""),
  __v: 0,
};

export const defaultGoalData: GoalData = {
  id: "",
  _id: "",
  userId: "",
  title: "",
  description: "",
  createdAt: new Date(""),
  progress: 0,
  isPublic: false,
  status: "active",
  targetDate: new Date(""),
  tasks: [],
  color: "",
  isRecycled: false,
  deleteAt: null,
  notification: undefined,
  completedAt: new Date(""),
  __v: 0,
};

export const defaultUserData: UserData = {
  id: "",
  _id: "",
  username: "",
  fullName: "",
  email: "",
  createdAt: new Date(""),
  lastActive: new Date(""),
  goals: [],
  goalsCompleted: 0,
  tasksCompleted: 0,
  role: "user",
  __v: 0,
  status: "offline",
  timeToAllowSendEmail: new Date(""),
  verified: false,
};

export const defaultNewTaskError: TNewTaskValue = {
  task: "",
  description: "",
  targetDate: "",
  difficulty: "",
};

export const defaultNewTaskData: TNewTaskValue = {
  ...defaultNewTaskError,
  goalId: "",
};

export const defaultNewGoalData: TNewGoalValue = {
  title: "",
  description: "",
  color: "#66b2ff",
  targetDate: "",
  isPublic: true,
  status: JSON.parse(localStorage.getItem("settings") || "{}")?.defaultGoalStatus || "",
};

export const defaultEditTaskData: TEditTaskValue = {
  ...defaultNewTaskData,
  isCompleted: false,
};

export const defaultUserFriend: FriendUser = { _id: "", fullName: "", id: "", lastActive: new Date(""), status: "offline", username: "" };

export const defaultFriend: Friend = {
  _id: "",
  id: "",
  createdAt: new Date(""),
  friend: defaultUserFriend,
  user: defaultUserFriend,
  status: "PENDING",
  updatedAt: new Date(""),
};

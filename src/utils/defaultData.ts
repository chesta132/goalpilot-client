import type { GoalData, TaskData, TEditTaskValue, TNewGoalValue, TNewTaskValue, UserData } from "./types";

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
  rewardPoints: 0,
  targetDate: "",
  notification: undefined,
  createdAt: new Date(),
  __v: 0,
};

export const defaultGoalData: GoalData = {
  id: "",
  _id: "",
  userId: "",
  title: "",
  description: "",
  createdAt: new Date(),
  progress: 0,
  isPublic: false,
  status: "active",
  targetDate: null,
  tasks: [],
  color: "",
  isRecycled: false,
  deleteAt: null,
  notification: undefined,
  __v: 0,
};

export const defaultUserData: UserData = {
  id: "",
  _id: "",
  username: "",
  fullName: "",
  email: "",
  createdAt: new Date(),
  lastActive: new Date(),
  goals: [],
  goalsCompleted: 0,
  tasksCompleted: 0,
  level: 1,
  points: 0,
  role: "user",
  __v: 0,
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
};

export const defaultEditTaskData: TEditTaskValue = {
  ...defaultNewTaskData,
  isCompleted: false,
};

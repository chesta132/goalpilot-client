export type TSignIn = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type TSignUp = TSignIn & {
  username: string;
  firstName: string;
  lastName: string;
  rememberMe: boolean;
  verifyPassword: string;
};

export type TaskData = {
  id: string;
  _id: string;
  goalId: string;
  task: string;
  description: string;
  isCompleted: boolean;
  completedAt: Date | null;
  deletedAt: Date | null;
  difficulty: "easy" | "medium" | "hard" | "very hard" | "";
  isRecycled: boolean;
  rewardPoints: number;
  targetDate: string | Date;
  notification?: string;
  createdAt: Date;
  __v?: number;
};

export type GoalData = {
  id: string;
  _id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Date;
  progress: number;
  isPublic: boolean;
  status: "active" | "completed" | "paused" | "canceled" | "pending" | "";
  targetDate: Date | null;
  completedAt: Date | null;
  tasks: TaskData[];
  color: string;
  isRecycled: boolean;
  deleteAt: Date | null;
  notification?: string;
  __v?: number;
};

export type UserData = {
  id: string;
  _id: string;
  username: string;
  fullName: string;
  email: string;
  createdAt: Date;
  lastActive: Date;
  goals: GoalData[];
  goalsCompleted: number;
  tasksCompleted: number;
  level: number;
  points: number;
  role: "user" | "admin" | "tester";
  __v?: number;
};

export type TNewGoalValue = {
  title: string;
  description: string;
  targetDate: string;
  color: string;
  isPublic: boolean;
  status: GoalData["status"];
};

export type TNewTaskValue = {
  goalId?: string;
  task: string;
  description: string;
  targetDate: string;
  difficulty: "easy" | "medium" | "hard" | "very hard" | "";
};

export type TEditTaskValue = TNewTaskValue & { isCompleted?: boolean };

export type TNotification = {
  message: string;
  undoable?: boolean;
  id?: string;
};

export type TError = {
  error?: {
    title: string;
    message: string;
    code?: CodeError;
  } | null;
};

export type Values = {
  title: string;
  task: string;
  description: string;
  targetDate: Date | string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  color: string;
  difficulty: string;
  status: string;
  isCompleted: boolean;
  verifyPassword: string;
};

export type ErrorWithValues = TError & Partial<Values>;

export type ApiErrorResponseData = {
  code?: CodeError;
  message: string;
  title?: string;
};

export type CodeAuthError =
  | "INVALID_AUTH"
  | "INVALID_JWT"
  | "REFRESH_TOKEN_INVALID"
  | "ACCESS_TOKEN_INVALID"
  | "TOKEN_BLACKLISTED"
  | "INVALID_ROLE"
  | "INVALID_AUTH_METHODS";
export type CodeFieldError = "MISSING_FIELDS" | "INVALID_PASSWORD_FIELD" | "INVALID_EMAIL_FIELD" | "INVALID_USERNAME_FIELD";
export type CodeDatabaseError = "USER_NOT_FOUND" | "GOAL_NOT_FOUND" | "TASK_NOT_FOUND" | "VALIDATION_ERROR" | "VERSION_CONFLICT";

export type CodeError = CodeAuthError | CodeFieldError | CodeDatabaseError | "SERVER_ERROR" | "ERR_NETWORK" | "ERR_BAD_REQUEST";

export type OneFieldOnly<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    [P in K]: T[P];
  } & {
    [P in Exclude<keyof T, K>]?: never;
  };
}[keyof T];

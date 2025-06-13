export type TaskData = {
  _id: string;
  goalId: string;
  task: string;
  description: string;
  isCompleted: boolean;
  completedAt: Date | null;
  deletedAt: Date | null;
  difficulty: "easy" | "medium" | "hard" | "very hard";
  isRecycled: boolean;
  rewardPoints: number;
  targetDate: Date | null;
  notification?: string;
  __v?: number;
};

export type GoalData = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Date;
  progress: number;
  isPublic: boolean;
  status: string;
  targetDate: Date | null;
  tasks: TaskData[];
  color: string;
  isRecycled: boolean;
  deleteAt: Date | null;
  notification?: string;
  __v?: number;
};

export type UserData = {
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

export type TnewGoalValue = {
  title: string;
  description: string;
  targetDate: string;
  color: string;
  isPublic: boolean;
};

export type TNotification = {
  message: string;
  undoable?: boolean;
  id?: string;
};

export type TError = {
  error?: {
    title: string;
    message: string;
    code?: string;
  } | null;
};

export type Values = {
  title?: string;
  description?: string;
  targetDate?: Date | string;
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  color?: string;
};

export type ErrorWithValues = TError & Values;

export type ApiErrorResponseData = {
  code?: string;
  message: string;
  name?: string;
};

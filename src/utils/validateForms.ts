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

type ValidationRule<T> = {
  condition: (value: T, config: Config) => boolean | undefined | 0 | "";
  message: string | ((config: Config) => string);
};

type FieldValidations<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Validation rules configuration
const ValidationRules: FieldValidations<Values> = {
  title: [
    {
      condition: (value, config) => config.title && (!value || value.trim() === ""),
      message: "Title is required",
    },
    {
      condition: (value, config) => config.titleMaxChar && value && value.length > config.titleMaxChar,
      message: (config) => `Maximum title character is ${config.titleMaxChar}`,
    },
  ],
  description: [
    {
      condition: (value, config) => config.description && (!value || value.trim() === ""),
      message: "Description is required",
    },
    {
      condition: (value, config) => config.descMaxChar && value && value.length > config.descMaxChar,
      message: (config) => `Maximum description character is ${config.descMaxChar}`,
    },
  ],
  targetDate: [
    {
      condition: (value, config) => config.targetDate && (!value || value === ""),
      message: "Target Date is required",
    },
  ],
  email: [
    {
      condition: (value, config) => config.email && (!value || value.trim() === ""),
      message: "Email is required",
    },
    {
      condition: (value, config) => config.regexEmail && value && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
      message: "Please input a valid email",
    },
  ],
  password: [
    {
      condition: (value, config) => config.password && (!value || value.trim() === ""),
      message: "Password is required",
    },
  ],
  username: [
    {
      condition: (value, config) => config.username && (!value || value.trim() === ""),
      message: "Username is required",
    },
    {
      condition: (value, config) => config.usernameSpace && value && value.includes(" "),
      message: "Username can't have spaces",
    },
    {
      condition: (value, config) => config.usernameLowerCased && value && value !== value.toLowerCase(),
      message: "Username must be lowercased",
    },
  ],
  firstName: [
    {
      condition: (value, config) => config.firstName && (!value || value.trim() === ""),
      message: "First name is required",
    },
  ],
  color: [
    {
      condition: (value, config) => config.color && (!value || value?.trim() === ""),
      message: "Color is required",
    },
  ],
  task: [
    {
      condition: (value, config) => config.task && (!value || value?.trim() === ""),
      message: "Task is required",
    },
    {
      condition: (value, config) => config.taskMaxChar && value && value.length > config.taskMaxChar,
      message: (config) => `Maximum task character is ${config.taskMaxChar}`,
    },
  ],
  difficulty: [
    {
      condition: (value, config) =>
        config.difficulty && (!value || value?.trim() === "" || !["easy", "medium", "hard", "very hard"].includes(value.trim())),
      message: "Please select a valid difficulty",
    },
  ],
  status: [
    {
      condition: (value, config) => config.status && (!value || value?.trim() === ""),
      message: "Please select a valid status",
    },
  ],
};

const validateForms = <T extends Partial<Values>>(value: T, setError: React.Dispatch<React.SetStateAction<T & TError>>, config: Config): boolean => {
  let hasError = false;
  const errors: Partial<T & TError> = {};

  for (const [fieldName, fieldValue] of Object.entries(value)) {
    const fieldRules = ValidationRules[fieldName as keyof Values];

    if (!fieldRules) continue;

    for (const rule of fieldRules) {
      // @ts-expect-error value is not never
      if (rule.condition(fieldValue, config)) {
        const message = typeof rule.message === "function" ? rule.message(config) : rule.message;
        // @ts-expect-error fieldName is T & TError
        errors[fieldName] = message;
        hasError = true;
        break;
      }
    }
  }

  if (hasError) {
    setError((prev) => ({ ...prev, ...errors }));
  }

  return hasError;
};

export default validateForms;

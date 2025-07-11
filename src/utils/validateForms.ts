import { difficultyOptions, statusOptions } from "./selectOptions";
import type { OneFieldOnly, TError, Values } from "./types";

type MinMax = { max?: number; min?: number };

export type DynamicConfigSetup<T> = {
  [K in keyof T]?: boolean | MinMax;
};

export type MinMaxKey = "title" | "description" | "password" | "task";
export type CustomRule = "email" | "username";

export type Config<T extends Partial<Values> = Values> = Record<keyof Pick<T, MinMaxKey>, boolean | MinMax> &
  Record<keyof Omit<T, MinMaxKey>, boolean>;

export type DynamicConfig<T = Config> = Partial<
  Omit<T, CustomRule> & {
    email?: boolean | { regex?: boolean };
    username?: boolean | { noSpace?: boolean; isLower?: boolean };
  }
>;

type ValidationRule<T> = {
  condition: (value: T, config: DynamicConfig, allValue?: Partial<Values>) => boolean;
  message: string | ((config: DynamicConfig) => string);
};

type FieldValidations<T> = {
  [K in keyof Omit<T, "isCompleted">]?: ValidationRule<T[K]>[];
};

// Validation rules configuration
export const ValidationRules: FieldValidations<Values> = {
  title: [
    {
      condition: (value, config) => !!config.title && (!value || value.trim() === ""),
      message: "Title is required",
    },
    {
      condition: (value, config) => typeof config.title !== "boolean" && !!config.title?.max && value.length > config.title.max,
      message: (config) => `Maximum title character is ${typeof config.title !== "boolean" && config.title?.max}`,
    },
    {
      condition: (value, config) => typeof config.title !== "boolean" && !!config.title?.min && value.length < config.title.min,
      message: (config) => `Minimum title character is ${typeof config.title !== "boolean" && config.title?.min}`,
    },
  ],
  description: [
    {
      condition: (value, config) => !!config.description && (!value || value.trim() === ""),
      message: "Description is required",
    },
    {
      condition: (value, config) => typeof config.description !== "boolean" && !!config.description?.max && value.length > config.description?.max,
      message: (config) => `Maximum description character is ${typeof config.description !== "boolean" && config.description?.max}`,
    },
    {
      condition: (value, config) => typeof config.description !== "boolean" && !!config.description?.min && value.length < config.description?.min,
      message: (config) => `Minimum description character is ${typeof config.description !== "boolean" && config.description?.min}`,
    },
  ],
  targetDate: [
    {
      condition: (value, config) => !!config.targetDate && (!value || value === ""),
      message: "Target Date is required",
    },
  ],
  email: [
    {
      condition: (value, config) => !!config.email && (!value || value.trim() === ""),
      message: "Email is required",
    },
    {
      condition: (value, config) =>
        typeof config.email !== "boolean" && !!config.email?.regex && !!value && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
      message: "Please input a valid email",
    },
  ],
  password: [
    {
      condition: (value, config) => !!config.password && (!value || value.trim() === ""),
      message: "Password is required",
    },
    {
      condition: (value, config) => typeof config.password !== "boolean" && !!config.password?.max && value.length > config.password?.max,
      message: (config) => `Maximum password character is ${typeof config.password !== "boolean" && config.password?.max}`,
    },
    {
      condition: (value, config) => typeof config.password !== "boolean" && !!config.password?.min && value.length < config.password?.min,
      message: (config) => `Minimum password character is ${typeof config.password !== "boolean" && config.password?.min}`,
    },
  ],
  verifyPassword: [
    {
      condition: (value, config, allValue) => !!config.verifyPassword && !!allValue && value !== allValue.password,
      message: "Password is not match",
    },
  ],
  username: [
    {
      condition: (value, config) => !!config.username && (!value || value.trim() === ""),
      message: "Username is required",
    },
    {
      condition: (value, config) => typeof config.username !== "boolean" && !!config.username?.noSpace && !!value && value.includes(" "),
      message: "Username can't have spaces",
    },
    {
      condition: (value, config) => typeof config.username !== "boolean" && !!config.username?.isLower && !!value && value !== value.toLowerCase(),
      message: "Username must be lowercased",
    },
  ],
  firstName: [
    {
      condition: (value, config) => !!config.firstName && (!value || value.trim() === ""),
      message: "First name is required",
    },
  ],
  color: [
    {
      condition: (value, config) => !!config.color && (!value || value?.trim() === ""),
      message: "Color is required",
    },
  ],
  task: [
    {
      condition: (value, config) => !!config.task && (!value || value?.trim() === ""),
      message: "Task is required",
    },
    {
      condition: (value, config) => typeof config.task !== "boolean" && !!config.task?.max && !!value && value.length > config.task?.max,
      message: (config) => `Maximum task character is ${typeof config.task !== "boolean" && config.task?.max}`,
    },
    {
      condition: (value, config) => typeof config.task !== "boolean" && !!config.task?.min && !!value && value.length < config.task?.min,
      message: (config) => `Minimum task character is ${typeof config.task !== "boolean" && config.task?.min}`,
    },
  ],
  difficulty: [
    {
      condition: (value, config) => !!config.difficulty && (!value || value.trim() === "" || !difficultyOptions.includes(value.trim())),
      message: "Please select a valid difficulty",
    },
  ],
  status: [
    {
      condition: (value, config) => !!config.status && (!value || value.trim() === "" || !statusOptions.includes(value.trim())),
      message: "Please select a valid status",
    },
  ],
};

const validateForms = <T extends Partial<Values>>(
  value: T,
  setError: React.Dispatch<React.SetStateAction<T & TError>>,
  config: DynamicConfig
): boolean => {
  let hasError = false;
  const errors: Partial<Values & TError> = {};

  for (const [fieldName, fieldValue] of Object.entries(value)) {
    const fieldRules = ValidationRules[fieldName as keyof Omit<Values, "isCompleted">];

    if (!fieldRules) continue;

    for (const rule of fieldRules) {
      if (rule.condition(fieldValue.toString(), config, value)) {
        const message = typeof rule.message === "function" ? rule.message(config) : rule.message;
        errors[fieldName as keyof Omit<Values, "isCompleted">] = message;
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

export const validateField = <T extends Partial<Values>>(value: T, config?: DynamicConfig, allValue?: T) => {
  const errors: Partial<Record<keyof T, string>> = {};
  if (!config) config = {};
  
  for (const [fieldName, fieldValue] of Object.entries(value)) {
    if (config[fieldName as keyof DynamicConfig] === undefined) {
      config[fieldName as keyof DynamicConfig] = true;
    }
    
    const fieldRules = ValidationRules[fieldName as keyof Omit<Values, "isCompleted">];
    if (!fieldRules) continue;
    
    for (const rule of fieldRules) {
      if (rule.condition(fieldValue.toString(), config, allValue)) {
        console.log(value);
        const message = typeof rule.message === "function" ? rule.message(config) : rule.message;
        errors[fieldName as keyof T] = message;
        break;
      }
    }
  }
  return errors;
};

export const handleChangeAndValidate = <T, Z extends Partial<T> & TError>(
  valueProp: OneFieldOnly<Partial<T>>,
  error: Z,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  setError: React.Dispatch<React.SetStateAction<Z>>,
  config?: DynamicConfig,
  allValue?: Partial<Values>
) => {
  const value = Object.values(valueProp!)[0] as T[keyof T];
  const field = Object.keys(valueProp!)[0] as keyof T;
  setValue((prev) => ({ ...prev, [field]: value }));
  if (error[field]) setError((prev) => ({ ...prev, [field]: "" }));
  const errorOnValidate = validateField({ [field]: value }, config, allValue);
  if (errorOnValidate[field as keyof Values]) {
    setError((prev) => ({ ...prev, [field]: errorOnValidate[field as keyof Values] }));
  }
};

export default validateForms;

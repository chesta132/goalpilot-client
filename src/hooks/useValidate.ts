import type { OneFieldOnly, TError, Values } from "@/utils/types";
import validateForms, { handleChangeAndValidate, type Config, type DynamicConfig } from "@/utils/validateForms";
import { useCallback } from "react";

const useValidate = <T>(
  values: Partial<Values>,
  error: T & TError,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  setError: React.Dispatch<React.SetStateAction<T & TError>>,
) => {
  const handleChangeForm = useCallback(
    // @ts-expect-error [keyof Z] can't be used on DynamicConfig<Config<Z>>
    <Z extends Partial<T>>(value: OneFieldOnly<Z>, configProp?: DynamicConfig<Config<Z>>[keyof Z]) => {
      type C = DynamicConfig<Config<Z>>;
      const config: Partial<C> = { [Object.keys(value)[0]]: configProp } as Partial<C>;
      return handleChangeAndValidate<T, T & TError>(value as OneFieldOnly<Partial<T>>, error, setValue, setError, config, values);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [error, values]
  );

  const validateForm = useCallback((value: T & {}, config: DynamicConfig) => {
    return validateForms<T & {}>(value, setError, config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { handleChangeForm, validateForm };
};

export default useValidate;

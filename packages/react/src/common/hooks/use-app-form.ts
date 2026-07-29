import { useForm, type FormErrors, type UseFormInput, type UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import type { z } from 'zod';

import { getAppErrorFieldErrors, getAppErrorMessage } from '../util/get-app-error-field-errors';

/**
 * Builds a Mantine `validate` function from a Zod schema. Issue paths are
 * dot-joined so they line up with Mantine's nested field keys (and with the
 * server's {@link FieldError} paths), keeping one source of truth for shapes.
 */
export function zodResolver<Values>(schema: z.ZodType): (values: Values) => FormErrors {
  return (values) => {
    const result = schema.safeParse(values);
    const out: FormErrors = {};

    if (result.success) {
      return out;
    }

    for (const issue of result.error.issues) {
      const path = issue.path.map((segment) => String(segment)).join('.');

      if (!(path in out)) {
        out[path] = issue.message;
      }
    }

    return out;
  };
}

export type UseAppFormInput<Values> = Omit<UseFormInput<Values>, 'validate'> & {
  /** Zod schema used to validate the form on submit/blur. */
  schema?: z.ZodType;
  validate?: UseFormInput<Values>['validate'];
};

export type UseAppFormReturn<Values> = UseFormReturnType<Values> & {
  /**
   * Maps an error from a mutation onto the form: field-scoped errors land on
   * their fields, and a toast always surfaces the message.
   */
  handleError: (error: unknown) => void;
};

export function useAppForm<Values extends Record<string, unknown>>(
  input: UseAppFormInput<Values>,
): UseAppFormReturn<Values> {
  const { schema, validate, ...rest } = input;

  const form = useForm<Values>({
    ...rest,
    validate: validate ?? (schema ? zodResolver<Values>(schema) : undefined),
  });

  const handleError = (error: unknown) => {
    const fieldErrors = getAppErrorFieldErrors(error);

    for (const fieldError of fieldErrors) {
      if (fieldError.path) {
        form.setFieldError(fieldError.path, fieldError.message);
      }
    }

    notifications.show({ color: 'red', message: getAppErrorMessage(error) });
  };

  return Object.assign(form, { handleError });
}

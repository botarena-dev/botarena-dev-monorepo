import { ZodError } from "zod";

export const formatValidationError = (error: ZodError) => {
  return {
    validation: error.issues.reduce<Record<string, string[]>>((acc, curr) => {
      const path = curr.path.join(".");

      if (!acc[path]) {
        acc[path] = [];
      }

      acc[path].push(curr.message);

      return acc;
    }, {}),
  };
};

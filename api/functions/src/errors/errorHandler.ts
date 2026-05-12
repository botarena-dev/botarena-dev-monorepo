import { ZodError } from "zod";

import { formatValidationError } from "@/errors/formatValidationError";

import type { Action, ActionResponse } from "@/io/action.type";

export const errorHandler = (
  err: Error,
  req: Action<any>,
  res: ActionResponse,
  next: any,
) => {
  console.error(err);

  if (err instanceof ZodError) {
    const validationError = formatValidationError(err);

    return res.status(400).json({ error: validationError });
  }

  //TODO: Implement proper error handling
  res.status(400).json({
    error: "Internal Server Error",
  });
};

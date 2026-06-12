import { ZodError } from "zod";

import { formatValidationError } from "@/errors/formatValidationError";

import type { Action } from "@/io/action.type";
import type { Response } from "express";

export const errorHandler = (
  err: Error,
  req: Action<any>,
  res: Response,
  next: any,
) => {
  if (err instanceof ZodError) {
    const validationError = formatValidationError(err);

    return res.status(400).json({ error: validationError });
  }

  //TODO: Implement proper error handling
  res.status(400).json({
    error: "Internal Server Error",
  });
};

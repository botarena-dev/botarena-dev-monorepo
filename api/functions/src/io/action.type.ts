import type { Request, Response } from "express";

type ActionBody<T> = {
  action: { name: string };
  input: { arg1: T };
  session_variables: {
    "x-hasura-role": string;
    "x-hasura-user-id": string;
  };
};

export type Action<T> = Request<any, any, ActionBody<T>>;

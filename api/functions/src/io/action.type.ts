import type { Request, Response } from "express";

type ActionBody<T> = {
  action: { name: string };
  input: { args: T };
  session_variables: {
    "x-hasura-role": string;
    "x-hasura-user-id": string;
  };
};

export type Action<T> = Request<any, any, ActionBody<T>>;

export type ActionResponseBody<T> = {
  data?: T;
  error?: any;
};

export type ActionResponse<T = undefined> = Response<ActionResponseBody<T>>;

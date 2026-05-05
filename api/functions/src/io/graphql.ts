import { createClient, fetchExchange } from "@urql/core";

export const client = createClient({
  url: process.env.HASURA_GRAPHQL_ENDPOINT || "",
  preferGetMethod: false,
  exchanges: [fetchExchange],
  fetchOptions: () => {
    const headers = {
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "",
    };
    return {
      headers,
    };
  },
});

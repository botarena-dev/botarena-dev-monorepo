import {
  createClient,
  errorExchange,
  fetchExchange,
  mapExchange,
} from "@urql/core";

export const client = createClient({
  url: process.env.HASURA_GRAPHQL_ENDPOINT || "",
  preferGetMethod: false,
  exchanges: [
    mapExchange({
      onError: (error) => {
        console.error(error.graphQLErrors.map((e) => e.message).join("\n"));

        throw new Error("GraphQL error");
      },
    }),
    fetchExchange,
  ],
  fetchOptions: () => {
    const headers = {
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "",
    };
    return {
      headers,
    };
  },
});

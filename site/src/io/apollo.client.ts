import { ApolloClient } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

import { useAuthStore } from "../auth/stores/auth-store";

const httpLink = new HttpLink({ uri: "http://localhost:4001/v1/graphql" });

const authLink = new SetContextLink(({ headers }) => {
  console.log(useAuthStore.getState());
  const token = useAuthStore.getState().token;

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

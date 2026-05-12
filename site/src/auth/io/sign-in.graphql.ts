import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  query signIn($email: String!, $password: String!) {
    signIn(arg1: { email: $email, password: $password }) {
      accessToken
    }
  }
`;

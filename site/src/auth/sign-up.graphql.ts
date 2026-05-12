import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation signUp($email: String!, $password: String!, $nickname: String!) {
    signUp(arg1: { email: $email, password: $password, nickname: $nickname }) {
      id
    }
  }
`;

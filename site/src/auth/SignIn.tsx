import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { useLazyQuery } from "@apollo/client/react/compiled";

import { SIGN_IN } from "./io/sign-in.graphql";
import { useAuthStore } from "./stores/auth-store";
import { USERS } from "./io/users.graphql";

import type { User } from "./types/user.type";

interface SignInInput {
  email: string;
  password: string;
}

export const SignIn = () => {
  const { register, handleSubmit } = useForm<SignInInput>();

  const { setToken, setUser } = useAuthStore();

  const [signIn] = useLazyQuery<{ signIn: { accessToken: string } }>(SIGN_IN);

  const [users] = useLazyQuery<{ users: User[] }>(USERS);

  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/home";

  const onSubmit = async (data: SignInInput) => {
    const signInResponse = await signIn({
      variables: { email: data.email, password: data.password },
    });

    if (signInResponse?.data?.signIn?.accessToken) {
      setToken(signInResponse?.data?.signIn.accessToken);

      const usersResponse = await users();

      if (usersResponse?.data?.users[0]) {
        setUser(usersResponse?.data?.users[0]);

        navigate(from, { replace: true });
      }
    }
  };

  return (
    <Paper
      sx={{
        height: "100% ",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Box>LOGO</Box>

      <Typography
        variant="h3"
        component="h3"
        color="textPrimary"
        sx={{ textAlign: "center" }}
      >
        Sign In to Bot Arena
      </Typography>
      <TextField label="Email" placeholder="Email" {...register("email")} />
      <TextField
        label="Password"
        placeholder="Password"
        type="password"
        {...register("password")}
      />
      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit(onSubmit)}
      >
        Sign In
      </Button>
      <Typography variant="body2" color="textSecondary">
        Don't have an account? <Link to="/sign-up">Sign Up</Link>
      </Typography>
    </Paper>
  );
};

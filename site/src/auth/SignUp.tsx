import { useMutation } from "@apollo/client/react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { SIGN_UP } from "./io/sign-up.graphql";

type SignUpInput = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
};

export const SignUp = () => {
  const { register, handleSubmit } = useForm<SignUpInput>();

  const [signUp] = useMutation(SIGN_UP);

  const navigate = useNavigate();

  const onSubmit = async (data: SignUpInput) => {
    await signUp({
      variables: {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      },
    });

    navigate("/home");
  };

  return (
    <Paper
      sx={{
        height: "100% ",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box sx={{ flex: "1 1 auto" }}>INSANELY GOOD SIDE GRAPHICS</Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          gap: 2,
          flex: "1 1 auto",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          color="textPrimary"
          sx={{ textAlign: "center" }}
        >
          Sign Up for Bot Arena
        </Typography>

        <TextField label="Email" placeholder="Email" {...register("email")} />
        <TextField
          label="Password"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        <TextField
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          {...register("confirmPassword")}
        />

        <TextField
          label="Nickname"
          placeholder="Nickname"
          {...register("nickname")}
        />
        <Button variant="contained" color="success" type="submit">
          Create Account
        </Button>
      </Box>
    </Paper>
  );
};

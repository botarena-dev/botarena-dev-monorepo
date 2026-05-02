import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router";

export const SignIn = () => {
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
      <TextField label="Username" placeholder="Username" />
      <TextField label="Password" placeholder="Password" type="password" />
      <Button variant="contained" color="success">
        Sign In
      </Button>
      <Typography variant="body2" color="textSecondary">
        Don't have an account? <Link to="/sign-up">Sign Up</Link>
      </Typography>
    </Paper>
  );
};

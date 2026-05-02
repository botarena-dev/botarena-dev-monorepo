import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router";

export const SignUp = () => {
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

        <TextField label="Email" placeholder="Email" />
        <TextField label="Password" placeholder="Password" type="password" />
        <TextField
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
        />
        <TextField label="Nickname" placeholder="Nickname" />
        <Button variant="contained" color="success">
          Create Account
        </Button>
      </Box>
    </Paper>
  );
};

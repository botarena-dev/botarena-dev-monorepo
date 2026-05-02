import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, Outlet } from "react-router";

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ mr: 4 }}>
              LOGO
            </Typography>

            <Button component={Link} to="/about" color="text">
              About
            </Button>
            <Button component={Link} to="/contribute" color="text">
              Contribute
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button component={Link} to="/sign-in" color="text">
              Sign In
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/sign-up"
              color="text"
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "background.default",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

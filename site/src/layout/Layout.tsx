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
          <Typography variant="h6">Bot Arena</Typography>

          <Box>
            <Button component={Link} to="/about" color="text">
              About
            </Button>
            <Button component={Link} to="/contribute" color="text">
              Contribute
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

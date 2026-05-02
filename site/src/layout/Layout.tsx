import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <Button variant="text" color="text">
            text
          </Button>
          <Button variant="outlined">outlined</Button>
          <Button variant="contained">contained</Button>
          <Button variant="outlined" color="text">
            outlined text
          </Button>
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

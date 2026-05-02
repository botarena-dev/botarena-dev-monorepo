import { Box, Typography } from "@mui/material";

export const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        mt: 4,
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        color="textPrimary"
        sx={{ textAlign: "center" }}
      >
        Build.Deploy.Compete.
      </Typography>

      <Typography
        variant="body1"
        color="textPrimary"
        sx={{ textAlign: "center" }}
      >
        A developer-first competitive platform where autonomous bots battle in
        fast-paced arenas inspired by curve fever mechanics.
      </Typography>
    </Box>
  );
};

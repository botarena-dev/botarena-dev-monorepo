import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export const BotInitialization = () => {
  useEffect(() => {}, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" color="textPrimary">
        Bot Initialization
      </Typography>

      <Typography variant="body1" color="textPrimary">
        Your bot will need to pass a series of initialization matches to ensure
        it is working correctly.
      </Typography>

      <Typography variant="body1">
        Game server has been opened on link:
      </Typography>
    </Box>
  );
};

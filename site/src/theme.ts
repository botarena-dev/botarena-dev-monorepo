import { alpha } from "@mui/material";

import type { ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    text: true;
  }
}

const black = "#000000";
const white = "#ffffff";

export const themeObj: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#7C3AED",
      dark: "#5B21B6",
      light: "#C4A8F0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9D6FC7",
      dark: "#6D3A9E",
      light: "#D8C4F0",
      contrastText: "#ffffff",
    },
    error: {
      main: "#E11D75",
      dark: "#9D174D",
      light: "#F8A4C8",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#F59E0B",
      dark: "#B45309",
      light: "#FDE68A",
      contrastText: "#1a1a1a",
    },
    success: {
      main: "#16A34A",
      dark: "#14532D",
      light: "#86EFAC",
      contrastText: "#ffffff",
    },
    info: {
      main: "#8B5CF6",
      dark: "#6D28D9",
      light: "#C4B5FD",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#E2D4FF",
      secondary: alpha("#E2D4FF", 0.6),
    },
    common: {
      white: white,
      black: black,
    },
    background: {
      default: "#0D0618",
      paper: "#130824",
    },
  },
  typography: {
    fontFamily: "'Source Sans Pro', sans-serif;",
    fontWeightRegular: 500,
    fontWeightMedium: 700,
    fontWeightLight: 300,
    fontWeightBold: 900,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      lineHeight: 1,
    },
    h4: { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 },
    h5: { fontSize: "1.33rem", fontWeight: 700, lineHeight: 1 },
    h6: { fontSize: "1.25rem", fontWeight: 700, lineHeight: 1 },
    body1: { fontSize: "1rem", fontWeight: 500 },
    caption: { fontSize: "rem", color: alpha(black, 0.4) },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#130824",
          borderBottom: "1px solid #2D1B4E",
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { color: "text" },
          style: (theme) => ({
            color: theme.theme.palette.text.primary,
            borderColor: `1px solid ${theme.theme.palette.text.primary}`,
            ":hover": {
              backgroundColor: alpha(theme.theme.palette.text.secondary, 0.1),
              borderColor: theme.theme.palette.text.secondary,
            },
          }),
        },
      ],
    },
  },
};

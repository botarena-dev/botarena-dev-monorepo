import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@apollo/client/react";

import App from "./App.tsx";
import { themeObj } from "./theme.ts";
import { apolloClient } from "./io/apollo.client.ts";

import "./index.css";

const theme = createTheme(themeObj);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

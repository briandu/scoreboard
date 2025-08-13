"use client";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function AppThemeProvider({ children }) {
  const theme = createTheme({
    typography: {
      fontFamily: "Arial, Helvetica, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}



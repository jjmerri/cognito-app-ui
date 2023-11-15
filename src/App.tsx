import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthProvider from "./providers/AuthProvider";
import AppRouter from "./components/AppRouter/AppRouter";

const theme = createTheme({
  palette: {
    primary: {
      main: "#13752f",
    },
    secondary: {
      main: "#f58e00",
    },
  },
});

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </AuthProvider>
  );
}

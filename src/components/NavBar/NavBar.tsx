import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {
  const { loggedIn, logoutUser } = useAuth();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >
            CognitoApp
          </Typography>
          {!loggedIn ? (
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
          ) : (
            <Button
              component={Link}
              to="/"
              onClick={logoutUser}
              color="inherit"
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

import queryString from "query-string";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Alert from "../../components/Alert/Alert";
import ConfirmRegistrationModal from "../../components/modals/ConfirmRegistrationModal/ConfirmRegistrationModal";

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { control, handleSubmit, getValues } = useForm();
  const { registerUser, loggedIn } = useAuth();
  const [registerErr, setRegisterErr] = useState<string>();
  const [alertMessage, setAlertMessage] = useState<string>();
  const [confirming, setConfirming] = useState<boolean>(false);
  useState<string>();

  const theme = useTheme();

  const handleRegister = async (values: FieldValues) => {
    setRegisterErr(undefined);
    try {
      await registerUser(values.email, values.password);
      setAlertMessage(
        "Registration successful. Please check your email for a verification link."
      );
      setConfirming(true);
    } catch (err) {
      setRegisterErr((err as Error).message);
    }
  };

  const confirmRegistrationHandleClose = () => {
    setConfirming(false);
  };

  const handleConfirmRegistration = () => {
    setConfirming(false);
    navigate("/login?status=registration-success");
  };

  useEffect(() => {
    const queryParams = queryString.parse(location.search);

    if (loggedIn && queryParams.redirect) {
      navigate(queryParams.redirect.toString());
    }
  }, [loggedIn, navigate, location.search]);

  return (
    <>
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{
            mt: 2,
            mb: 3,
            pl: 2,
            paddingRight: 2,
            paddingBottom: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box mt={2}>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
          </Box>
          <Box mr={4}>
            <Alert show={!!registerErr} severity="error">
              {registerErr}
            </Alert>
            <Alert show={!!alertMessage} severity="success">
              {alertMessage}
            </Alert>
          </Box>
          <form onSubmit={handleSubmit(handleRegister)}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoComplete="email"
                  autoFocus
                  error={!!fieldState.error}
                  fullWidth
                  helperText={fieldState.error?.message?.toString()}
                  id="email"
                  inputProps={{
                    autoCapitalize: "none",
                    autoCorrect: "off",
                  }}
                  label="Email"
                  margin="normal"
                  name="email"
                  variant="outlined"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoComplete="password"
                  error={!!fieldState.error}
                  fullWidth
                  helperText={fieldState.error?.message?.toString()}
                  id="password"
                  label="Password"
                  margin="normal"
                  name="password"
                  type="password"
                  variant="outlined"
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginBottom: "1rem" }}
            >
              SIGN UP
            </Button>
          </form>
          <Grid container style={{ textAlign: "center" }}>
            <Grid item style={{ width: "100%", marginBottom: "1rem" }}>
              <Divider />
            </Grid>
            <Grid item style={{ width: "100%", marginBottom: "1rem" }}>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                Already have an account? Log in.
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <ConfirmRegistrationModal
        isOpen={confirming}
        handleClose={confirmRegistrationHandleClose}
        handleConfirmRegistrationSuccess={handleConfirmRegistration}
        email={getValues("email")}
      />
    </>
  );
};

export default RegistrationPage;

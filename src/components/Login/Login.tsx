import queryString from "query-string";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../Alert/Alert";
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
import { AwsLoginError, AwsLoginResult } from "../../providers/AuthProvider";
import ConfirmRegistrationModal from "../modals/ConfirmRegistrationModal/ConfirmRegistrationModal";
import FormModal from "../modals/FormModal/FormModal";
import ForgotPasswordForm from "../../Forms/ForgotPasswordForm";
import ResetPasswordForm from "../../Forms/ResetPasswordForm";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { control, handleSubmit, getValues } = useForm();
  const {
    loginUser,
    loggedIn,
    resendConfirmationCode,
    sendForgotPasswordEmail,
    resetPassword,
  } = useAuth();
  const [loginErr, setLoginErr] = useState<string>();
  const [resetPasswordErr, setResetPasswordErr] = useState<string>();
  const [forgotPasswordErr, setForgotPasswordErr] = useState<string>();
  const [alertMessage, setAlertMessage] = useState<string>();
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [confirming, setConfirming] = useState<boolean>(false);
  const theme = useTheme();

  const handleLoginError = (err: AwsLoginError) => {
    if (err.code === "UserNotConfirmedException") {
      setConfirming(true);
      resendConfirmationCode(getValues("email"));
    } else {
      console.error(err.message);
      setLoginErr(err.message);
    }
  };

  const handleLogin = async (values: FieldValues) => {
    setLoginErr(undefined);
    loginUser(values.email, values.password)
      .then((result: AwsLoginResult) => {
        if (result?.userConfirmationNecessary) {
          setAlertMessage("You need to verify your email before you can login");
        }
      })
      .catch(handleLoginError);
  };

  const handleCloseConfirmRegistrationModal = () => {
    setConfirming(false);
  };

  const handleConfirmRegistrationSuccess = () => {
    handleCloseConfirmRegistrationModal();
    setAlertMessage(
      "You have successfully confirmed your registration and will be logged in!"
    );
    setTimeout(() => {
      handleLogin(getValues());
    }, 3000);
  };
  const handleCloseForgotPasswordModal = () => {
    setForgotPasswordModalOpen(false);
  };
  const handleOpenForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true);
  };
  const handleCloseResetPasswordModal = () => {
    setResetPasswordModalOpen(false);
  };
  const handleOpenResetPasswordModal = () => {
    setResetPasswordModalOpen(true);
  };

  const handleSendForgotPasswordEmail = async (values: FieldValues) => {
    setForgotPasswordErr(undefined);
    try {
      await sendForgotPasswordEmail(values.email);
      handleCloseForgotPasswordModal();
      handleOpenResetPasswordModal();
      setAlertMessage("Password reset email sent.");
    } catch (err) {
      console.log(err);
      setForgotPasswordErr(
        (err as Error).message ||
          "An error occurred while sending password reset email."
      );
    }
  };

  const handleResetPassword = async (values: FieldValues) => {
    setResetPasswordErr(undefined);
    try {
      await resetPassword(
        values.email,
        values.verificationCode,
        values.newPassword
      );
      handleCloseResetPasswordModal();
      setAlertMessage("Password reset, you can now login.");
    } catch (err) {
      console.log(err);
      setResetPasswordErr(
        (err as Error).message ||
          "An error occurred while resetting your password."
      );
    }
  };

  useEffect(() => {
    const queryParams = queryString.parse(location.search);

    if (loggedIn) {
      if (queryParams.redirect) {
        navigate(queryParams.redirect.toString());
      } else {
        navigate("/");
      }
    }
    if (queryParams.status) {
      if (queryParams.status === "registration-success") {
        setAlertMessage(
          "You have successfully created an account and can now login!"
        );
      }
      if (queryParams.status === "password-reset-sent") {
        setAlertMessage("Check email to reset your password");
      }
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
              Login
            </Typography>
          </Box>
          <Box mr={4}>
            <Alert show={!!loginErr} severity="error">
              {loginErr}
            </Alert>
            <Alert show={!!alertMessage} severity="success">
              {alertMessage}
            </Alert>
          </Box>
          <form onSubmit={handleSubmit(handleLogin)}>
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
                  autoComplete="current-password"
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
              LOGIN
            </Button>
          </form>
          <Grid container style={{ textAlign: "center" }}>
            <Grid item style={{ width: "100%", marginBottom: "1rem" }}>
              <Divider />
            </Grid>
            <Grid item style={{ width: "100%", marginBottom: "1rem" }}>
              <Link
                onClick={handleOpenForgotPasswordModal}
                to={"#"}
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                Forgot Password?
              </Link>
            </Grid>
            <Grid item style={{ width: "100%", marginBottom: "1rem" }}>
              <Link
                to="/registration"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                Don't have an account? Register for one now.
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <FormModal
        FormComponent={ForgotPasswordForm}
        isOpen={forgotPasswordModalOpen}
        handleClose={handleCloseForgotPasswordModal}
        onSubmit={handleSendForgotPasswordEmail}
        submitText={"Reset Password"}
        error={forgotPasswordErr}
      />

      <FormModal
        FormComponent={ResetPasswordForm}
        isOpen={resetPasswordModalOpen}
        handleClose={handleCloseResetPasswordModal}
        onSubmit={handleResetPassword}
        submitText={"Reset Password"}
        error={resetPasswordErr}
      />

      <ConfirmRegistrationModal
        isOpen={confirming}
        handleClose={handleCloseConfirmRegistrationModal}
        handleConfirmRegistrationSuccess={handleConfirmRegistrationSuccess}
        email={getValues("email")}
      />
    </>
  );
};

export default LoginPage;

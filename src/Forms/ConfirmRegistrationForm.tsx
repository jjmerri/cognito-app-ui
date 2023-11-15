import {
  DialogContentText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { FormModalComponentProps } from "../components/modals/FormModal/FormModal";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export type ConfirmRegistrationFormProps = {
  email: string;
};

export const ConfirmRegistrationForm = ({
  control,
  email,
  setSuccessMessage,
  setErrorMessage,
}: ConfirmRegistrationFormProps & FormModalComponentProps) => {
  const theme = useTheme();
  const { resendConfirmationCode } = useAuth();

  const handleResendConfirmationCode = async () => {
    try {
      await resendConfirmationCode(email);
      setSuccessMessage("Confirmation code resent.");
    } catch (err) {
      console.log(err);
      setErrorMessage(
        (err as Error).message ||
          "An error occurred while resending confirming code."
      );
    }
  };

  return (
    <>
      <DialogContentText>
        <Typography component="h1" variant="h5">
          {`Check your email for a confirmation code.`}
        </Typography>
      </DialogContentText>

      <Controller
        name="registrationCode"
        control={control}
        defaultValue=""
        rules={{
          required: "Registration Code is required",
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            autoFocus
            error={!!fieldState.error}
            fullWidth
            helperText={fieldState.error?.message?.toString()}
            id="registrationCode"
            inputProps={{
              autoCapitalize: "none",
              autoCorrect: "off",
            }}
            label="Registration Code"
            margin="normal"
            name="registrationCode"
            variant="outlined"
          />
        )}
      />
      <Link
        onClick={handleResendConfirmationCode}
        to={"#"}
        style={{
          textDecoration: "none",
          color: theme.palette.primary.main,
        }}
      >
        Didn't get receive the email? Click here to resend.
      </Link>
    </>
  );
};

export default ConfirmRegistrationForm;

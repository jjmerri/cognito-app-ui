import { DialogContentText, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormModalComponentProps } from "../components/modals/FormModal/FormModal";

export const ResetPasswordForm = ({ control }: FormModalComponentProps) => {
  return (
    <>
      <DialogContentText>
        <Typography component="h1" variant="h5">
          Enter your email, verification code, and new password to reset your
          password
        </Typography>
      </DialogContentText>

      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Invalid email",
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            autoFocus
            error={!!fieldState.error}
            fullWidth
            helperText={fieldState.error?.message?.toString()}
            id="email"
            inputProps={{
              autoCapitalize: "none",
            }}
            label="Email"
            margin="normal"
            name="email"
            variant="outlined"
          />
        )}
      />

      <Controller
        name="verificationCode"
        control={control}
        defaultValue=""
        rules={{
          required: "verification code is required",
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            autoFocus
            error={!!fieldState.error}
            fullWidth
            helperText={fieldState.error?.message?.toString()}
            id="verificationCode"
            inputProps={{
              autoCapitalize: "none",
              autoCorrect: "off",
            }}
            label="Verification Code"
            margin="normal"
            name="verificationCode"
            variant="outlined"
          />
        )}
      />

      <Controller
        name="newPassword"
        control={control}
        defaultValue=""
        rules={{ required: "New password is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            error={!!fieldState.error}
            fullWidth
            helperText={fieldState.error?.message?.toString()}
            id="newPassword"
            label="New Password"
            margin="normal"
            name="newPassword"
            type="password"
            variant="outlined"
          />
        )}
      />
    </>
  );
};

export default ResetPasswordForm;

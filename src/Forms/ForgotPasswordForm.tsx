import { DialogContentText, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormModalComponentProps } from "../components/modals/FormModal/FormModal";

export const ForgotPasswordForm = ({ control }: FormModalComponentProps) => {
  return (
    <>
      <DialogContentText>
        <Typography component="h1" variant="h5">
          Enter your email to reset your password
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
    </>
  );
};

export default ForgotPasswordForm;

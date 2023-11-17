import { Controller, FieldValues, useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import Alert from "../Alert/Alert";

export const ChangePassword = () => {
  const { handleSubmit, control } = useForm();
  const { changePassword } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const submitPasswordChange = async (values: FieldValues) => {
    try {
      await changePassword(values.oldPassword, values.newPassword);
      setSuccessMessage("Password changed successfully");
      setErrorMessage(undefined);
    } catch (error) {
      console.error(error);
      setErrorMessage(error as string);
      setSuccessMessage(undefined);
    }
  };

  return (
    <>
      <h1>Change Password</h1>
      <Box mr={4}>
        <Alert show={!!errorMessage} severity="error">
          {errorMessage}
        </Alert>
        <Alert show={!!successMessage} severity="success">
          {successMessage}
        </Alert>
      </Box>
      <form onSubmit={handleSubmit(submitPasswordChange)}>
        <Controller
          name="oldPassword"
          control={control}
          defaultValue=""
          rules={{ required: "Old password is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              fullWidth
              helperText={fieldState.error?.message?.toString()}
              id="oldPassword"
              label="Old Password"
              margin="normal"
              name="oldPassword"
              type="password"
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
        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          autoFocus
          style={{ marginTop: "1rem" }}
        >
          Change Password
        </Button>
      </form>
    </>
  );
};

export default ChangePassword;

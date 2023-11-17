import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Snackbar,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { Control, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

export interface FormModalComponentProps {
  control: Control<FieldValues>;
  setSuccessMessage: (message: string | undefined) => void;
  setErrorMessage: (message: string | undefined) => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface FormModalProps<ComponentProps = undefined> {
  FormComponent: React.FC<ComponentProps & FormModalComponentProps>;
  formProps?: ComponentProps;
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: SubmitHandler<FieldValues>;
  cancelText?: string;
  submitText?: string;
  error?: string;
}

const FormModal = <ComponentProps extends object>({
  FormComponent,
  formProps = {} as ComponentProps,
  isOpen,
  handleClose,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  error,
}: FormModalProps<ComponentProps>) => {
  const { handleSubmit, control } = useForm();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const handleCloseSuccess = () => {
    setSuccessMessage(undefined);
  };
  const handleCloseError = () => {
    setErrorMessage(undefined);
  };

  useEffect(() => {
    setErrorMessage(error);
  }, [error, setErrorMessage]);

  return (
    <>
      <Dialog
        //   disableBackdropClick
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <FormComponent
              control={control}
              setErrorMessage={setErrorMessage}
              setSuccessMessage={setSuccessMessage}
              {...formProps}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {cancelText}
            </Button>
            <Button type="submit" color="primary" autoFocus>
              {submitText}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={5000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormModal;

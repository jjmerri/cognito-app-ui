import { useState } from "react";
import ConfirmRegistrationForm, {
  ConfirmRegistrationFormProps,
} from "../../../Forms/ConfirmRegistrationForm";
import FormModal from "../FormModal/FormModal";
import useAuth from "../../../hooks/useAuth";
import { FieldValues } from "react-hook-form";

export type ConfirmRegistrationModalProps = {
  isOpen: boolean;
  handleConfirmRegistrationSuccess: () => void;
  handleClose: () => void;
  email: string;
};

const ConfirmRegistrationModal = ({
  isOpen,
  handleConfirmRegistrationSuccess,
  handleClose,
  email,
}: ConfirmRegistrationModalProps) => {
  const { confirmRegistration } = useAuth();
  const [confirmRegistrationErr, setConfirmRegistrationErr] =
    useState<string>();
  const confirmRegistrationHandleClose = () => {
    setConfirmRegistrationErr(undefined);
    handleClose();
  };
  const handleConfirmRegistration = async (values: FieldValues) => {
    setConfirmRegistrationErr(undefined);
    console.log("confirmRegistrationHandleClose", values);
    try {
      await confirmRegistration(email, values.registrationCode);
      handleConfirmRegistrationSuccess();
    } catch (err) {
      console.log(err);
      setConfirmRegistrationErr(
        (err as Error).message ||
          "An error occurred while confirming registration."
      );
    }
  };

  return (
    <FormModal<ConfirmRegistrationFormProps>
      FormComponent={ConfirmRegistrationForm}
      isOpen={isOpen}
      handleClose={confirmRegistrationHandleClose}
      onSubmit={handleConfirmRegistration}
      submitText="Confirm Registration"
      error={confirmRegistrationErr}
      formProps={{ email }}
    />
  );
};

export default ConfirmRegistrationModal;

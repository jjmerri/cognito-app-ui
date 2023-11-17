import { FC } from "react";
import { Alert as AlertComponent } from "@mui/material";

interface AlertProps {
  show: boolean;
  topMargin?: number;
  bottomMargin?: number;
  width?: string;
  children: React.ReactNode;
  severity: "error" | "warning" | "info" | "success";
}

const Alert: FC<AlertProps> = ({
  show,
  topMargin = 2,
  bottomMargin = 0,
  width = "100%",
  children,
  ...rest
}) => {
  return show ? (
    <AlertComponent
      sx={{ mt: topMargin, mb: bottomMargin, width: width }}
      {...rest}
    >
      {children}
    </AlertComponent>
  ) : (
    <></>
  );
};

export default Alert;

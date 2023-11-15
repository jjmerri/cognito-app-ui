import { CognitoUserSession, ISignUpResult } from "amazon-cognito-identity-js";
import { createContext } from "react";
import {
  AppUser,
  SendForgotPasswordEmailResponse,
} from "../providers/AuthProvider";

export type AuthContextType = {
  loggedIn: boolean;
  loginUser: (
    username: string,
    password: string
  ) => Promise<{
    session: CognitoUserSession;
    userConfirmationNecessary: boolean | undefined;
  }>;
  logoutUser: () => void;
  registerUser: (email: string, password: string) => Promise<ISignUpResult>;
  confirmRegistration: (email: string, code: string) => Promise<string>;
  resendConfirmationCode: (email: string) => Promise<string>;
  changePassword: (
    email: string,
    oldPassword: string,
    newPassword: string
    // TODO put actual types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any;
  sendForgotPasswordEmail: (
    email: string
  ) => Promise<SendForgotPasswordEmailResponse>;
  resetPassword: (
    email: string,
    verificationCode: string,
    newPassword: string
  ) => Promise<string>;
  user: AppUser | undefined;
  setAuthContext: (loggedIn: boolean, user: AppUser) => void;
};

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  loginUser: async () => {
    throw new Error("AuthProvider not initialized");
  },
  logoutUser: () => {},
  registerUser: async () => {
    throw new Error("AuthProvider not initialized");
  },
  confirmRegistration: async () => {
    throw new Error("AuthProvider not initialized");
  },
  resendConfirmationCode: async () => {
    throw new Error("AuthProvider not initialized");
  },
  changePassword: async () => undefined,
  sendForgotPasswordEmail: async () => {
    throw new Error("AuthProvider not initialized");
  },
  resetPassword: async () => {
    throw new Error("AuthProvider not initialized");
  },
  user: undefined,
  setAuthContext: () => {
    throw new Error("AuthProvider not initialized");
  },
});

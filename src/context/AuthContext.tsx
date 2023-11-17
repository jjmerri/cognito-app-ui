import { CognitoUserSession, ISignUpResult } from "amazon-cognito-identity-js";
import { createContext } from "react";
import {
  AppUser,
  SendForgotPasswordEmailResponse,
} from "../providers/AuthProvider";

export interface AuthContextType {
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
  changePassword: (oldPassword: string, newPassword: string) => Promise<string>;
  sendForgotPasswordEmail: (
    email: string
  ) => Promise<SendForgotPasswordEmailResponse>;
  resetPassword: (
    email: string,
    verificationCode: string,
    newPassword: string
  ) => Promise<string>;
  user: AppUser | undefined;
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  loginUser: async () => {
    throw new Error("AuthProvider not initialized");
  },
  logoutUser: () => {
    throw new Error("AuthProvider not initialized");
  },
  registerUser: async () => {
    throw new Error("AuthProvider not initialized");
  },
  confirmRegistration: async () => {
    throw new Error("AuthProvider not initialized");
  },
  resendConfirmationCode: async () => {
    throw new Error("AuthProvider not initialized");
  },
  changePassword: async () => {
    throw new Error("AuthProvider not initialized");
  },
  sendForgotPasswordEmail: async () => {
    throw new Error("AuthProvider not initialized");
  },
  resetPassword: async () => {
    throw new Error("AuthProvider not initialized");
  },
  user: undefined,
});

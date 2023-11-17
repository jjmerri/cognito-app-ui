import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  AuthenticationDetails,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  CookieStorage,
  ISignUpResult,
} from "amazon-cognito-identity-js";

export interface AppUser {
  email: string;
  accessToken: CognitoAccessToken;
  idToken: CognitoIdToken;
  refreshToken: CognitoRefreshToken;
}

export interface AwsLoginError {
  code: string;
  name: string;
  message: string;
}

export interface AwsLoginResult {
  session: CognitoUserSession;
  userConfirmationNecessary: boolean | undefined;
}

export interface CodeDeliveryDetails {
  AttributeName: string;
  DeliveryMedium: string;
  Destination: string;
}

export interface SendForgotPasswordEmailResponse {
  CodeDeliveryDetails: CodeDeliveryDetails;
}

const cookieDomain = import.meta.env.VITE_COOKIE_DOMAIN;
const cookieStorage = new CookieStorage({ domain: cookieDomain });

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | undefined>();

  const setUserFromSession = useCallback((session: CognitoUserSession) => {
    setUser({
      idToken: session.getIdToken(),
      accessToken: session.getAccessToken(),
      refreshToken: session.getRefreshToken(),
      email: session.getIdToken().decodePayload().email,
    });
  }, []);

  const userPool = useMemo(
    () =>
      new CognitoUserPool({
        UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        Storage: cookieStorage,
      }),
    []
  );

  useEffect(() => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(
        (err: Error, session: CognitoUserSession | null) => {
          if (err) {
            console.error(
              "error loading session from cookies",
              err.message || JSON.stringify(err)
            );
            return;
          }

          setUserFromSession(session!);
        }
      );
    }
  }, [setUserFromSession, userPool]);

  const registerUser = (
    email: string,
    password: string
  ): Promise<ISignUpResult> => {
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, [], [], (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result!);
        }
      });
    });
  };

  const confirmRegistration = (
    email: string,
    code: string
  ): Promise<string> => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
      Storage: cookieStorage,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(
        code,
        true,
        function (err: Error, result: string) {
          if (err) {
            console.log(
              "Error confirming registration",
              err.message || JSON.stringify(err)
            );
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  const resendConfirmationCode = (email: string): Promise<string> => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
      Storage: cookieStorage,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
          console.log(
            "Error confirming registration",
            err.message || JSON.stringify(err)
          );
          reject(err);
        }
        resolve(result);
      });
    });
  };

  const loginUser = (
    email: string,
    password: string
  ): Promise<{
    session: CognitoUserSession;
    userConfirmationNecessary: boolean | undefined;
  }> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
        Storage: cookieStorage,
      });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (
          session: CognitoUserSession,
          userConfirmationNecessary: boolean | undefined
        ) => {
          console.log("login success", session);
          setUserFromSession(session);
          resolve({ session, userConfirmationNecessary });
        },
        onFailure: (err) => {
          console.log("login failed", JSON.stringify(err));
          reject(err);
        },
      });
    });
  };

  const logoutUser = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      setUser(undefined);
    }
  };

  const changePassword = (
    oldPassword: string,
    newPassword: string
  ): Promise<string> => {
    const cognitoUser = userPool.getCurrentUser();

    return new Promise((resolve, reject) => {
      if (cognitoUser) {
        cognitoUser.getSession((sessionErr: Error) => {
          if (sessionErr) {
            reject(sessionErr);
          } else {
            cognitoUser.changePassword(oldPassword, newPassword, (err) => {
              if (err) {
                reject(err.message || JSON.stringify(err));
              } else {
                resolve("SUCCESS");
              }
            });
          }
        });
      }
    });
  };

  const sendForgotPasswordEmail = (
    email: string
  ): Promise<SendForgotPasswordEmailResponse> => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
      Storage: cookieStorage,
    });
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: function (data) {
          resolve(data);
        },
        onFailure: function (err) {
          reject(err.message || JSON.stringify(err));
        },
      });
    });
  };

  const resetPassword = async (
    email: string,
    verificationCode: string,
    newPassword: string
  ): Promise<string> => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
      Storage: cookieStorage,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess(successMessage: string) {
          resolve(successMessage);
        },
        onFailure(err) {
          console.log("Password not confirmed!", err);
          reject(err);
        },
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        logoutUser,
        registerUser,
        confirmRegistration: confirmRegistration,
        resendConfirmationCode,
        changePassword,
        sendForgotPasswordEmail,
        resetPassword,
        loggedIn: !!user,
        user: user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

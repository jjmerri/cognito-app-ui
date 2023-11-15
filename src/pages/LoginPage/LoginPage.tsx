import { useEffect } from "react";
import Login from "../../components/Login/Login";
import { redirect, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const { loggedIn } = useAuth();
  const { redirect: redirectUrl } = useParams();

  useEffect(() => {
    if (loggedIn && redirectUrl) {
      redirect(redirectUrl);
    }
  }, [loggedIn, redirectUrl]);

  return <Login />;
}

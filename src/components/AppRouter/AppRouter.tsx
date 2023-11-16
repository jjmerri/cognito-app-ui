import {
  LoaderFunctionArgs,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import MarketingPage from "../../pages/MarketingPage/MarketingPage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import Layout from "../../Layout";
import useAuth from "../../hooks/useAuth";
import { useCallback } from "react";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import RegistrationPage from "../../pages/RegistrationPage/RegistrationPage";

const AppRouter = () => {
  const { loggedIn } = useAuth();

  const protectedLoader = useCallback(
    async ({ request }: LoaderFunctionArgs) => {
      if (!loggedIn) {
        const params = new URLSearchParams();
        params.set("redirect", new URL(request.url).pathname);
        return redirect("/login?" + params.toString());
      }
      return null;
    },
    [loggedIn]
  );

  const router = createBrowserRouter([
    {
      id: "root",
      path: "/",
      Component: Layout,
      errorElement: (
        <Layout>
          <ErrorPage />
        </Layout>
      ),
      children: [
        {
          index: true,
          Component: MarketingPage,
        },
        {
          path: "login",
          Component: LoginPage,
        },
        {
          path: "registration",
          Component: RegistrationPage,
        },
        {
          path: "profile",
          loader: protectedLoader,
          Component: ProfilePage,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};
export default AppRouter;

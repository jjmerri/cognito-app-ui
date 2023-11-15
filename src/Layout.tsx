import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";

export type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      {children || <Outlet />}
    </>
  );
}

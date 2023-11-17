import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";

export interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      {children ?? <Outlet />}
    </>
  );
}

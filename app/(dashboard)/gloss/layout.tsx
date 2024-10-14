import { LayoutHeader } from "./components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operaciones",
};

const GlossLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LayoutHeader />
      {children}
    </>
  );
};

export default GlossLayout;

import { Form, SideSection } from "./components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
};

const SignInPage = () => {
  return (
    <main className="h-screen flex">
      <Form />
      <SideSection />
    </main>
  );
};

export default SignInPage;

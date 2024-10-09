import { Form, SideSection } from "./components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
};

const SignInPage = () => {
  return (
    <article className="h-screen flex">
      <Form />
      <SideSection />
    </article>
  );
};

export default SignInPage;

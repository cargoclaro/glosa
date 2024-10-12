import { SideSection } from "./components";

const SignTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen flex">
      {children}
      <SideSection />
    </main>
  );
};

export default SignTemplate;

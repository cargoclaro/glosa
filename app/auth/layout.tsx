import { Header, Sidebar } from "./components";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <article className="bg-[#f8f9fd] min-h-screen md:ml-48 p-4">
        <Header />
        {children}
      </article>
    </>
  );
};

export default AuthLayout;

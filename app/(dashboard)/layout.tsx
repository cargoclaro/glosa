import { Header, Main, Sidebar } from "./components";
import { getMe } from "@/app/shared/services/user/controller";
import type { IUser } from "@/app/shared/interfaces";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const me = (await getMe()) as IUser;
  // const myNotifications = [
  //   {
  //     id: 1,
  //     title: "You have a new message",
  //     description: "You have a new message from John Doe",
  //   },
  //   {
  //     id: 2,
  //     title: "New user registered",
  //     description: "A new user registered on your website",
  //   },
  // ];

  return (
    <>
      <Sidebar />
      <Header
        user={me}
        // notifications={myNotifications}
      />
      <Main>{children}</Main>
    </>
  );
};

export default AuthLayout;

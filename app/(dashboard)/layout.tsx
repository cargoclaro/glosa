import { isAuthenticated } from "../shared/services/auth";
import prisma from "../shared/services/prisma";
import { Header, Main, Sidebar } from "./components";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await isAuthenticated();
  const userId = session["userId"];
  if (typeof userId !== "string") {
    throw new Error("User ID is not a string");
  }
  const me = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      glosses: true,
    },
  });
  if (!me) {
    return <div>No se pudo obtener el usuario</div>;
  }
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

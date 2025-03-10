import { Header, Main, Sidebar } from "./components";
import { currentUser } from '@clerk/nextjs/server'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser()
  if (!user) {
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
        image={user.imageUrl}
        // notifications={myNotifications}
      />
      <Main>{children}</Main>
    </>
  );
};

export default AuthLayout;

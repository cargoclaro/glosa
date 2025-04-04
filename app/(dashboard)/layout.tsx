import { currentUser } from '@clerk/nextjs/server';
import { Header, Main, Sidebar } from './components';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
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
      <Header />
      <Main>{children}</Main>
    </>
  );
};

export default AuthLayout;

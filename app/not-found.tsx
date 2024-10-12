import Link from "next/link";
import Image from "next/image";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
};

const NotFoundPage = () => {
  return (
    <article className="h-screen flex flex-col gap-4 items-center justify-center">
      <div className="w-52 md:w-96 h-auto">
        <Image
          src="/logo.webp"
          alt="Cargo Claro Logo"
          width={100}
          height={100}
          className="size-full"
          priority
        />
      </div>
      <div className="p-2 text-center">
        <strong className="text-3xl">404. Not found</strong>
        <p className="text-2xl">Página no encontrada</p>
        <small className="text-xl">La página que buscas no existe.</small>
      </div>
      <Link href="/" className="link-button-cargoClaro">
        Inicio
      </Link>
    </article>
  );
};

export default NotFoundPage;

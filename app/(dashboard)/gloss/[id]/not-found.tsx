import Link from "next/link";
import Image from "next/image";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
};

const NotFoundPage = () => {
  return (
    <article className="py-40 flex flex-col gap-4 items-center justify-center">
      <div className="w-52 md:w-96 h-auto">
        <Image
          src="/assets/images/logo.webp"
          alt="Cargo Claro Logo"
          width={100}
          height={100}
          className="size-full"
          priority
        />
      </div>
      <div className="p-2 text-center">
        <strong className="text-3xl">404. Not found</strong>
        <p className="text-2xl">Glosa no encontrada</p>
        <small className="text-xl">La glosa que buscas no existe.</small>
      </div>
      <Link href="/gloss" className="link-button-cargoClaro">
        Mis glosas
      </Link>
    </article>
  );
};

export default NotFoundPage;

"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/app/utils/cn";
import { useServerAction } from "@/app/hooks";
import { login } from "@/app/services/user/controller";
import { INITIAL_STATE_RESPONSE } from "@/app/constants";
import { GenericInput, SubmitButton } from "@/app/components";
import type { ILoginState } from "@/app/interfaces";

const Form = () => {
  const { response, isLoading, setResponse, setIsLoading } =
    useServerAction<ILoginState>(INITIAL_STATE_RESPONSE);

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await login(formData);
    if (res && res.success) {
      window.location.href = "/home";
    } else {
      setResponse(res);
    }
    setIsLoading(false);
  };

  return (
    <article className="bg-white w-full md:w-1/2 flex justify-center items-center p-4">
      <section className="flex flex-col items-center gap-4 max-h-full overflow-y-auto py-5 md:py-10 md:px-14 px-7 rounded-2xl shadow-2xl animate-fade-down">
        <Link href="/" className="w-40 md:w-64 h-auto">
          <Image
            src="/logo.webp"
            alt="Cargo Claro Logo"
            width={100}
            height={100}
            className="size-full"
            priority
          />
        </Link>
        <div className="flex flex-col items-center gap-2 mt-2">
          {response.message && (
            <p className="text-red-600">{response.message}</p>
          )}
          <form onSubmit={submitAction}>
            <fieldset
              disabled={isLoading}
              className={cn(isLoading && "opacity-50")}
            >
              <div className="flex flex-col gap-4 text-xl">
                <CustomDiv>
                  <GenericInput
                    id="email"
                    type="email"
                    autoComplete="email"
                    labelClassName="text-base"
                    ariaLabel="Correo Electrónico"
                    placeholder="usuario@cargoclaro.com"
                    error={response.errors?.email}
                  />
                </CustomDiv>
                <CustomDiv>
                  <GenericInput
                    id="password"
                    type="password"
                    ariaLabel="Contraseña"
                    labelClassName="text-base"
                    placeholder="************"
                    autoComplete="current-password"
                    error={response.errors?.password}
                  />
                </CustomDiv>
              </div>
              <div className="text-center mt-4">
                <SubmitButton pending={isLoading} title="Iniciar Sesión" />
              </div>
            </fieldset>
          </form>
        </div>
        <p>
          ¿No tienes cuenta?{" "}
          <span>
            <Link
              href="/sign-up"
              className="text-cargoClaroOrange hover:text-cargoClaroOrange-hover"
            >
              Regístrate
            </Link>
          </span>
        </p>
      </section>
    </article>
  );
};

export default Form;

const CustomDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">{children}</div>
);

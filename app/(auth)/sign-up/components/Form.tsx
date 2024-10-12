"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/app/utils/cn";
import { useServerAction } from "@/app/hooks";
import { register } from "@/app/services/user/controller";
import { INITIAL_STATE_RESPONSE } from "@/app/constants";
import { GenericInput, SubmitButton } from "@/app/components";
import type { IRegisterState } from "@/app/interfaces";

const Form = () => {
  const { response, isLoading, setResponse, setIsLoading } =
    useServerAction<IRegisterState>(INITIAL_STATE_RESPONSE);

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await register(formData);
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
              <div className="flex flex-col gap-4 text-base">
                <PairCustomDiv>
                  <CustomDiv>
                    <GenericInput
                      id="name"
                      type="text"
                      ariaLabel="Nombre"
                      autoComplete="name"
                      placeholder="Nombre"
                      error={response.errors?.name}
                    />
                  </CustomDiv>
                  <CustomDiv>
                    <GenericInput
                      id="lastName"
                      type="text"
                      ariaLabel="Apellido"
                      autoComplete="family-name"
                      placeholder="Apellido"
                      error={response.errors?.lastName}
                    />
                  </CustomDiv>
                </PairCustomDiv>
                <PairCustomDiv>
                  <CustomDiv>
                    <GenericInput
                      id="patentNumber"
                      type="number"
                      ariaLabel="Número de Patente"
                      placeholder="123456789"
                      error={response.errors?.patentNumber}
                    />
                  </CustomDiv>
                  <CustomDiv>
                    <GenericInput
                      id="email"
                      type="email"
                      autoComplete="email"
                      ariaLabel="Correo Electrónico"
                      placeholder="usuario@cargoclaro.com"
                      error={response.errors?.email}
                    />
                  </CustomDiv>
                </PairCustomDiv>
                <PairCustomDiv>
                  <CustomDiv>
                    <GenericInput
                      id="password"
                      type="password"
                      ariaLabel="Contraseña"
                      placeholder="************"
                      autoComplete="current-password"
                      error={response.errors?.password}
                    />
                  </CustomDiv>
                  <CustomDiv>
                    <GenericInput
                      id="confirmPassword"
                      type="password"
                      ariaLabel="Confirmar Contraseña"
                      placeholder="************"
                      autoComplete="current-password"
                      error={response.errors?.confirmPassword}
                    />
                  </CustomDiv>
                </PairCustomDiv>
              </div>
              <div className="text-center mt-4">
                <SubmitButton pending={isLoading} title="Registrarse" />
              </div>
            </fieldset>
          </form>
        </div>
        <p>
          ¿Ya tienes una cuenta?{" "}
          <span>
            <Link
              href="/sign-in"
              className="text-cargoClaroOrange hover:text-cargoClaroOrange-hover"
            >
              Inicia sesión
            </Link>
          </span>
        </p>
      </section>
    </article>
  );
};

export default Form;

const CustomDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 w-full">{children}</div>
);

const PairCustomDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row gap-2">{children}</div>
);

"use client";

import Image from "next/image";
import { useAuth } from "@/app/hooks";
import { CardSkeleton, GenericCard } from "@/app/components";

const MyInfo = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <GenericCard>
          <p className="font-bold text-center text-lg">
            Patente:{" "}
            <span className="font-normal">{"#" + user.patentNumber}</span>
          </p>
          <div className="flex justify-center mt-4">
            <Image
              src={user.image}
              alt="User profile"
              className="size-20 rounded-full"
              width={64}
              height={64}
            />
          </div>
          <h1 className="font-extrabold text-2xl">
            {user.name + " " + user.lastName}
          </h1>
          <div className="flex justify-start mt-2">
            <p className="font-semibold text-xl text-left">Aduanas:</p>
            <ul className="mt-0.5 ml-5">
              {user.customs.map((custom) => (
                <li key={custom.customId} className=" list-disc">
                  {custom.custom.city}
                </li>
              ))}
            </ul>
          </div>
        </GenericCard>
      ) : (
        <CardSkeleton />
      )}
    </>
  );
};

export default MyInfo;

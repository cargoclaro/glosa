"use client";

import Image from "next/image";
import { useAuth } from "@/app/shared/hooks";
import { ProfileCardSkeleton, GenericCard } from "@/app/shared/components";

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
              priority
            />
          </div>
          <h1 className="font-extrabold text-2xl">
            {user.name + " " + user.lastName}
          </h1>
          {/* <div className="flex justify-start mt-2 text-xl">
            <p className="font-semibold text-left mr-2">Aduanas:</p>
            <ul
              title={
                user.customs &&
                user.customs.map((custom) => custom.custom.city).join(", ")
              }
              className="flex flex-col sm:flex-row gap-1 truncate"
            >
              {user.customs.map((custom, index) => (
                <li key={custom.customId}>
                  {custom.custom.city}
                  {index !== user.customs.length - 1 ? "," : ""}
                </li>
              ))}
            </ul>
          </div> */}
        </GenericCard>
      ) : (
        <ProfileCardSkeleton />
      )}
    </>
  );
};

export default MyInfo;

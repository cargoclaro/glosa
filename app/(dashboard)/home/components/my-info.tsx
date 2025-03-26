import { GenericCard } from '@/shared/components';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';

async function MyInfo() {
  const { orgId } = await auth.protect();
  if (!orgId) {
    return <div>No se pudo obtener la organización</div>;
  }
  const user = await currentUser();
  if (!user) {
    return <div>No se pudo obtener el usuario</div>;
  }
  const client = await clerkClient();
  const { publicMetadata } = await client.organizations.getOrganization({
    organizationId: orgId,
  });
  return (
    <GenericCard>
      <p className="text-center font-bold text-lg">
        Patente:{' '}
        <span className="font-normal">{`#${publicMetadata?.patente}`}</span>
      </p>
      <div className="mt-4 flex justify-center">
        <Image
          src={user.imageUrl}
          alt="User profile"
          className="size-20 rounded-full"
          width={64}
          height={64}
          priority
        />
      </div>
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
  );
}

export default MyInfo;

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
      {/* User profile section - centered with email */}
      <div className="mb-5 flex flex-col items-center">
        <div className="mb-3">
          <Image
            src={user.imageUrl}
            alt="User profile"
            className="rounded-full"
            width={84}
            height={84}
            priority
          />
        </div>

        <p className="text-center text-gray-700">
          {user.emailAddresses &&
            user.emailAddresses.length > 0 &&
            user.emailAddresses[0]?.emailAddress}
        </p>
      </div>

      {/* Organization info header - matching screenshot exactly */}
      <div>
        <div className="mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5 text-orange-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <h3 className="font-medium text-orange-500">
            Información de Organización
          </h3>
        </div>

        {/* Patent info - simple key-value display */}
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700">Patente</span>
          <span className="font-medium">
            #{publicMetadata?.patente || '9999'}
          </span>
        </div>
      </div>
    </GenericCard>
  );
}

export default MyInfo;

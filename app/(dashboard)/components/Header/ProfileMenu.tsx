// "use client";

import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";

const ProfileMenu = () => {
  return (
    <div className="relative inline-block text-left">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default ProfileMenu;

'use client';

import React, { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';

const ProfileMenu = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative inline-block text-left">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default ProfileMenu;

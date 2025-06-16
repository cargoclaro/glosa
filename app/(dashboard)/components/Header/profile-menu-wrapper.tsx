'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ProfileMenu = dynamic(() => import('./profile-menu'), {
  ssr: false,
  loading: () => (
    <div className="relative inline-block text-left">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
    </div>
  ),
});

const ProfileMenuWrapper = () => {
  return <ProfileMenu />;
};

export default ProfileMenuWrapper; 
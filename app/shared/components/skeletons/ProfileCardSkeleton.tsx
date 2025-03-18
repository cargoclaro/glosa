const ProfileCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col justify-between rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex animate-pulse flex-col items-center justify-between gap-2">
        <div className="mb-3 h-3 w-32 rounded-full bg-gray-300"></div>
        <div className="size-20 rounded-full bg-gray-300"></div>
      </div>
      <div className="h-4 w-64 animate-pulse rounded-full bg-gray-300"></div>
      <div className="mt-2 flex animate-pulse gap-2">
        <div className="h-3 w-36 rounded-full bg-gray-300"></div>
        <div className="h-3 w-80 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;

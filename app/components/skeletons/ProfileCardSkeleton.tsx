const ProfileCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col justify-between items-center gap-2 mb-4 animate-pulse">
        <div className="h-3 bg-gray-300 rounded-full w-32 mb-3"></div>
        <div className="size-20 bg-gray-300 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded-full w-64 animate-pulse"></div>
      <div className="flex gap-2 mt-2 animate-pulse">
        <div className="h-3 bg-gray-300 rounded-full w-36"></div>
        <div className="h-3 bg-gray-300 rounded-full w-80"></div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;

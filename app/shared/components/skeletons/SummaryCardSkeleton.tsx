const SummaryCardSkeleton = () => {
  return (
    <div className="h-[140px] rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex animate-pulse justify-between gap-2">
        <div className="h-4 w-40 rounded-full bg-gray-300"></div>
        <div className="size-10 min-w-10 rounded-full bg-gray-300"></div>
      </div>
      <div className="h-3 w-24 animate-pulse rounded-full bg-gray-300"></div>
    </div>
  );
};

export default SummaryCardSkeleton;

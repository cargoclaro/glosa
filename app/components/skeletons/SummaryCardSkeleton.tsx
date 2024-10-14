const SummaryCardSkeleton = () => {
  return (
    <div className="h-[140px] bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between gap-2 mb-4 animate-pulse">
        <div className="h-4 w-40 bg-gray-300 rounded-full"></div>
        <div className="size-10 min-w-10 bg-gray-300 rounded-full"></div>
      </div>
      <div className="w-24 h-3 bg-gray-300 rounded-full animate-pulse"></div>
    </div>
  );
};

export default SummaryCardSkeleton;

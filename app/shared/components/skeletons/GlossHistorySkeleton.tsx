const GlossHistorySkeleton = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 h-4 w-64 animate-pulse rounded-full bg-gray-300"></div>
      <div className="mb-4 h-0.5 w-full animate-pulse rounded-full bg-gray-300"></div>
      <div className="flex animate-pulse flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-between gap-2 p-2">
            <div className="flex flex-col gap-2">
              <div className="h-3 w-44 rounded-full bg-gray-300"></div>
              <div className="h-2 w-20 rounded-full bg-gray-300"></div>
            </div>
            <div className="size-8 rounded-xl bg-gray-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlossHistorySkeleton;

const GlossHistorySkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-4 bg-gray-300 rounded-full w-64 animate-pulse mb-4"></div>
      <div className="h-0.5 bg-gray-300 rounded-full w-full animate-pulse mb-4"></div>
      <div className="flex flex-col gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-between gap-2 p-2">
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-300 rounded-full w-44"></div>
              <div className="h-2 bg-gray-300 rounded-full w-20"></div>
            </div>
            <div className="size-8 bg-gray-300 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlossHistorySkeleton;

const CurrentPlanSkeleton = () => {
  return (
    <div>
      <div className="bg-gray333 flex h-[193.5px] flex-col gap-4 rounded-md p-6 md:h-[217.5px]">
        <div className="bg-cream/20 h-6 w-32 animate-pulse rounded"></div>
        <div className="bg-cream/20 h-8 w-48 animate-pulse rounded"></div>
        <div className="bg-cream/20 h-5 w-40 animate-pulse rounded"></div>
        <div className="bg-cream/20 ml-auto h-8 w-32 animate-pulse rounded"></div>
      </div>
      <div className="bg-gray333 mt-6 flex h-[193.5px] flex-col gap-4 rounded-md p-6 md:mt-12 md:h-[293.5px]">
        <div className="bg-cream/20 h-6 w-32 animate-pulse rounded"></div>
        <div className="bg-cream/20 h-8 w-48 animate-pulse rounded"></div>
        <div className="bg-cream/20 h-5 w-40 animate-pulse rounded"></div>
        <div className="bg-cream/20 mt-6 h-5 w-40 animate-pulse rounded"></div>
        <div className="bg-cream/20 h-5 w-40 animate-pulse rounded"></div>
        <div className="bg-cream/20 h-5 w-40 animate-pulse rounded"></div>
        <div className="bg-cream/20 ml-auto h-8 w-32 animate-pulse rounded"></div>
      </div>
    </div>
  );
};

export default CurrentPlanSkeleton;

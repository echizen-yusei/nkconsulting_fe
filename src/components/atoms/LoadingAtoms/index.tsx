export default function LoadingAtoms({ height = "h-10 md:h-12", width = "w-10 md:w-12" }: { height?: string; width?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className={`${height} ${width} animate-spin rounded-full border-2 border-black/20 border-t-[#CF2E2E] md:border-4`}></div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/logo.gif"
          alt="UWO Connect Loading"
          className="w-24 h-24 object-contain animate-pulse"
        />
        <div className="w-6 h-6 border-2 border-[#059669] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}


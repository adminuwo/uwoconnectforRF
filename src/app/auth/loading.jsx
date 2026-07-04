export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#059669]" />
          <div className="w-32 h-5 bg-slate-100 rounded-full" />
        </div>
        <div className="w-full bg-white border border-slate-100 rounded-[32px] p-10 space-y-5 shadow-sm">
          <div className="w-48 h-8 bg-slate-100 rounded-2xl mx-auto" />
          <div className="w-full h-12 bg-slate-50 rounded-2xl" />
          <div className="w-full h-12 bg-slate-50 rounded-2xl" />
          <div className="w-full h-14 bg-gradient-to-r from-[#16A34A]/20 to-[#059669]/20 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}


export default function Loading() {
  return (
    <div className="flex bg-[#fcfdfe] min-h-screen">
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 hidden md:block" />
      <main className="flex-1 dashboard-main min-h-screen flex flex-col">
        <header className="h-16 md:h-24 bg-white border-b border-slate-100 px-4 md:px-10 flex items-center">
          <div className="w-40 h-5 bg-slate-100 rounded-full" />
        </header>
        <div className="p-4 md:p-10 flex-1">
          <div className="w-full p-4 space-y-8">
            <div className="w-64 h-8 bg-slate-100 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-8 h-36" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white rounded-[40px] border border-slate-100 h-64" />
              <div className="bg-slate-900 rounded-[40px] h-64 opacity-30" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


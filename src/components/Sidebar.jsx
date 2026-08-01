export default function Sidebar() {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-xl shadow-lg rounded-3xl px-3 py-6 flex flex-col items-center gap-6 z-50">

      <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-bold">
        P
      </div>

      <div className="bg-indigo-600 text-white px-3 py-2 rounded-full text-xs">
        AI Check
      </div>

      <div className="text-gray-400 flex flex-col gap-5 text-lg">
        <span>💬</span>
        <span>📄</span>
        <span>👤</span>
      </div>

    </div>
  );
}

import { Ticket, BellRing, Footprints, LogOut } from "lucide-react";

function QueueCalled({ customer, setShowLeaveModal }) {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="h-14 shrink-0 bg-white border-b border-slate-100 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">ScanQ</span>
        </div>

        <span className="text-xs font-semibold px-3 py-2 rounded-full bg-emerald-50 text-emerald-700">
          Your Turn
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-5">
          {/* Notification */}
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <BellRing className="w-8 h-8 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mt-4">
              It's your turn!
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Hello, {customer.name.split(" ")[0]}! Please proceed to the
              counter.
            </p>
          </div>

          {/* Token Number */}
          <div className="bg-blue-50 rounded-2xl py-5 text-center mt-3">
            <p className="text-xs font-bold text-blue-500 tracking-widest uppercase">
              Your Token Number
            </p>

            <h2 className="text-6xl font-extrabold text-blue-600 mt-1">
              #{customer.token_number ?? "--"}
            </h2>

            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white text-xs font-semibold text-emerald-600">
              CALLED
            </span>
          </div>

          {/* Information */}
          <div className="bg-slate-50 rounded-xl p-4 mt-4">
            <p className="text-sm font-semibold text-slate-700">
              What to do next?
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your turn has arrived! Click "I'm on my way" and proceed to the
              service counter immediately. If you don't confirm your
              availability, the staff may remove you from the queue and call the
              next customer.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 space-y-3">
            <button
              onClick={() => alert("TODO: Will be Implement")}
              className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
            >
              <Footprints size={18} />
              I'm on my way
            </button>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-full h-12 flex items-center justify-center gap-2 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-xl text-sm font-semibold transition"
            >
              <LogOut size={18} />
              Leave Queue
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-8 shrink-0 flex items-center justify-center text-xs text-slate-400">
        Powered by <span className="font-bold text-blue-600 ml-1">ScanQ</span>
      </footer>
    </div>
  );
}

export default QueueCalled;

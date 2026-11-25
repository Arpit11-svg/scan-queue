import { Ticket, Users, RefreshCw, LogOut, Clock3 } from "lucide-react";

function QueueWaiting({
  customer,
  status,
  error,
  refreshing,
  leaving,
  fetchQueueStatus,
  setShowLeaveModal,
}) {
  const getFirstName = (fullName) => {
    if (!fullName) return "Dear Customer";
    const name = fullName.split(" ")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

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

        <div
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-emerald-50 text-emerald-700`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          Queue Active
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-5">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden">
          {/* Welcome */}
          <div className="text-center px-4 pt-5 pb-3">
            <h1 className="text-xl font-bold text-slate-800">
              You're in the queue
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Hello, {getFirstName(customer.name)}! Track your position here.
            </p>
          </div>

          {/* Token Number */}
          <div className="mx-4 sm:mx-5 mt-2 bg-blue-50 rounded-2xl py-5 text-center">
            <p className="text-xs font-bold text-blue-500 tracking-widest uppercase">
              Your Token Number
            </p>

            <h2 className="text-6xl font-extrabold text-blue-600 mt-1">
              #{customer.token_number ?? "--"}
            </h2>

            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white text-xs font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {status}
            </span>
          </div>

          {/* Queue Statistics */}
          <div className="grid grid-cols-2 gap-3 px-4 sm:px-5 py-4">
            <div className="border border-slate-100 rounded-2xl p-3 text-center">
              <Ticket className="w-5 h-5 text-blue-600 mx-auto" />

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {customer.position ?? "--"}
              </p>

              <p className="text-xs text-slate-400">Your Position</p>
            </div>

            <div className="border border-slate-100 rounded-2xl p-3 text-center">
              <Users className="w-5 h-5 text-violet-600 mx-auto" />

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {customer.people_ahead ?? "--"}
              </p>

              <p className="text-xs text-slate-400">People Ahead</p>
            </div>
          </div>

          {/* Information */}
          <div className="mx-4 sm:mx-5 mb-4 bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <Clock3 className="w-5 h-5 text-blue-500 shrink-0" />

            <p className="text-xs text-slate-500 leading-relaxed">
              Relax and enjoy your time. Keep track of your turn here.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 text-center px-5 pb-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="px-4 sm:px-5 pb-5 space-y-2">
            <button
              onClick={() => fetchQueueStatus(true)}
              disabled={refreshing || leaving}
              className="w-full h-11 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh Status"}
            </button>

            <button
              onClick={() => setShowLeaveModal(true)}
              disabled={leaving}
              className="w-full h-11 flex items-center justify-center gap-2 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-xl text-sm font-semibold transition"
            >
              <LogOut size={16} />
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

export default QueueWaiting;

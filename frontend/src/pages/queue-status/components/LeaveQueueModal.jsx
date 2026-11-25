import { createPortal } from "react-dom";
import { X, LogOut, LoaderCircle } from "lucide-react";

const LeaveQueueModal = ({
  showLeaveModal,
  setShowLeaveModal,
  leaving,
  handleLeaveQueue,
}) => {
  if (!showLeaveModal) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !leaving) {
          setShowLeaveModal(false);
        }
      }}
    >
      <div className="relative w-full max-w-[320px] max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-2xl p-5 shadow-2xl">

        <button
          onClick={() => setShowLeaveModal(false)}
          disabled={leaving}
          className="absolute top-4 right-4 text-slate-400"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <LogOut className="w-6 h-6 text-red-500" />
        </div>

        <h2 className="text-lg font-bold text-slate-800 mt-4">
          Leave Queue?
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Are you sure you want to leave the queue?
          Your current position will be cancelled and
          you may need to join again.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => setShowLeaveModal(false)}
            disabled={leaving}
            className="h-11 rounded-xl border border-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={handleLeaveQueue}
            disabled={leaving}
            className="h-11 rounded-xl bg-red-600 text-white flex items-center justify-center gap-2"
          >
            {leaving && (
              <LoaderCircle size={16} className="animate-spin" />
            )}

            {leaving ? "Leaving..." : "Yes, Leave"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LeaveQueueModal;

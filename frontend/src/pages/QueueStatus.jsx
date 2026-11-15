import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Ticket,
  Users,
  RefreshCw,
  LogOut,
  Clock3,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import { useParams } from "react-router-dom";
import QueueService from "../services/queue.service.js";

function QueueStatus() {
  const { publicToken } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch queue status
  const fetchQueueStatus = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      try {
        const response = await QueueService.getQueuePosition(publicToken);
        setCustomer(response.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to fetch queue status.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [publicToken],
  );

  useEffect(() => {
    fetchQueueStatus();
  }, [fetchQueueStatus]);

  // Leave queue
  const handleLeaveQueue = async () => {
    setLeaving(true);
    setError("");

    try {
      await QueueService.leaveQueue(publicToken);

      setCustomer((prev) => ({
        ...prev,
        status: "CANCELLED",
      }));

      setShowLeaveModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to leave queue.");
    } finally {
      setLeaving(false);
    }
  };

  const status = customer?.status?.toUpperCase();
  const isCancelled = status === "CANCELLED";
  const isCalled = status === "CALLED";
  const isServed = status === "SERVED";

  const getFirstName = (fullName) => {
    if (!fullName) return "Dear Customer";
    const name = fullName.split(" ")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-500 mt-3">Loading your queue...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (!customer) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-5">
        <div className="w-full max-w-sm bg-white rounded-3xl p-7 text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />

          <h2 className="text-xl font-bold text-slate-800 mt-4">
            Queue unavailable
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error || "Your queue entry could not be found."}
          </p>

          <button
            onClick={() => fetchQueueStatus()}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Cancelled screen
  if (isCancelled) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-5">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-lg">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />

          <h2 className="text-xl font-bold text-slate-800 mt-4">
            You've left the queue!
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Your queue entry has been cancelled successfully. Thank you for
            using ScanQ.
          </p>

          <p className="text-xs text-slate-400 mt-8">
            Powered by <span className="font-bold text-blue-600">ScanQ</span>
          </p>
        </div>
      </div>
    );
  }

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
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full ${
            isCalled
              ? "bg-emerald-50 text-emerald-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {isCalled ? "Your Turn" : "Queue Active"}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-5">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden">
          {/* Welcome */}
          <div className="text-center px-4 pt-5 pb-3">
            <h1 className="text-xl font-bold text-slate-800">
             {isCalled
                ? "It's your turn!"
                : isServed
                  ? "Service completed!"
                  : "You're in the queue"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Hello, {getFirstName(customer.name)}!{" "}
              {isCalled
                ? "Please proceed to the counter."
                : "Track your position here."}
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
              {isCalled
                ? "Your token has been called. Please proceed to the counter."
                : "Relax and enjoy your time. Keep track of your turn here."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 text-center px-5 pb-2">
              {error}
            </p>
          )}

          {/* Actions */}
          {!isServed && (
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
          )}

          {isServed && (
            <div className="text-center text-xs text-slate-400 pb-5">
              Your queue journey is complete.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-8 shrink-0 flex items-center justify-center text-xs text-slate-400">
        Powered by <span className="font-bold text-blue-600 ml-1">ScanQ</span>
      </footer>

      {/* Confirmation Modal - Rendered directly inside document.body */}
      {showLeaveModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !leaving) {
                setShowLeaveModal(false);
              }
            }}
          >
            <div className="relative w-full max-w-[320px] max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-2xl p-5 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setShowLeaveModal(false)}
                disabled={leaving}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-500" />
              </div>

              <h2 className="text-lg font-bold text-slate-800 mt-4">
                Leave Queue?
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to leave the queue? Your current position
                will be cancelled and you may need to join again.
              </p>

              {/* Modal Actions */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  disabled={leaving}
                  className="h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLeaveQueue}
                  disabled={leaving}
                  className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {leaving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}

                  {leaving ? "Leaving..." : "Yes, Leave"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default QueueStatus;

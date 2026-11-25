import React, { useCallback, useEffect, useState } from "react";
import { LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import QueueService from "../services/queue.service.js";
import { io } from "socket.io-client";
import QueueWaiting from "./queue-status/QueueWaiting.jsx";
import QueueCalled from "./queue-status/QueueCalled.jsx";
import LeaveQueueModal from "./queue-status/components/LeaveQueueModal.jsx";

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

  useEffect(() => {
    if (!publicToken) return;

    const socket = io(
      import.meta.env.VITE_API_BASE_URL.replace("/api/v1", ""),
      {
        auth: {
          publicToken,
        },
      },
    );

    socket.on("connect", () => {
      console.log("Customer connected:", socket.id);
    });

    socket.on("customerCalled", (data) => {
      console.log(data.message);

      // Fetch the latest customer status from PostgreSQL
      fetchQueueStatus();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [publicToken, fetchQueueStatus]);

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

  //Served Screen
  if (isServed) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-5">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-lg">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />

          <h2 className="text-xl font-bold text-slate-800 mt-4">
            You have been served successfully!
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Thank you for using ScanQ.
          </p>

          <p className="text-xs text-slate-400 mt-8">
            Powered by <span className="font-bold text-blue-600">ScanQ</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {status === "WAITING" && (
        <QueueWaiting
          customer={customer}
          status={status}
          error={error}
          refreshing={refreshing}
          leaving={leaving}
          fetchQueueStatus={fetchQueueStatus}
          setShowLeaveModal={setShowLeaveModal}
        />
      )}
      {status === "CALLED" && (
        <QueueCalled
          customer={customer}
          showLeaveModal={showLeaveModal}
          setShowLeaveModal={setShowLeaveModal}
          handleLeaveQueue={handleLeaveQueue}
        />
      )}
      <LeaveQueueModal
        showLeaveModal={showLeaveModal}
        setShowLeaveModal={setShowLeaveModal}
        leaving={leaving}
        handleLeaveQueue={handleLeaveQueue}
      />
      ;
    </>
  );
}

export default QueueStatus;

import React, { useEffect, useState, useCallback } from "react";
import {
  Settings,
  LogOut,
  UserRound,
  Headset,
  Users,
  User,
} from "lucide-react";
import businessService from "../services/business.service.js";
import authService from "../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo.jsx";
import IconButton from "../components/ui/IconButton.jsx";

import { io } from "socket.io-client";

function Dashboard() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queueEntries, setQueueEntries] = useState([]);
  const [callingNext, setCallingNext] = useState(false);
  const [queueStats, setQueueStats] = useState({
    waiting: 0,
    called: 0,
    served: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  const fetchQueueEntries = useCallback(async () => {
    try {
      const entries = await businessService.getQueueEntries();
      setQueueStats(entries.data.stats);
      setQueueEntries(entries.data.customers);
    } catch (error) {
      console.error("Error fetching queue entries:", error);
    }
  }, []);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const businessData = await businessService.getProfile();
        setBusiness(businessData.business);
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  useEffect(() => {
    fetchQueueEntries();

    //we are connecting backend server, not to any endpoint(remove endpoint). so that we can listen to all events from backend server.
    const socket = io(
      import.meta.env.VITE_API_BASE_URL.replace("/api/v1", ""),
      {
        withCredentials: true,
      },
    );

    // any time the queue is updated, we will fetch the latest queue entries
    socket.on("queueUpdated", fetchQueueEntries);

    // Cleanup
    return () => {
      socket.off("queueUpdated", fetchQueueEntries);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
      setBusiness(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCallNext = async () => {
    try {
      setCallingNext(true);

      const response = await businessService.callNextCustomer();

      alert(`Customer called: ${response.data.name}`);
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to call the next customer.",
      );
    } finally {
      setCallingNext(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Dashboard Navbar */}
      <header className="px-4 py-4 md:px-8">
        <nav
          className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl
          border border-white/80 shadow-sm rounded-2xl
          px-4 sm:px-6 py-4"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <Logo />
              <span className="text-xl font-bold tracking-tight text-slate-800">
                ScanQ
              </span>
            </div>

            {/* Right Navbar Items */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* SMS Status */}
              <div
                className="hidden md:flex items-center gap-2
                bg-slate-50 border border-slate-100
                rounded-full px-3 py-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-600">SMS</span>
              </div>

              {/* WhatsApp Status */}
              <div
                className="hidden md:flex items-center gap-2
                bg-slate-50 border border-slate-100
                rounded-full px-3 py-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-600">
                  WhatsApp
                </span>
              </div>

              {/* Business Email */}
              <div className="hidden sm:flex items-center gap-2 text-slate-600">
                <IconButton icon={UserRound} title="Business Profile" />
                <span className="text-sm max-w-[180px] truncate">
                  {business?.email}
                </span>
              </div>

              {/* Settings Icon */}
              <IconButton icon={Settings} title="Settings" />

              {/* support Icon */}
              <IconButton icon={Headset} title="Support" />

              {/* Logout */}
              <IconButton
                icon={LogOut}
                title="Logout"
                onClick={logout}
                className="hover:text-red-600 hover:bg-red-50"
              />
            </div>
          </div>
        </nav>
      </header>

      {/* QRCode Generator */}
      <main
        className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl
              border border-white/80 shadow-sm rounded-2xl
              px-4 sm:px-6 py-4 flex items-center justify-between"
      >
        <span className="text-xl font-bold text-slate-800">
          {business?.name}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/qrcode")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            QR Code
          </button>

          <button
            onClick={() => navigate(`/join/${business.id}/${business.name}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Walk-In
          </button>
        </div>
      </main>

      {/* today's Queue Stats */}
      <section
        className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl
              border border-white/80 shadow-sm rounded-2xl
              px-4 sm:px-6 py-4 mt-6"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Today's Queue Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Waiting</p>
            <p className="text-2xl font-bold text-slate-800">
              {queueStats.waiting}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Called</p>
            <p className="text-2xl font-bold text-slate-800">
              {queueStats.called}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Served</p>
            <p className="text-2xl font-bold text-slate-800">
              {queueStats.served}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-sm text-slate-500">Current Time</p>
            <p className="text-2xl font-bold text-slate-800">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </section>

      {/* Queue Entries */}
      <section
        className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl
        border border-white/80 shadow-sm rounded-2xl
        px-4 sm:px-6 py-4 mt-6"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4">Queue Entries</h2>

        {queueEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="w-10 h-10 text-slate-300 mb-3" />

            <p className="font-semibold text-slate-700">
              No customers in the queue
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Customers who join your queue will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queueEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="font-medium text-slate-800">{entry.name}</p>
                    <p className="text-sm text-slate-500">
                      Token: #{entry.token_number}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* managing customer */}
      <button
        onClick={handleCallNext}
        disabled={callingNext}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg
             disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {callingNext ? "Calling..." : "Call Next Customer"}
      </button>
    </div>
  );
}

export default Dashboard;

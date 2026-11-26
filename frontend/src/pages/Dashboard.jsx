import React, { useEffect, useState, useCallback } from "react";
import {
  Settings,
  LogOut,
  UserRound,
  Headset,
  Users,
  User,
  PhoneCall,
  Hash,
  UserCheck,
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
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [leaving, setLeaving] = useState(false);

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

  const fetchActiveCustomer = useCallback(async () => {
    try {
      const customer = await businessService.getActiveCustomer();
      console.log("Active customer from DASHBOARD>JSX: ", customer);
      setActiveCustomer(customer.data);
    } catch (error) {
      console.error("Error fetching queue entries:", error);
    }
  }, []);

  const cancelActiveCustomer = useCallback(async () => {
    setLeaving(true);
    try {
      await businessService.cancelActiveCustomer(activeCustomer.id);
      setActiveCustomer(null);

      alert("Customer cancelled successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to cancel customer.");
    }
    finally{
      setLeaving(false);
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
      await fetchActiveCustomer();
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

      {/* Customer Management */}
      <section
        className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl
        border border-white/80 shadow-sm rounded-2xl
        px-4 sm:px-6 py-4 mt-6"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Customer Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your currently active customer.
          </p>
        </div>

        <div className="p-6">
          {/* Call Next Button */}
          <button
            onClick={handleCallNext}
            disabled={callingNext || !!activeCustomer}
            className="w-full flex items-center justify-center gap-3
            bg-blue-600 hover:bg-blue-700 text-white
            py-4 px-5 rounded-xl font-semibold
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PhoneCall size={19} />

            {callingNext
              ? "Calling Customer..."
              : activeCustomer
                ? "Customer Already Active"
                : "Call Next Customer"}
          </button>

          {/* Active Customer */}
          <div className="mt-6">
            {activeCustomer ? (
              <div className="border border-blue-200 rounded-xl overflow-hidden">
                {/* Active Header */}
                <div className="bg-blue-50 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck size={19} className="text-blue-600" />
                    <h3 className="font-semibold text-slate-800">
                      Active Customer
                    </h3>
                  </div>

                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {activeCustomer.status}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="p-5">
                  {/* Name and Token */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserRound size={23} className="text-blue-600" />
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Customer Name</p>
                        <h4 className="text-lg font-bold text-slate-800">
                          {activeCustomer.name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Token Number</p>
                      <p className="text-2xl font-bold text-blue-600">
                        #{activeCustomer.token_number}
                      </p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Users size={15} />
                        <span className="text-xs">Party Size</span>
                      </div>
                      <p className="font-semibold text-slate-800">
                        {activeCustomer.party_size}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Hash size={15} />
                        <span className="text-xs">Customer ID</span>
                      </div>
                      <p className="font-semibold text-slate-800">
                        {activeCustomer.id}
                      </p>
                    </div>
                  </div>

                  {/* Cancel Customer */}
                  <button
                    onClick={cancelActiveCustomer}
                    disabled={leaving}
                    className="mt-5 w-full h-11 flex items-center justify-center gap-2
                    border border-red-200 text-red-600
                    hover:bg-red-50 rounded-lg font-semibold text-sm
                    transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut size={17} />
                    {leaving ? "Cancelling..." : "Cancel Customer"}
                  </button>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserRound size={26} className="text-slate-400" />
                </div>

                <h3 className="font-semibold text-slate-700">
                  No Active Customer
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Call the next customer when you're ready to serve.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import {
  Settings,
  LogOut,
  UserRound,
  Headset,
  MessageSquare,
  User,
} from "lucide-react";
import businessService from "../services/business.service.js";
import authService from "../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo.jsx";
import IconButton from "../components/ui/IconButton.jsx";

function Dashboard() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queueEntries, setQueueEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const businessData = await businessService.getProfile();
        setBusiness(businessData);
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  useEffect(() => {
    const fetchQueueEntries = async () => {
      try {
        const entries = await businessService.getQueueEntries();
        console.log("Fetched queue entries:", entries.data);
        setQueueEntries(entries.data);
      } catch (error) {
        console.error("Error fetching queue entries:", error);
      }
    };

    fetchQueueEntries();
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

      {/* Queue Entries */}
      <section
        className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl
              border border-white/80 shadow-sm rounded-2xl
              px-4 sm:px-6 py-4 mt-6"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Queue Entries
        </h2>

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
                  <p className="text-sm text-slate-500">Token: #{entry.token_number}</p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                {entry.status}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Dashboard;

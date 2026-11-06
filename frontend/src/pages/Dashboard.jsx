import React, { useEffect, useState } from "react";
import {
  Settings,
  LogOut,
  UserRound,
  Headset ,
  MessageSquare,
} from "lucide-react";
import profileService from "../services/profile.service.js";
import authService from "../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo.jsx";
import IconButton from "../components/ui/IconButton.jsx";

function Dashboard() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        setBusiness(profile.business);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
              <IconButton icon={Headset} title="Support"  />

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
    </div>
  );
}

export default Dashboard;

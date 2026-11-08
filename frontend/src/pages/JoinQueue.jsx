import React, { useState } from "react";
import { useParams } from "react-router-dom";
import QueueService from "../services/queue.service.js";

function JoinQueue() {
  const { businessId, businessName } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    partySize: 1,
    mobile: "",
    description: "",
    notificationConsent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const increaseParty = () => {
    setFormData((prev) => ({
      ...prev,
      partySize: Math.min(prev.partySize + 1, 20),
    }));
  };

  const decreaseParty = () => {
    setFormData((prev) => ({
      ...prev,
      partySize: Math.max(prev.partySize - 1, 1),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerDetails = {
      ...formData,
      businessId,
    };

    console.log("Customer Details:", customerDetails);
    setLoading(true);

    try {
      const response = await QueueService.joinQueue(businessId, customerDetails);
      setSuccess("You have successfully joined the queue!");
      console.log("Join Queue Response:", response);
      setError("");
      setFormData({
        name: "",
        partySize: 1,
        mobile: "",
        description: "",
        notificationConsent: false,
      });
    } catch (error) {
      console.error("Error joining the queue:", error);
      setError("Failed to join the queue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-xl">🔵</span>
          <span className="font-bold text-gray-800 text-lg">ScanQ</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {decodeURIComponent(businessName)}
        </h1>

        <p className="text-gray-500 mt-3 text-sm sm:text-base">
          Welcome! Join our queue to reduce your wait time.
        </p>

        {/* Queue Information */}
        <div className="grid grid-cols-2 bg-blue-50 rounded-2xl p-5 mt-7 mb-5">
          <div className="text-center border-r border-blue-200">
            <p className="text-blue-500 text-xs font-semibold uppercase">
              Current Wait
            </p>

            <h3 className="font-bold text-gray-900 mt-1">-- mins</h3>
          </div>

          <div className="text-center">
            <p className="text-blue-500 text-xs font-semibold uppercase">
              Ahead of You
            </p>

            <h3 className="font-bold text-gray-900 mt-1">-- People</h3>
          </div>
        </div>

        {/* Join Queue Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 text-left">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Join the Queue</h2>

            <p className="text-gray-500 text-sm mt-2">
              Fill in your details to get in line.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/*  Error and Success Messages */}
            {success && (
              <p className="rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {success}
              </p>
            )}
            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}
            {/* Customer Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                maxLength={100}
                autoComplete="name"
                className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* Party Size and Phone */}
            <div className="grid grid-cols-2 gap-3">
              {/* Party Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party Size <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-lg px-2 py-2.5">
                  <button
                    type="button"
                    onClick={decreaseParty}
                    disabled={formData.partySize <= 1}
                    className="px-2 text-gray-500 hover:text-blue-600 disabled:opacity-40"
                    aria-label="Decrease party size"
                  >
                    −
                  </button>

                  <span className="font-semibold text-sm">
                    {formData.partySize}
                  </span>

                  <button
                    type="button"
                    onClick={increaseParty}
                    disabled={formData.partySize >= 20}
                    className="px-2 text-gray-500 hover:text-blue-600 disabled:opacity-40"
                    aria-label="Increase party size"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>

                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91"
                  autoComplete="tel"
                  className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Special Requests{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter special requests"
                rows={3}
                maxLength={500}
                className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* Notification Consent */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="notificationConsent"
                name="notificationConsent"
                checked={formData.notificationConsent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-blue-600 cursor-pointer"
              />

              <label
                htmlFor="notificationConsent"
                className="text-xs text-gray-500 leading-relaxed cursor-pointer"
              >
                I agree to receive queue notifications from ScanQ for my queue
                status at {decodeURIComponent(businessName)}
                by WhatsApp or SMS. Message and data rates may apply.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-full transition duration-200 active:scale-[0.98]"
            >
              {loading ? "Joining..." : "Join Queue"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">Powered by ScanQ</p>
      </div>
    </div>
  );
}

export default JoinQueue;

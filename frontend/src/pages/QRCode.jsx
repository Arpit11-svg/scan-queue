import React, { useEffect, useState } from "react";
import QRCodeService from "../services/qrcode.service.js";

function QRCode() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await QRCodeService.generateQRCode();

        if (response.success) {
          setQrData(response);
        } else {
          setError("Unable to generate QR code.");
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
        setError("Something went wrong while generating QR code.");
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, []);

  if (loading) {
    return <p>Generating QR Code...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className=" text-black text-3xl font-bold mb-3">
        Your Business QR Code
      </h1>

      <p className="text-gray-500 mb-6">
        Customers can scan this QR code to join your queue.
      </p>

      {/* QR Code Image */}
      <div className="bg-white p-5 rounded-xl shadow-lg">
        <img src={qrData.qrCode} alt="Business QR Code" className="w-64 h-64" />
      </div>

      <p className="mt-4 text-sm text-gray-500">{qrData.customerPageURL}</p>

      <a
        href={qrData.qrCode}
        download="ScanQ-Business-QR.png"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Download QR Code
      </a>
    </div>
  );
}

export default QRCode;

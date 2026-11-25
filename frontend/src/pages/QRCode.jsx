import { useEffect, useState } from "react";
import {
  QrCode as QRIcon,
  Download,
  Copy,
  Check,
  ExternalLink,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import QRCodeService from "../services/qrcode.service.js";

function QRCode() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData.customerPageURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy link:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <LoaderCircle className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 mt-4 font-medium">
          Generating your QR code...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center max-w-sm w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800 mt-4">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <QRIcon size={22} />
            <span className="text-sm font-semibold">QR Code Management</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Your Business QR Code
          </h1>

          <p className="text-slate-500 mt-2">
            Let customers join your queue by simply scanning this QR code.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* QR Code Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col items-center">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Scan to Join Queue
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Display this QR code at your counter
              </p>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm">
              <img
                src={qrData.qrCode}
                alt="Business QR Code"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            </div>

            <div className="mt-6 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
              <Check size={16} />
              <span className="text-xs font-semibold">
                Your QR code is ready
              </span>
            </div>

            <a
              href={qrData.qrCode}
              download="ScanQ-Business-QR.png"
              className="mt-6 w-full max-w-xs h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              <Download size={18} />
              Download QR Code
            </a>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col">
            <h2 className="text-lg font-bold text-slate-800">How It Works</h2>

            <p className="text-sm text-slate-500 mt-1">
              Get started with ScanQ in three simple steps.
            </p>

            <div className="space-y-6 mt-8">
              {[
                {
                  number: "01",
                  title: "Download your QR code",
                  description:
                    "Save the QR code and print it for your business.",
                },
                {
                  number: "02",
                  title: "Display it at your counter",
                  description:
                    "Place it somewhere customers can easily scan it.",
                },
                {
                  number: "03",
                  title: "Customers join instantly",
                  description:
                    "Customers scan the code and join your digital queue.",
                },
              ].map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Page Link */}
            <div className="mt-auto pt-8">
              <label className="text-sm font-semibold text-slate-700">
                Customer Queue Link
              </label>

              <div className="flex items-center gap-2 mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-xs text-slate-600 truncate flex-1">
                  {qrData.customerPageURL}
                </p>

                <button
                  onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <ExternalLink size={13} />
                You can also share this link directly with customers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <QRIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <span className="font-semibold">Tip:</span> Print your QR code and
            place it at the entrance or reception desk so customers can join
            your queue without waiting in a physical line.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QRCode;

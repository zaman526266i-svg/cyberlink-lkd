"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

function sanitizeFileNamePart(value) {
  return String(value || "")
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function downloadRequestPdf(requestData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const now = new Date().toLocaleString();
  const marginLeft = 48;
  const maxWidth = 500;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 52;

  const rows = [
    ["Generated", now],
    ["Request ID", requestData._id || "N/A"],
    ["Full Name", requestData.fullName || "N/A"],
    ["Email", requestData.email || "N/A"],
    ["Mobile", requestData.mobile || "N/A"],
    ["Phone", requestData.phone || "N/A"],
    ["Package", requestData.package || "N/A"],
    ["Location", requestData.location || "N/A"],
    ["Flat No", requestData.flatNo || "N/A"],
    ["House No", requestData.houseNo || "N/A"],
    ["Road No", requestData.roadNo || "N/A"],
    ["Area", requestData.area || "N/A"],
    ["Landmark", requestData.landmark || "N/A"],
    ["NID", requestData.nid || "N/A"],
    ["Latitude", requestData.latitude || "N/A"],
    ["Longitude", requestData.longitude || "N/A"],
    ["Google Map", requestData.mapLink || "N/A"],
    ["Status", "Submitted"],
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("CyberLink - New Connection Request", marginLeft, y);
  y += 28;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  for (const [key, value] of rows) {
    const wrapped = doc.splitTextToSize(`${key}: ${String(value)}`, maxWidth);
    const neededHeight = wrapped.length * 16;
    if (y + neededHeight > pageHeight - 48) {
      doc.addPage();
      y = 52;
    }
    doc.text(wrapped, marginLeft, y);
    y += neededHeight;
  }

  const namePart = sanitizeFileNamePart(requestData.fullName) || "customer";
  const fileName = `new-collection-request-of-${namePart}.pdf`;
  doc.save(fileName);
}

export default function ConnectionForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [regions, setRegions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    package: "",
    location: "",
    flatNo: "",
    houseNo: "",
    roadNo: "",
    area: "",
    landmark: "",
    fullName: "",
    email: "",
    mobile: "",
    phone: "",
    nid: "",
    latitude: "",
    longitude: "",
    mapLink: "",
  });

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  useEffect(() => {
    const loadCoverage = async () => {
      try {
        const response = await fetch("/api/coverage", { cache: "no-store" });
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data?.regions)) {
          const mappedRegions = data.data.regions.map((region) => ({
            name: region.name,
            areas: region.areas || [],
          }));
          setRegions(mappedRegions);
        }
      } catch {
        setRegions([]);
      }
    };

    loadCoverage();
  }, []);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await fetch("/api/packages", { cache: "no-store" });
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data?.packages)) {
          setPackages(data.data.packages);
        } else {
          setPackages([]);
        }
      } catch {
        setPackages([]);
      }
    };

    loadPackages();
  }, []);

  const handleNext = () => {
    if (!formData.package || !formData.location) {
      alert("Package and location are required.");
      return;
    }
    setStep(2);
  };

  const captureCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = String(position.coords.latitude);
        const longitude = String(position.coords.longitude);
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          mapLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
        }));
        setLocating(false);
      },
      () => {
        alert("Could not capture location. Please enable location permission.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        const requestData = result?.request || { ...formData, _id: result?.id || "" };
        downloadRequestPdf(requestData);
        alert("Your request has been submitted successfully. PDF downloaded.");
        router.push("/");
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch {
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="flex bg-slate-800/50 border-b border-slate-800">
          <div className={`flex-1 py-5 text-center text-[10px] font-black tracking-[0.2em] transition-all ${step === 1 ? "bg-orange-600 text-white" : "text-slate-500"}`}>01. ADDRESS</div>
          <div className={`flex-1 py-5 text-center text-[10px] font-black tracking-[0.2em] transition-all ${step === 2 ? "bg-orange-600 text-white" : "text-slate-500"}`}>02. PERSONAL</div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-14">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-2">
                <label className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Select Package *</label>
                <select name="package" value={formData.package} onChange={handleChange} required className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all">
                  <option value="">Choose your speed</option>
                  {packages.map((pkg, index) => (
                    <option key={index} value={pkg.label}>
                      {pkg.label} - {pkg.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Select Location *</label>
                <select name="location" value={formData.location} onChange={handleChange} required className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all">
                  <option value="">Choose your area</option>
                  {regions.map((region, index) => (
                    <optgroup key={index} label={region.name} className="bg-slate-900 text-orange-500">
                      {region.areas.map((area, areaIndex) => (
                        <option key={areaIndex} value={`${area}, ${region.name}`} className="text-white">
                          {area}, {region.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {["flatNo", "houseNo", "roadNo", "area"].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{field.replace("No", " No")} *</label>
                  <input type="text" name={field} onChange={handleChange} required className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all" />
                </div>
              ))}

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Landmark</label>
                <input type="text" name="landmark" onChange={handleChange} placeholder="Example: near mosque or market" className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all" />
              </div>

              <div className="md:col-span-2 bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Precise Location</p>
                  <p className="text-xs text-slate-400">
                    {formData.latitude && formData.longitude
                      ? `Lat: ${formData.latitude}, Lng: ${formData.longitude}`
                      : "Capture your current GPS coordinates for faster support."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={captureCurrentLocation}
                  disabled={locating}
                  required
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white text-xs font-black uppercase px-5 py-3 rounded-xl"
                >
                  {locating ? "Capturing..." : "Use Current Location"}
                </button>
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <button type="button" onClick={handleNext} className="bg-orange-600 hover:bg-orange-700 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-orange-600/30">
                  NEXT STEP &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col gap-2">
                <label className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Full Name *</label>
                <input type="text" name="fullName" onChange={handleChange} required className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-orange-400 text-[10px] font-black uppercase tracking-widest">E-mail *</label>
                <input type="email" name="email" onChange={handleChange} required className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Mobile No *</label>
                <div className="flex gap-3">
                  <input type="tel" name="mobile" onChange={handleChange} required className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all" />
                  <button type="button" className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-6 rounded-2xl font-black uppercase">
                    Verify
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">NID (Optional)</label>
                <input type="text" name="nid" onChange={handleChange} className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all" />
              </div>

              <div className="md:col-span-2 flex justify-between items-center mt-10 border-t border-slate-800 pt-10">
                <button type="button" onClick={() => setStep(1)} className="text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
                  &larr; Back
                </button>
                <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-orange-600/30 disabled:opacity-50">
                  {loading ? "SENDING..." : "CONFIRM REQUEST"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

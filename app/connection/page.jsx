"use client";

import { Suspense, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useSearchParams } from "next/navigation";

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

  const ensureSpace = (neededHeight) => {
    if (y + neededHeight > pageHeight - 48) {
      doc.addPage();
      y = 52;
    }
  };

  const addSection = (title) => {
    ensureSpace(28);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(marginLeft, y - 4, 500, 22, 6, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), marginLeft + 12, y + 10);
    y += 34;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
  };

  const addField = (label, value) => {
    const text = `${label}: ${String(value || "N/A")}`;
    const wrapped = doc.splitTextToSize(text, maxWidth);
    const neededHeight = wrapped.length * 16 + 4;
    ensureSpace(neededHeight);
    doc.text(wrapped, marginLeft, y);
    y += neededHeight;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text("CyberLink", marginLeft, y);
  y += 22;

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("New Connection Request", marginLeft, y);
  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginLeft, y + 10, marginLeft + maxWidth, y + 10);
  y += 28;

  addSection("Request Info");
  addField("Generated", now);
  addField("Request ID", requestData._id || "N/A");
  addField("Status", "Submitted");

  addSection("Personal Info");
  addField("Full Name", requestData.fullName || "N/A");
  addField("Email", requestData.email || "N/A");
  addField("Mobile", requestData.mobile || "N/A");
  addField("Phone", requestData.phone || "N/A");
  addField("NID", requestData.nid || "N/A");
  addField("Referred By", requestData.reference || requestData.referenceSource || "N/A");

  addSection("Package And Address");
  addField("Package", requestData.package || "N/A");
  addField("Location", requestData.location || "N/A");
  addField("Flat No", requestData.flatNo || "N/A");
  addField("House No", requestData.houseNo || "N/A");
  addField("Road No", requestData.roadNo || "N/A");
  addField("Area", requestData.area || "N/A");
  addField("Landmark", requestData.landmark || "N/A");

  addSection("Location Details");
  addField("Latitude", requestData.latitude || "N/A");
  addField("Longitude", requestData.longitude || "N/A");
  addField("Google Map", requestData.mapLink || "N/A");

  const namePart = sanitizeFileNamePart(requestData.fullName) || "customer";
  const fileName = `new-collection-request-of-${namePart}.pdf`;
  doc.save(fileName);
}

export default function ConnectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-400 text-sm font-semibold">
          Loading form...
        </div>
      }
    >
      <ConnectionForm />
    </Suspense>
  );
}

function ConnectionForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
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
    reference: "",
    referenceSource: "",
    latitude: "",
    longitude: "",
    mapLink: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const loadCoverage = async () => {
      try {
        const response = await fetch("/api/coverage");
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
        const response = await fetch("/api/packages");
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

  useEffect(() => {
    const requestedPackage = (searchParams.get("package") || "").trim();
    const requestedPlan = (searchParams.get("plan") || "").trim();
    const kind = (searchParams.get("kind") || "").trim().toLowerCase();
    if (!requestedPackage && !requestedPlan) return;

    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

    if (kind === "sme" && requestedPackage) {
      const smeLabel = requestedPlan ? `${requestedPackage} — ${requestedPlan} (SME)` : `${requestedPackage} (SME)`;
      const needle = normalize(smeLabel);

      const matchedPackage = packages.find((pkg) => {
        const label = normalize(pkg?.label);
        if (!label) return false;
        if (label === needle || label.includes(needle) || needle.includes(label)) return true;
        const pkgSpeed = normalize(requestedPackage);
        const pkgPlan = normalize(requestedPlan);
        if (pkgSpeed && label.includes(pkgSpeed) && (!pkgPlan || label.includes(pkgPlan))) return true;
        return false;
      });

      const labelToUse = matchedPackage?.label || smeLabel;

      setPackages((prev) => {
        const n = normalize(labelToUse);
        if (prev.some((p) => normalize(p.label) === n)) return prev;
        return [...prev, { label: labelToUse, price: matchedPackage?.price || "", category: "sme" }];
      });

      setFormData((prev) => (prev.package ? prev : { ...prev, package: labelToUse }));
      return;
    }

    if (!packages.length) return;

    const packageNeedle = normalize(requestedPackage);
    const planNeedle = normalize(requestedPlan);

    const matchedPackage = packages.find((pkg) => {
      const label = normalize(pkg?.label);
      if (!label) return false;
      if (packageNeedle && (label === packageNeedle || label.includes(packageNeedle) || packageNeedle.includes(label))) {
        return true;
      }
      return Boolean(planNeedle && label.includes(planNeedle));
    });

    if (matchedPackage?.label) {
      setFormData((prev) => (prev.package ? prev : { ...prev, package: matchedPackage.label }));
    }
  }, [packages, searchParams]);

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

  const startPayment = async (requestData) => {
    if (!requestData?._id) return;
    try {
      setPaymentLoading(true);
      const paymentRes = await fetch("/api/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowType: "new_connection",
          requestId: requestData._id,
          packageLabel: requestData.package || formData.package,
          source: "connection_form",
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.success || !paymentData.data?.gatewayUrl) {
        throw new Error(paymentData.error || "Payment session could not be created.");
      }
      window.location.href = paymentData.data.gatewayUrl;
    } catch {
      alert("Could not start payment right now. You can pay later from support.");
    } finally {
      setPaymentLoading(false);
    }
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
        if (!requestData.reference && requestData.referenceSource) {
          requestData.reference = requestData.referenceSource;
        }
        downloadRequestPdf(requestData);
        setSubmittedRequest(requestData);
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
          {submittedRequest ? (
            <div className="space-y-6">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
                <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">Request Submitted</p>
                <h3 className="text-white text-xl font-black mb-2">Your connection request has been saved.</h3>
                <p className="text-slate-300 text-sm">
                  Request ID: <span className="font-bold">{submittedRequest?._id || "N/A"}</span>
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  You can complete payment now or continue and pay later. Our team can also help you complete payment.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:justify-end">
                <button
                  type="button"
                  onClick={() => startPayment(submittedRequest)}
                  disabled={paymentLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-orange-600/30 disabled:opacity-50"
                >
                  {paymentLoading ? "STARTING PAYMENT..." : "PAY NOW"}
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/")}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-black px-8 py-4 rounded-2xl transition-all"
                >
                  PAY LATER
                </button>
              </div>
            </div>
          ) : null}

          {!submittedRequest && step === 1 ? (
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
          ) : null}

          {!submittedRequest && step === 2 ? (
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

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Referred By</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    name="referenceSource"
                    value={formData.referenceSource}
                    onChange={handleChange}
                    className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all"
                  >
                    <option value="">Select source</option>
                    <option value="Friend/Family">Friend / Family</option>
                    <option value="Agent">Agent</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Website">Website</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="reference"
                    onChange={handleChange}
                    value={formData.reference}
                    placeholder="Name / details (optional)"
                    className="bg-slate-800 border-2 border-slate-700 text-white rounded-2xl p-4 outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  This helps us know where the customer came from. Leave it empty if there is no reference.
                </p>
              </div>

              <div className="md:col-span-2 flex justify-between items-center mt-10 border-t border-slate-800 pt-10">
                <button type="button" onClick={() => setStep(1)} className="text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
                  &larr; Back
                </button>
                <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-orange-600/30 disabled:opacity-50">
                  {loading ? "SUBMITTING REQUEST..." : "SUBMIT REQUEST"}
                </button>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [files, setFiles] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadFiles = async () => {
      setLoadingFiles(true);
      setError("");
      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load content file list.");
        }

        const nextFiles = data.data || [];
        setFiles(nextFiles);
        if (nextFiles.length) {
          setSelectedKey(nextFiles[0].key);
          setSelectedLabel(nextFiles[0].label);
        }
      } catch (loadError) {
        setError(loadError.message || "Failed to load content file list.");
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!selectedKey) return;
      setLoadingContent(true);
      setError("");
      setMessage("");
      try {
        const response = await fetch(`/api/admin/content?key=${encodeURIComponent(selectedKey)}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load file content.");
        }

        setSelectedLabel(data.data.label);
        setRawContent(JSON.stringify(data.data.content, null, 2));
      } catch (loadError) {
        setError(loadError.message || "Failed to load content.");
        setRawContent("");
      } finally {
        setLoadingContent(false);
      }
    };

    loadContent();
  }, [selectedKey]);

  const saveContent = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      JSON.parse(rawContent);
    } catch {
      setError("JSON format is invalid. Please fix it before saving.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: selectedKey, rawContent }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to save content.");
      }

      setMessage("Content saved successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black">Site Content Manager</h2>
        <p className="text-slate-400">Edit site page data stored in MongoDB from this dashboard.</p>
        <p className="text-xs text-slate-500 mt-1">
          For Pay Service default charges, open <span className="font-bold">Pay Bill Page</span> content and set
          <span className="font-mono"> serviceCharges </span>
          keys like new_connection, shift_connection, reconnection, buy_router.
        </p>
      </div>

      {loadingFiles ? <p className="text-slate-400">Loading content files...</p> : null}
      {error ? <p className="text-red-400">{error}</p> : null}
      {message ? <p className="text-emerald-400">{message}</p> : null}

      {!loadingFiles && files.length ? (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
            <label className="text-xs uppercase tracking-widest text-slate-400">Select content</label>
            <select
              value={selectedKey}
              onChange={(event) => setSelectedKey(event.target.value)}
              className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
            >
              {files.map((file) => (
                <option key={file.key} value={file.key}>
                  {file.label} ({file.collection})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">{selectedLabel || "Content File"}</p>
              <button
                type="button"
                onClick={saveContent}
                disabled={saving || loadingContent || !selectedKey}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 px-4 py-2 rounded-lg text-sm font-bold"
              >
                {saving ? "Saving..." : "Save JSON"}
              </button>
            </div>

            {loadingContent ? (
              <p className="text-slate-400">Loading file content...</p>
            ) : (
              <textarea
                value={rawContent}
                onChange={(event) => setRawContent(event.target.value)}
                rows={28}
                spellCheck={false}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 font-mono text-sm outline-none focus:border-orange-500"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

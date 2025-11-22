"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ALLOWED_TYPES = [".csv", ".json"];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file type
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_TYPES.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      setError("Only CSV and JSON files are supported");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 50MB limit");
      return;
    }

    setUploading(true);

    try {
      const fileContent = await file.text();

      // Validate JSON if applicable
      if (fileName.endsWith(".json")) {
        try {
          JSON.parse(fileContent);
        } catch {
          throw new Error("Invalid JSON file format");
        }
      }

      // Encode file content and redirect to analysis page
      const encodedData = encodeURIComponent(fileContent);
      router.push(
        `/analysis?data=${encodedData}&fileName=${encodeURIComponent(file.name)}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process file"
      );
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const recentAnalyses = [
    { name: "sales_data.csv", score: 85, status: "Good", time: "2 hours ago" },
    { name: "users.json", score: 72, status: "Good", time: "1 day ago" },
  ];

  return (
    <div className="page-container">
      <section className="hero-section">
        <h1 className="hero-title">Upload Your Dataset</h1>
        <p className="hero-subtitle">Instant AI-Powered Quality Analysis</p>
      </section>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#991b1b",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <section className="upload-section">
        <div
          className="dropzone"
          style={isDragActive ? { borderColor: "#059669", backgroundColor: "#ecfdf5" } : {}}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="dropzone-icon">📤</div>
          <div className="dropzone-title">
            {uploading ? "Processing..." : "Drag & Drop File Here"}
          </div>
          <div className="dropzone-divider">or</div>
          <label style={{ cursor: "pointer" }}>
            <button
              className="upload-button"
              disabled={uploading}
              onClick={(e) => {
                e.preventDefault();
                const input = document.getElementById("fileInput") as HTMLInputElement;
                input?.click();
              }}
            >
              {uploading ? "Uploading..." : "Choose File"}
            </button>
            <input
              id="fileInput"
              type="file"
              accept=".csv,.json"
              onChange={handleFileInput}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>
          <div className="supported-formats">
            Supported: CSV, JSON (max 50MB)
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="recent-title">Recent Analyses:</div>
        <div className="divider" style={{ borderBottom: "2px solid #1e1e1e" }}></div>

        {recentAnalyses.map((analysis, index) => (
          <div key={index} className="analysis-item">
            <div className="analysis-file">
              📊 {analysis.name}
              <span className="analysis-score">{analysis.score} ({analysis.status})</span>
            </div>
            <div className="analysis-time">Analyzed: {analysis.time}</div>
          </div>
        ))}

        <div className="quick-tips">
          <div className="quick-tips-title">Quick Tips:</div>
          <ul className="tips-list">
            <li>Ensure column headers are in first row</li>
            <li>Remove sensitive data before upload</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

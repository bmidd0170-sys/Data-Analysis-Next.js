"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataAnalysisResult, DataAnalyzer } from "@/lib/dataAnalyzer";
import { AIInsight } from "@/lib/aiAnalyzer";

export default function Analysis() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<DataAnalysisResult | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadReport = async (format: "csv" | "json") => {
    if (!analysis) return;
    setDownloading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, insights, format }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fileData = searchParams.get("data");
    const fileName = searchParams.get("fileName");

    if (!fileData || !fileName) {
      router.push("/");
      return;
    }

    const analyzeFile = async () => {
      try {
        setProgress(25);

        // Decode the file data
        const decodedData = decodeURIComponent(fileData);

        // Analyze the file
        let analysisResult: DataAnalysisResult;
        const extension = fileName.split(".").pop()?.toLowerCase();

        if (extension === "csv") {
          analysisResult = await DataAnalyzer.analyzeCSV(decodedData, fileName);
        } else if (extension === "json") {
          analysisResult = DataAnalyzer.analyzeJSON(decodedData, fileName);
        } else {
          throw new Error("Unsupported file format");
        }

        setAnalysis(analysisResult);
        setProgress(75);

        // Generate AI insights via API route
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis: analysisResult }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate AI insights");
        }

        const { insights: aiInsights } = await response.json();
        setInsights(aiInsights);
        setProgress(100);
      } catch (err) {
        setError((err as Error).message);
        setProgress(0);
      } finally {
        setLoading(false);
      }
    };

    analyzeFile();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <h2 style={{ marginBottom: "20px" }}>Analyzing...</h2>
          <div
            style={{
              width: "100%",
              height: "30px",
              background: "#e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#10b981",
                transition: "width 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
              }}
            >
              {progress}%
            </div>
          </div>
          <p style={{ marginTop: "16px", color: "#6b7280" }}>
            Processing your file and generating insights...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2 style={{ color: "#dc2626", marginBottom: "8px" }}>Error</h2>
          <p style={{ color: "#991b1b" }}>{error}</p>
          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: "16px",
              background: "#ef4444",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return <div className="page-container">No data to display</div>;
  }

  return (
    <div className="page-container">
      {/* File Header */}
      <div
        style={{
          background: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ margin: "0 0 8px 0", color: "#1e1e1e" }}>
          File: {analysis.fileName}
        </h2>
        <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
          {analysis.totalRows} rows × {analysis.totalColumns} columns
        </p>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          background: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
          Analysis Complete ✓
        </p>
        <div
          style={{
            width: "100%",
            height: "24px",
            background: "#e5e7eb",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            100%
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div
        style={{
          background: "#ffffff",
          border: "2px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
          overflowX: "auto",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "16px", color: "#1e1e1e" }}>
          Data Preview (First 5 rows):
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #d1d5db" }}>
              {analysis.columns.map((col) => (
                <th
                  key={col.name}
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontWeight: "600",
                    color: "#1e1e1e",
                    background: "#f3f4f6",
                  }}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analysis.dataPreview.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                {analysis.columns.map((col) => (
                  <td
                    key={`${idx}-${col.name}`}
                    style={{
                      padding: "12px",
                      color: "#374151",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {String(row[col.name] || "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quality Overview */}
      <div
        style={{
          background: "#fef3c7",
          border: "2px solid #1e1e1e",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "16px", color: "#1e1e1e" }}>
          Initial Quality Overview:
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
              Completeness
            </p>
            <div style={{ background: "#ffffff", padding: "8px", borderRadius: "4px" }}>
              <div
                style={{
                  width: `${analysis.completeness}%`,
                  height: "20px",
                  background: "#10b981",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
              {analysis.completeness}%
            </p>
          </div>

          <div>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
              Consistency
            </p>
            <div style={{ background: "#ffffff", padding: "8px", borderRadius: "4px" }}>
              <div
                style={{
                  width: `${analysis.consistency}%`,
                  height: "20px",
                  background: "#3b82f6",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
              {analysis.consistency}%
            </p>
          </div>

          <div>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
              Accuracy
            </p>
            <div style={{ background: "#ffffff", padding: "8px", borderRadius: "4px" }}>
              <div
                style={{
                  width: `${analysis.accuracy}%`,
                  height: "20px",
                  background: "#f59e0b",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
              {analysis.accuracy}%
            </p>
          </div>

          <div>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
              Validity
            </p>
            <div style={{ background: "#ffffff", padding: "8px", borderRadius: "4px" }}>
              <div
                style={{
                  width: `${analysis.validity}%`,
                  height: "20px",
                  background: "#8b5cf6",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
              {analysis.validity}%
            </p>
          </div>
        </div>

        <p style={{ margin: "16px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
          Schema detected: {analysis.totalColumns} columns identified
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
          Data types inferred: {analysis.columns.map((c) => c.type).join(", ")}
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
          Null values found: {analysis.columns.reduce((sum, c) => sum + c.nullCount, 0)}{" "}
          total across {analysis.columns.filter((c) => c.nullCount > 0).length} columns
        </p>


      </div>

      {/* AI Insights */}
      <div
        style={{
          background: "#fef3c7",
          border: "2px solid #1e1e1e",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "16px", color: "#1e1e1e" }}>
          ✨ AI-Powered Insights:
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[...insights].sort((a, b) => {
            const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
            return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          }).map((insight, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                padding: "12px",
                borderLeft: `4px solid ${
                  insight.priority === "High"
                    ? "#ef4444"
                    : insight.priority === "Medium"
                      ? "#f59e0b"
                      : "#10b981"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background:
                      insight.priority === "High"
                        ? "#ef4444"
                        : insight.priority === "Medium"
                          ? "#f59e0b"
                          : "#10b981",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {insight.priority} Priority
                </span>
              </div>
              <p style={{ margin: "0 0 6px 0", fontWeight: "600", color: "#1e1e1e", fontSize: "14px" }}>
                {insight.issue}
              </p>
              <p style={{ margin: "0", color: "#6b7280", fontSize: "13px" }}>
                {insight.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => {
            // Store in sessionStorage to avoid URL length limits
            if (typeof window !== "undefined") {
              sessionStorage.setItem("analysisData", JSON.stringify(analysis));
              sessionStorage.setItem("insightsData", JSON.stringify(insights));
            }
            router.push("/dashboard");
          }}
          style={{
            flex: "1 1 auto",
            background: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            minWidth: "200px",
          }}
        >
          📊 View Full Dashboard
        </button>
        <button
          onClick={() => downloadReport("csv")}
          disabled={downloading}
          style={{
            background: "#10b981",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: downloading ? "not-allowed" : "pointer",
            fontWeight: "600",
            opacity: downloading ? 0.6 : 1,
          }}
        >
          📥 Download CSV
        </button>
        <button
          onClick={() => downloadReport("json")}
          disabled={downloading}
          style={{
            background: "#10b981",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: downloading ? "not-allowed" : "pointer",
            fontWeight: "600",
            opacity: downloading ? 0.6 : 1,
          }}
        >
          📥 Download JSON
        </button>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "#6b7280",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

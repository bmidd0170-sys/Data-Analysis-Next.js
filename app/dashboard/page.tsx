"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { DataAnalysisResult } from "@/lib/dataAnalyzer";
import { AIInsight } from "@/lib/aiAnalyzer";
import Chart from "chart.js/auto";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<DataAnalysisResult | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  
  const qualityChartRef = useRef<HTMLCanvasElement>(null);
  const dataTypesChartRef = useRef<HTMLCanvasElement>(null);
  const nullValuesChartRef = useRef<HTMLCanvasElement>(null);

  const qualityChartInstance = useRef<Chart | null>(null);
  const dataTypesChartInstance = useRef<Chart | null>(null);
  const nullValuesChartInstance = useRef<Chart | null>(null);

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
    if (typeof window === "undefined") return;

    // Try to get data from sessionStorage first
    const sessionAnalysis = sessionStorage.getItem("analysisData");
    const sessionInsights = sessionStorage.getItem("insightsData");

    if (sessionAnalysis) {
      try {
        const parsed = JSON.parse(sessionAnalysis);
        setAnalysis(parsed);
        if (parsed.columns && parsed.columns.length > 0) {
          setSelectedColumn(parsed.columns[0].name);
        }
      } catch (err) {
        console.error("Failed to parse analysis data from session:", err);
      }
    }

    if (sessionInsights) {
      try {
        const parsed = JSON.parse(sessionInsights);
        setInsights(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error("Failed to parse insights data from session:", err);
        setInsights([]);
      }
    }

    // Fallback: try URL params if sessionStorage is empty
    const analysisData = searchParams.get("analysis");
    const insightsData = searchParams.get("insights");
    
    if (!sessionAnalysis && analysisData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(analysisData));
        setAnalysis(parsed);
        if (parsed.columns && parsed.columns.length > 0) {
          setSelectedColumn(parsed.columns[0].name);
        }
      } catch (err) {
        console.error("Failed to parse analysis data from URL:", err);
      }
    }

    if (!sessionInsights && insightsData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(insightsData));
        setInsights(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error("Failed to parse insights data from URL:", err);
        setInsights([]);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!analysis) return;

    // Quality Metrics Radar Chart
    if (qualityChartRef.current) {
      if (qualityChartInstance.current) {
        qualityChartInstance.current.destroy();
      }

      const ctx = qualityChartRef.current.getContext("2d");
      if (ctx) {
        qualityChartInstance.current = new Chart(ctx, {
          type: "radar",
          data: {
            labels: ["Completeness", "Consistency", "Accuracy", "Validity"],
            datasets: [
              {
                label: "Quality Score",
                data: [
                  analysis.completeness,
                  analysis.consistency,
                  analysis.accuracy,
                  analysis.validity,
                ],
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 2,
                pointBackgroundColor: "#10b981",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
              },
            },
          },
        });
      }
    }

    // Data Types Pie Chart
    if (dataTypesChartRef.current) {
      if (dataTypesChartInstance.current) {
        dataTypesChartInstance.current.destroy();
      }

      const typeCounts = analysis.columns.reduce(
        (acc, col) => {
          acc[col.type] = (acc[col.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const ctx = dataTypesChartRef.current.getContext("2d");
      if (ctx) {
        dataTypesChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(typeCounts),
            datasets: [
              {
                data: Object.values(typeCounts),
                backgroundColor: [
                  "#10b981",
                  "#3b82f6",
                  "#f59e0b",
                  "#8b5cf6",
                  "#ef4444",
                ],
                borderColor: "#ffffff",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
          },
        });
      }
    }

    // Null Values Bar Chart
    if (nullValuesChartRef.current) {
      if (nullValuesChartInstance.current) {
        nullValuesChartInstance.current.destroy();
      }

      const top10Columns = analysis.columns
        .sort((a, b) => b.nullCount - a.nullCount)
        .slice(0, 10);

      const ctx = nullValuesChartRef.current.getContext("2d");
      if (ctx) {
        nullValuesChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: top10Columns.map((c) => c.name),
            datasets: [
              {
                label: "Null Values",
                data: top10Columns.map((c) => c.nullCount),
                backgroundColor: "#ef4444",
                borderColor: "#dc2626",
                borderWidth: 1,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              x: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    return () => {
      qualityChartInstance.current?.destroy();
      dataTypesChartInstance.current?.destroy();
      nullValuesChartInstance.current?.destroy();
    };
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="page-container">
        <h1 style={{ marginBottom: "24px", color: "#1e1e1e" }}>Dashboard</h1>
        <div
          style={{
            background: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0", color: "#92400e", fontSize: "16px", fontWeight: "600" }}>
            📊 Upload a file from the home page to see your dashboard
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "#f59e0b",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const selectedColumnStats = analysis.columns.find((c) => c.name === selectedColumn);

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: "8px", color: "#1e1e1e" }}>Data Quality Analysis</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        File: {analysis.fileName} ({analysis.totalRows} rows × {analysis.totalColumns} columns)
      </p>

      {/* Top Section: Score + Metrics + Recommendations */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Left: Score and Metrics */}
        <div>
          {/* Score Box */}
          <div
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              padding: "24px",
              borderRadius: "8px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0", fontSize: "14px", opacity: 0.9 }}>Quality Score</p>
            <p style={{ margin: "8px 0", fontSize: "48px", fontWeight: "700" }}>
              {analysis.overallScore}
            </p>
            <p style={{ margin: "0", fontSize: "12px", opacity: 0.9 }}>
              {analysis.overallScore >= 80
                ? "Excellent"
                : analysis.overallScore >= 70
                  ? "Good"
                  : analysis.overallScore >= 50
                    ? "Fair"
                    : "Poor"}
            </p>
          </div>

          {/* Metrics */}
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <p style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#1e1e1e" }}>
              Metrics:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>Completeness:</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e1e1e" }}>
                  {analysis.completeness}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>Consistency:</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e1e1e" }}>
                  {analysis.consistency}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>Accuracy:</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e1e1e" }}>
                  {analysis.accuracy}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>Validity:</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e1e1e" }}>
                  {analysis.validity}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recommendations */}
        <div
          style={{
            background: "#fef3c7",
            border: "2px solid #1e1e1e",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h3 style={{ marginTop: "0", marginBottom: "16px", color: "#1e1e1e" }}>
            Recommendations:
          </h3>
          {insights.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[...insights].slice(0, 5).sort((a, b) => {
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
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
          ) : (
            <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
              No recommendations available
            </p>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "16px", color: "#1e1e1e" }}>
          📊 Data Quality Visualizations
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Quality Metrics Chart */}
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "12px", color: "#6b7280" }}>
              Quality Metrics
            </p>
            <canvas ref={qualityChartRef} />
          </div>

          {/* Data Types Chart */}
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "12px", color: "#6b7280" }}>
              Data Type Breakdown
            </p>
            <canvas ref={dataTypesChartRef} />
          </div>
        </div>
      </div>

      {/* Null Values Chart */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "16px", color: "#1e1e1e" }}>
          Columns with Most Missing Values
        </h3>
        <canvas ref={nullValuesChartRef} style={{ maxHeight: "250px" }} />
      </div>

      {/* Column Analysis Table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
          overflowX: "auto",
        }}
      >
        <h3 style={{ marginTop: "0", marginBottom: "16px", color: "#1e1e1e" }}>
          Column Analysis
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #d1d5db", background: "#f9fafb" }}>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Column</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Type</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Missing</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Unique</th>
              <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Issues</th>
            </tr>
          </thead>
          <tbody>
            {analysis.columns.map((col, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                }}
              >
                <td style={{ padding: "12px", color: "#1e1e1e", fontWeight: "500" }}>
                  {col.name}
                </td>
                <td style={{ padding: "12px", color: "#6b7280" }}>{col.type}</td>
                <td style={{ padding: "12px", color: "#6b7280" }}>
                  {col.nullCount} ({col.nullPercentage}%)
                </td>
                <td style={{ padding: "12px", color: "#6b7280" }}>
                  {col.uniqueCount} ({col.uniquePercentage}%)
                </td>
                <td style={{ padding: "12px" }}>
                  {col.issues.length > 0 ? (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#fee2e2",
                        color: "#991b1b",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      {col.issues.length} issue{col.issues.length !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span style={{ color: "#059669" }}>✓</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Insights Details */}
      {insights.length > 0 && (
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
            ✨ AI-Powered Insights Details
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
      )}

      {/* Download and Navigation Buttons */}
      <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
          📥 Download CSV Report
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
          📥 Download JSON Report
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

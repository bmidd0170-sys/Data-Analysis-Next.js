import { Suspense } from "react";
import DashboardContent from "./DashboardContent";

function DashboardLoading() {
  return (
    <div className="page-container">
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <h2 style={{ marginBottom: "20px" }}>Loading Dashboard...</h2>
        <p style={{ color: "#6b7280" }}>Preparing your analysis dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

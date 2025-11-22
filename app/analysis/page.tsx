import { Suspense } from "react";
import AnalysisContent from "./AnalysisContent";

function AnalysisLoading() {
  return (
    <div className="page-container">
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <h2 style={{ marginBottom: "20px" }}>Loading...</h2>
        <p style={{ color: "#6b7280" }}>Preparing analysis page...</p>
      </div>
    </div>
  );
}

export default function Analysis() {
  return (
    <Suspense fallback={<AnalysisLoading />}>
      <AnalysisContent />
    </Suspense>
  );
}

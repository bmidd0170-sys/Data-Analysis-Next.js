import { NextRequest, NextResponse } from "next/server";
import { DataAnalysisResult } from "@/lib/dataAnalyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis, insights, format } = body as {
      analysis: DataAnalysisResult;
      insights: any[];
      format: "csv" | "json";
    };

    if (!analysis) {
      return NextResponse.json(
        { error: "Missing analysis data" },
        { status: 400 }
      );
    }

    if (format === "csv") {
      return generateCSVReport(analysis, insights);
    } else {
      return generateJSONReport(analysis, insights);
    }
  } catch (error) {
    console.error("Error in /api/report:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function generateCSVReport(analysis: DataAnalysisResult, insights: any[]) {
  let csv = "Data Quality Analysis Report\n";
  csv += `File: ${analysis.fileName}\n`;
  csv += `Date: ${new Date().toISOString()}\n`;
  csv += `\n`;

  // Overall metrics
  csv += "OVERALL METRICS\n";
  csv += `Total Rows,${analysis.totalRows}\n`;
  csv += `Total Columns,${analysis.totalColumns}\n`;
  csv += `Overall Quality Score,${analysis.overallScore}/100\n`;
  csv += `Completeness,${analysis.completeness}%\n`;
  csv += `Consistency,${analysis.consistency}%\n`;
  csv += `Accuracy,${analysis.accuracy}%\n`;
  csv += `Validity,${analysis.validity}%\n`;
  csv += `\n`;

  // Column details
  csv += "COLUMN DETAILS\n";
  csv += "Column Name,Data Type,Null Count,Null %,Unique Count,Unique %,Issues\n";
  analysis.columns.forEach((col) => {
    const issuesText = col.issues.join("; ");
    csv += `"${col.name}","${col.type}",${col.nullCount},${col.nullPercentage}%,${col.uniqueCount},${col.uniquePercentage}%,"${issuesText}"\n`;
  });
  csv += `\n`;

  // AI Insights
  if (insights.length > 0) {
    csv += "AI INSIGHTS & RECOMMENDATIONS\n";
    csv += "Priority,Issue,Suggestion,SQL Fix\n";
    insights.forEach((insight) => {
      const sqlFix = insight.sqlFix ? insight.sqlFix.replace(/\n/g, " ") : "";
      csv += `"${insight.priority}","${insight.issue}","${insight.suggestion}","${sqlFix}"\n`;
    });
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const filename = `data-quality-report-${Date.now()}.csv`;

  return new NextResponse(blob, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv;charset=utf-8;",
    },
  });
}

function generateJSONReport(analysis: DataAnalysisResult, insights: any[]) {
  const report = {
    metadata: {
      fileName: analysis.fileName,
      generatedAt: new Date().toISOString(),
      totalRows: analysis.totalRows,
      totalColumns: analysis.totalColumns,
    },
    metrics: {
      overall: analysis.overallScore,
      completeness: analysis.completeness,
      consistency: analysis.consistency,
      accuracy: analysis.accuracy,
      validity: analysis.validity,
    },
    columns: analysis.columns,
    insights: insights,
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const filename = `data-quality-report-${Date.now()}.json`;

  return new NextResponse(blob, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/json;charset=utf-8;",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { DataAnalysisResult } from "@/lib/dataAnalyzer";
import { AIAnalyzer } from "@/lib/aiAnalyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis } = body as { analysis: DataAnalysisResult };

    if (!analysis) {
      return NextResponse.json(
        { error: "Missing analysis data" },
        { status: 400 }
      );
    }

    const insights = await AIAnalyzer.generateInsights(analysis);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

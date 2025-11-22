/**
 * AI Analysis Module
 * 
 * This module provides AI-powered data quality insights using OpenAI's GPT models.
 * It analyzes data quality metrics and generates actionable recommendations.
 * 
 * @module aiAnalyzer
 */

import OpenAI from "openai";
import { DataAnalysisResult, ColumnStats } from "./dataAnalyzer";

/**
 * AI-generated insight with priority level and recommendations
 * @interface AIInsight
 */
export interface AIInsight {
  /** Priority level of the issue */
  priority: "High" | "Medium" | "Low";
  /** Description of the identified issue */
  issue: string;
  /** Recommended action to fix the issue */
  suggestion: string;
  /** Optional SQL query to clean the data */
  sqlFix?: string;
  /** User ID if issue is row-specific */
  userId?: string | number;
  /** Column names with issues for this user */
  affectedColumns?: string[];
}

/**
 * OpenAI client configuration
 * Uses server-side API key for secure communication
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AIAnalyzer class provides static methods for generating AI-powered insights
 * @class AIAnalyzer
 */
export class AIAnalyzer {
  /**
   * Generates AI-powered insights for data quality improvement
   * 
   * Uses OpenAI's GPT models to analyze data quality metrics and provide
   * intelligent, actionable recommendations for data cleaning and improvement.
   * Includes user-specific insights when an ID column is present.
   * 
   * @static
   * @param {DataAnalysisResult} analysis - The data analysis results
   * @returns {Promise<AIInsight[]>} Array of AI-generated insights with user IDs
   * @throws {Error} If OpenAI API call fails (falls back to default insights)
   * 
   * @example
   * const insights = await AIAnalyzer.generateInsights(analysisResult);
   * insights.forEach(insight => {
   *   console.log(`ID ${insight.userId}: ${insight.issue}`);
   *   console.log(`Suggestion: ${insight.suggestion}`);
   * });
   */
  static async generateInsights(analysis: DataAnalysisResult): Promise<AIInsight[]> {
    const columnSummary = analysis.columns
      .map((col) => {
        const issuesText = col.issues.length > 0 ? col.issues.join(", ") : "No issues";
        return `- Column: ${col.name} (${col.type}): ${issuesText}`;
      })
      .join("\n");

    // Get user-specific issues from data preview
    const userIssues = this.extractUserSpecificIssues(analysis);

    const prompt = `You are a data quality expert. Analyze this dataset quality assessment and provide 3-5 actionable recommendations.

Dataset: ${analysis.fileName}
Rows: ${analysis.totalRows}
Columns: ${analysis.totalColumns}
Overall Quality Score: ${analysis.overallScore}/100

Quality Metrics:
- Completeness: ${analysis.completeness}%
- Consistency: ${analysis.consistency}%
- Accuracy: ${analysis.accuracy}%
- Validity: ${analysis.validity}%

Column Details:
${columnSummary}

User-Specific Issues Found:
${userIssues}

Please provide recommendations in JSON format as an array of objects with: priority (High/Medium/Low), issue (string describing what needs to be fixed), suggestion (string), and optionally sqlFix (string for SQL cleanup commands).

Return ONLY valid JSON array, no other text.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responseText = response.choices[0]?.message?.content || "";

      // Parse JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const insights = JSON.parse(jsonMatch[0]) as AIInsight[];
        // Combine with user-specific insights
        return [...userIssues.map(ui => ui.insight), ...insights];
      }

      return [...userIssues.map(ui => ui.insight), ...this.defaultInsights(analysis)];
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return [...userIssues.map(ui => ui.insight), ...this.defaultInsights(analysis)];
    }
  }

  /**
   * Extracts row-specific issues and associates them with user IDs
   * @private
   * @static
   * @param {DataAnalysisResult} analysis - The data analysis results
   * @returns {Array} Array of user-specific issues with IDs
   */
  private static extractUserSpecificIssues(
    analysis: DataAnalysisResult
  ): Array<{ userId: string | number; insight: AIInsight }> {
    const userIssues: Array<{ userId: string | number; insight: AIInsight }> = [];
    
    // Find ID column
    const idColumn = analysis.columns.find(
      (col) => col.name.toLowerCase() === "id" || col.name.toLowerCase().endsWith("_id")
    );

    if (!idColumn || !analysis.dataPreview.length) {
      return userIssues;
    }

    // Check each row in preview for missing or invalid data
    analysis.dataPreview.forEach((row) => {
      const userId = row[idColumn.name];
      const affectedColumns: string[] = [];
      const issues: string[] = [];

      // Check all columns for missing or invalid values
      Object.keys(row).forEach((colName) => {
        if (colName === idColumn.name) return; // Skip ID column
        
        const value = row[colName];
        const colStats = analysis.columns.find((c) => c.name === colName);
        
        // Check for missing values
        if (value === null || value === undefined || value === "" || value === "-") {
          affectedColumns.push(colName);
          issues.push(`Missing ${colName}`);
        }
      });

      // Create insight for this user if issues found
      if (issues.length > 0) {
        userIssues.push({
          userId,
          insight: {
            priority: issues.length > 1 ? "High" : "Medium",
            issue: `ID ${userId}: ${issues.join(", ")}`,
            suggestion: `Add/update the missing fields (${affectedColumns.join(", ")}) for user ID ${userId}`,
            affectedColumns,
            userId,
          },
        });
      }
    });

    return userIssues;
  }

  /**
   * Generates default insights when AI API call fails
   * Provides fallback recommendations based on analysis metrics
   * 
   * @private
   * @static
   * @param {DataAnalysisResult} analysis - The data analysis results
   * @returns {AIInsight[]} Array of default insights
   */
  private static defaultInsights(analysis: DataAnalysisResult): AIInsight[] {
    const insights: AIInsight[] = [];

    // Generate insights based on metrics
    if (analysis.completeness < 95) {
      insights.push({
        priority: "High",
        issue: `Data completeness is ${analysis.completeness}% with missing values detected`,
        suggestion:
          "Remove rows with missing values or impute using mean/median/mode depending on the column type",
        sqlFix: `-- Remove rows with NULL values
DELETE FROM table_name WHERE column_name IS NULL;

-- Or impute with a default value
UPDATE table_name SET column_name = 'Unknown' WHERE column_name IS NULL;`,
      });
    }

    if (analysis.consistency < 85) {
      insights.push({
        priority: "Medium",
        issue: "Data consistency issues detected - format variations found",
        suggestion:
          "Standardize data formats across columns. Use TRIM, LOWER/UPPER functions",
        sqlFix: `-- Standardize text formatting
UPDATE table_name SET column_name = LOWER(TRIM(column_name));`,
      });
    }

    if (analysis.accuracy < 80) {
      insights.push({
        priority: "High",
        issue: "Accuracy score is low - potential outliers or data entry errors detected",
        suggestion: "Review and correct data type mismatches and outliers",
        sqlFix: `-- Find potential outliers in numeric columns
SELECT column_name, COUNT(*) FROM table_name 
WHERE column_name > (SELECT AVG(column_name) + 2*STDDEV(column_name))
GROUP BY column_name;`,
      });
    }

    if (analysis.validity < 90) {
      insights.push({
        priority: "Medium",
        issue: "Some data values do not match expected types or formats",
        suggestion:
          "Validate data against expected schemas and data types",
        sqlFix: `-- Check for invalid data types
SELECT * FROM table_name WHERE column_name NOT LIKE '%valid_pattern%';`,
      });
    }

    return insights;
  }
}

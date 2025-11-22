/**
 * Data Analysis Module
 * 
 * This module provides comprehensive data analysis functionality for CSV and JSON files.
 * It can analyze data quality, detect issues, and generate quality metrics.
 * 
 * @module dataAnalyzer
 */

import Papa from "papaparse";

/**
 * Statistics for a single column in the dataset
 * @interface ColumnStats
 */
/**
 * Statistics for a single column in the dataset
 * @interface ColumnStats
 */
export interface ColumnStats {
  /** Column name */
  name: string;
  /** Inferred data type of the column */
  type: "text" | "integer" | "float" | "boolean" | "date";
  /** Total number of rows in the column */
  totalRows: number;
  /** Count of null/missing values */
  nullCount: number;
  /** Percentage of null values */
  nullPercentage: number;
  /** Count of unique values */
  uniqueCount: number;
  /** Percentage of unique values */
  uniquePercentage: number;
  /** Sample unique values from the column */
  sampleValues: (string | number | null)[];
  /** Detected data quality issues */
  issues: string[];
}

/**
 * Complete analysis result for a dataset
 * @interface DataAnalysisResult
 */
export interface DataAnalysisResult {
  /** Name of the analyzed file */
  fileName: string;
  /** Total number of rows */
  totalRows: number;
  /** Total number of columns */
  totalColumns: number;
  /** Array of column statistics */
  columns: ColumnStats[];
  /** Sample data (first 5 rows) for preview */
  dataPreview: Record<string, any>[];
  /** Completeness score (0-100) */
  completeness: number;
  /** Consistency score (0-100) */
  consistency: number;
  /** Accuracy score (0-100) */
  accuracy: number;
  /** Validity score (0-100) */
  validity: number;
  /** Overall quality score (0-100) - average of all metrics */
  overallScore: number;
  /** Summary description of the dataset */
  summary: string;
}

/**
 * DataAnalyzer class provides static methods for analyzing CSV, JSON, and Excel files
 * @class DataAnalyzer
 */
export class DataAnalyzer {
  /**
   * Analyzes a CSV file and returns quality metrics
   * @static
   * @param {string} csvContent - The raw CSV content as a string
   * @param {string} fileName - The name of the CSV file
   * @returns {Promise<DataAnalysisResult>} Analysis results with quality metrics
   * @throws {Error} If CSV parsing fails
   * @example
   * const result = await DataAnalyzer.analyzeCSV(csvContent, 'data.csv');
   */
  static analyzeCSV(csvContent: string, fileName: string): DataAnalysisResult {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as Record<string, any>[];
          const analysis = this.analyzeData(data, fileName);
          resolve(analysis);
        },
        error: (error: any) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    }) as any;
  }

  /**
   * Analyzes a JSON file and returns quality metrics
   * @static
   * @param {string} jsonContent - The raw JSON content as a string
   * @param {string} fileName - The name of the JSON file
   * @returns {DataAnalysisResult} Analysis results with quality metrics
   * @throws {Error} If JSON parsing fails
   * @example
   * const result = DataAnalyzer.analyzeJSON(jsonContent, 'data.json');
   */
  static analyzeJSON(jsonContent: string, fileName: string): DataAnalysisResult {
    try {
      const data = JSON.parse(jsonContent);
      const dataArray = Array.isArray(data) ? data : [data];
      return this.analyzeData(dataArray, fileName);
    } catch (error) {
      throw new Error(`JSON parsing error: ${(error as Error).message}`);
    }
  }

  /**
   * Analyzes an Excel file and returns quality metrics
   * @static
   * @param {File} file - The Excel file object
   * @param {string} fileName - The name of the file
   * @returns {Promise<DataAnalysisResult>} Analysis results with quality metrics
   * @throws {Error} Excel support is not yet implemented
   */
  static async analyzeExcel(
    file: File,
    fileName: string
  ): Promise<DataAnalysisResult> {
    // Placeholder for Excel analysis using a library like xlsx
    throw new Error("Excel support coming soon");
  }

  /**
   * Internal method that analyzes raw data array
   * @private
   * @static
   * @param {Record<string, any>[]} data - Array of data objects
   * @param {string} fileName - File name for the analysis
   * @returns {DataAnalysisResult} Complete analysis results
   */
  private static analyzeData(
    data: Record<string, any>[],
    fileName: string
  ): DataAnalysisResult {
    if (!data || data.length === 0) {
      throw new Error("No data found in file");
    }

    const columns = Object.keys(data[0]);
    const totalRows = data.length;
    const totalColumns = columns.length;

    const columnStats: ColumnStats[] = columns.map((colName) => {
      const values = data.map((row) => row[colName]);
      return this.analyzeColumn(colName, values);
    });

    // Calculate quality metrics
    const completeness = this.calculateCompleteness(columnStats);
    const consistency = this.calculateConsistency(columnStats);
    const accuracy = this.calculateAccuracy(columnStats);
    const validity = this.calculateValidity(columnStats);

    const overallScore = Math.round(
      (completeness + consistency + accuracy + validity) / 4
    );

    // Get preview data (first 5 rows)
    const dataPreview = data.slice(0, 5);

    return {
      fileName,
      totalRows,
      totalColumns,
      columns: columnStats,
      dataPreview,
      completeness,
      consistency,
      accuracy,
      validity,
      overallScore,
      summary: this.generateSummary(totalRows, totalColumns, columnStats),
    };
  }

  /**
   * Analyzes statistics for a single column
   * @private
   * @static
   * @param {string} columnName - Name of the column
   * @param {any[]} values - All values in the column
   * @returns {ColumnStats} Statistics for the column
   */
  private static analyzeColumn(
    columnName: string,
    values: any[]
  ): ColumnStats {
    const nullCount = values.filter((v) => v === null || v === undefined || v === "").length;
    const nullPercentage = Math.round((nullCount / values.length) * 100);
    const uniqueValues = new Set(values.filter((v) => v != null && v !== ""));
    const uniqueCount = uniqueValues.size;
    const uniquePercentage = Math.round((uniqueCount / values.length) * 100);

    const dataType = this.inferDataType(values);
    const issues = this.detectIssues(columnName, values, dataType);
    const sampleValues = Array.from(uniqueValues).slice(0, 5);

    return {
      name: columnName,
      type: dataType,
      totalRows: values.length,
      nullCount,
      nullPercentage,
      uniqueCount,
      uniquePercentage,
      sampleValues: sampleValues as (string | number | null)[],
      issues,
    };
  }

  /**
   * Infers the data type of a column based on its values
   * @private
   * @static
   * @param {any[]} values - All values in the column
   * @returns {"text" | "integer" | "float" | "boolean" | "date"} Inferred data type
   */
  private static inferDataType(
    values: any[]
  ): "text" | "integer" | "float" | "boolean" | "date" {
    const nonNullValues = values.filter((v) => v != null && v !== "");

    if (nonNullValues.length === 0) return "text";

    // Check for boolean
    if (
      nonNullValues.every((v) =>
        ["true", "false", "yes", "no", "1", "0"].includes(String(v).toLowerCase())
      )
    ) {
      return "boolean";
    }

    // Check for date
    if (
      nonNullValues.every((v) => !isNaN(Date.parse(String(v))))
    ) {
      return "date";
    }

    // Check for integer
    if (nonNullValues.every((v) => Number.isInteger(Number(v)))) {
      return "integer";
    }

    // Check for float
    if (nonNullValues.every((v) => !isNaN(parseFloat(String(v))))) {
      return "float";
    }

    return "text";
  }

  /**
   * Detects data quality issues in a column
   * @private
   * @static
   * @param {string} columnName - Name of the column
   * @param {any[]} values - All values in the column
   * @param {string} dataType - The inferred data type
   * @returns {string[]} Array of issue descriptions
   */
  private static detectIssues(
    columnName: string,
    values: any[],
    dataType: string
  ): string[] {
    const issues: string[] = [];
    const nullCount = values.filter((v) => v === null || v === undefined || v === "").length;

    // Detect missing values
    if (nullCount > 0) {
      issues.push(`${nullCount} missing values (${Math.round((nullCount / values.length) * 100)}%)`);
    }

    // Detect type mismatches
    if (dataType === "integer" || dataType === "float") {
      const typeMismatches = values.filter(
        (v) => v != null && v !== "" && isNaN(parseFloat(String(v)))
      ).length;
      if (typeMismatches > 0) {
        issues.push(`${typeMismatches} non-numeric values found`);
      }
    }

    // Detect duplicates
    const uniqueCount = new Set(values.filter((v) => v != null && v !== "")).size;
    const duplicateCount = values.length - nullCount - uniqueCount;
    if (duplicateCount > 0) {
      issues.push(`${duplicateCount} duplicate values`);
    }

    return issues;
  }

  /**
   * Calculates the completeness metric based on null values
   * @private
   * @static
   * @param {ColumnStats[]} stats - Column statistics
   * @returns {number} Completeness score (0-100)
   */
  private static calculateCompleteness(stats: ColumnStats[]): number {
    const totalNullPercentage =
      stats.reduce((sum, col) => sum + col.nullPercentage, 0) / stats.length;
    return Math.max(0, Math.round(100 - totalNullPercentage));
  }

  /**
   * Calculates the consistency metric based on data format uniformity
   * @private
   * @static
   * @param {ColumnStats[]} stats - Column statistics
   * @returns {number} Consistency score (0-100)
   */
  private static calculateConsistency(stats: ColumnStats[]): number {
    // Based on format consistency and uniformity
    let score = 100;
    stats.forEach((col) => {
      if (col.type === "text") {
        // Text columns may have format variations
        score -= 5;
      }
    });
    return Math.max(0, score - stats.filter((c) => c.issues.length > 0).length * 5);
  }

  /**
   * Calculates the accuracy metric based on outliers and type mismatches
   * @private
   * @static
   * @param {ColumnStats[]} stats - Column statistics
   * @returns {number} Accuracy score (0-100)
   */
  private static calculateAccuracy(stats: ColumnStats[]): number {
    // Based on outliers and data quality issues
    let score = 100;
    stats.forEach((col) => {
      score -= col.issues.filter((i) => i.includes("non-numeric")).length * 10;
    });
    return Math.max(0, score);
  }

  /**
   * Calculates the validity metric based on data type matching
   * @private
   * @static
   * @param {ColumnStats[]} stats - Column statistics
   * @returns {number} Validity score (0-100)
   */
  private static calculateValidity(stats: ColumnStats[]): number {
    // Based on data type matching
    let score = 100;
    stats.forEach((col) => {
      if (col.type === "text" && col.uniquePercentage < 80) {
        score -= 10;
      }
    });
    return Math.max(0, score);
  }

  /**
   * Generates a summary description of the dataset
   * @private
   * @static
   * @param {number} rows - Number of rows
   * @param {number} columns - Number of columns
   * @param {ColumnStats[]} stats - Column statistics
   * @returns {string} Summary description
   */
  private static generateSummary(
    rows: number,
    columns: number,
    stats: ColumnStats[]
  ): string {
    const issueCount = stats.reduce((sum, col) => sum + col.issues.length, 0);
    return `Dataset with ${rows} rows and ${columns} columns. Found ${issueCount} data quality issues.`;
  }
}

export default function Docs() {
  return (
    <div className="page-container">
      <h1 className="page-title">Documentation</h1>
      
      <div className="page-content">
        <h2>Getting Started</h2>
        <p>
          Welcome to the Data Quality Analysis Platform documentation. This guide will help 
          you understand how to use the platform effectively.
        </p>

        <h2>Upload Your Data</h2>
        <p>
          On the Home page, you can upload your dataset using two methods:
        </p>
        <ul>
          <li>Drag and drop your file directly into the upload area</li>
          <li>Click the "Choose File" button to browse your computer</li>
        </ul>
        <p>
          Supported formats include CSV, JSON, and Excel files. Maximum file size is 50MB.
        </p>

        <h2>Understanding Quality Metrics</h2>
        <p>
          The platform provides four key quality metrics for your data:
        </p>
        <ul>
          <li><strong>Completeness:</strong> Percentage of non-null values in your dataset</li>
          <li><strong>Consistency:</strong> How uniform and standardized your data formatting is</li>
          <li><strong>Accuracy:</strong> Detection of outliers and data validity issues</li>
          <li><strong>Validity:</strong> Whether data matches expected types and formats</li>
        </ul>

        <h2>Data Preview</h2>
        <p>
          After upload, you'll see:
        </p>
        <ul>
          <li>First 100 rows of your data</li>
          <li>Column statistics and data types</li>
          <li>Initial quality overview</li>
          <li>Detected issues and recommendations</li>
        </ul>

        <h2>Analysis Results</h2>
        <p>
          The analysis dashboard displays:
        </p>
        <ul>
          <li>Overall quality score (0-100)</li>
          <li>Quality metrics with progress bars</li>
          <li>Data visualizations (bar charts, pie charts)</li>
          <li>AI-powered insights and recommendations</li>
        </ul>

        <h2>Detailed Insights</h2>
        <p>
          For each column in your dataset, you can view:
        </p>
        <ul>
          <li>Data type and format information</li>
          <li>Missing value analysis</li>
          <li>Unique value counts</li>
          <li>Outlier detection</li>
          <li>Suggested fixes and SQL cleanup scripts</li>
        </ul>

        <h2>File Format Requirements</h2>
        
        <h3>CSV Files</h3>
        <ul>
          <li>First row should contain column headers</li>
          <li>Comma-separated values</li>
          <li>UTF-8 encoding recommended</li>
        </ul>

        <h3>JSON Files</h3>
        <ul>
          <li>Array of objects format</li>
          <li>Each object represents a row</li>
          <li>Object keys become column names</li>
        </ul>

        <h3>Excel Files</h3>
        <ul>
          <li>.xlsx format supported</li>
          <li>Analysis uses first sheet</li>
          <li>First row should contain headers</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Remove sensitive data before uploading</li>
          <li>Ensure consistent column headers (avoid special characters)</li>
          <li>Use appropriate data types for each column</li>
          <li>Keep datasets reasonably sized (under 50MB)</li>
          <li>Review AI recommendations carefully before implementing fixes</li>
        </ul>

        <h2>Downloading Reports</h2>
        <p>
          After analysis, you can download a comprehensive report that includes:
        </p>
        <ul>
          <li>Overall quality score and metrics</li>
          <li>Detailed column-by-column analysis</li>
          <li>Visual charts and graphs</li>
          <li>AI recommendations with SQL scripts</li>
          <li>Data samples and statistics</li>
        </ul>

        <h2>Need Help?</h2>
        <p>
          If you encounter any issues or have questions, please:
        </p>
        <ul>
          <li>Review the examples on the Home page</li>
          <li>Check the quick tips in the Recent Analyses section</li>
          <li>Visit our About page to learn more about the platform</li>
        </ul>
      </div>
    </div>
  );
}

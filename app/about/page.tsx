export default function About() {
  return (
    <div className="page-container">
      <h1 className="page-title">About</h1>
      
      <div className="page-content">
        <h2>Data Quality Analysis Platform</h2>
        <p>
          Welcome to the Agentic Data Quality Analysis Platform - an innovative solution 
          designed to help organizations maintain and improve their data quality through 
          AI-powered insights and analysis.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe that high-quality data is the foundation of better decision-making. 
          Our platform makes it easy for teams to identify data quality issues, understand 
          their impact, and take actionable steps to resolve them.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li><strong>Instant Analysis:</strong> Upload your data and get comprehensive quality analysis in seconds</li>
          <li><strong>AI-Powered Insights:</strong> Leveraging OpenAI API for intelligent recommendations</li>
          <li><strong>Multiple Format Support:</strong> Analyze CSV, JSON, and Excel files seamlessly</li>
          <li><strong>Quality Metrics:</strong> Get detailed scores for Completeness, Consistency, Accuracy, and Validity</li>
          <li><strong>Visual Dashboards:</strong> Interactive charts and visualizations for easy understanding</li>
          <li><strong>Detailed Reports:</strong> Column-level analysis with actionable fix suggestions</li>
        </ul>

        <h2>Technology Stack</h2>
        <p>
          Built with modern technologies including React, Next.js, Chart.js for visualization, 
          and OpenAI API for intelligent analysis. Our platform is designed to be fast, 
          scalable, and user-friendly.
        </p>

        <h2>How It Works</h2>
        <ol style={{ marginLeft: "24px" }}>
          <li>Upload your dataset (CSV, JSON, or Excel)</li>
          <li>Our engine analyzes the data structure and content</li>
          <li>View initial quality overview and preview</li>
          <li>Explore detailed analysis and AI-powered recommendations</li>
          <li>Download comprehensive report for your team</li>
        </ol>
      </div>
    </div>
  );
}

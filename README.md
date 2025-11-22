# Data Quality Analysis Platform

An AI-powered data quality analysis platform built with Next.js, TypeScript, and OpenAI. Instantly analyze datasets for completeness, consistency, accuracy, and validity with intelligent recommendations.

## Features

### 🚀 Core Capabilities

- **Drag-and-drop file upload** - Upload CSV and JSON files (max 50MB)
- **Automated data analysis** - Comprehensive quality metrics and statistics
- **AI-powered insights** - OpenAI GPT-powered recommendations for data improvement
- **Interactive dashboard** - Visualize data quality with Chart.js graphs
- **Quality metrics** - Completeness, consistency, accuracy, and validity scores
- **Issue detection** - Automatically identifies missing values, duplicates, and type mismatches
- **Downloadable reports** - Export analysis results as CSV or JSON

### 📊 Data Analysis Features

- **Data type inference** - Automatically detects text, integer, float, boolean, and date types
- **Column statistics** - Null values, unique counts, and sample values per column
- **Data preview** - View first 5 rows of your dataset
- **Issue highlighting** - Identifies problematic columns with specific issues
- **SQL recommendations** - Get SQL queries to clean your data

### 🤖 AI Features

- **GPT-powered analysis** - Uses OpenAI's GPT models for intelligent insights
- **Priority-based recommendations** - High, Medium, and Low priority issues
- **Actionable suggestions** - Specific steps to improve data quality
- **SQL fix scripts** - Ready-to-use SQL commands for data cleaning

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, React
- **Charts**: Chart.js for interactive data visualizations
- **Styling**: Custom CSS with Tailwind CSS utilities
- **File Parsing**: Papa Parse for CSV, native JSON parsing
- **AI**: OpenAI API (GPT-4o-mini model)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Create `.env.local` file with your OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-your-api-key-here
NEXT_PUBLIC_MAX_FILE_SIZE_MB=50
NEXT_PUBLIC_SUPPORTED_FORMATS=csv,json
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### 1. Upload Your Dataset

- Go to the home page
- Drag and drop your CSV or JSON file, or click to browse
- File must be under 50MB

### 2. View Initial Analysis

After upload, you'll see:

- Overall quality score (0-100)
- Quality metrics (completeness, consistency, accuracy, validity)
- Data preview (first 5 rows)
- Detected issues and AI recommendations

### 3. Explore Dashboard

Click "View Full Dashboard" to see:

- Quality metrics radar chart
- Data type distribution pie chart
- Columns with most null values
- Individual column statistics
- Sample values for each column

### 4. Download Report

Export your analysis in CSV or JSON format including:

- Overall metrics and scores
- Column-by-column statistics
- Detected issues
- AI recommendations
- SQL fix scripts

## Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── analyze/          # AI insights generation
│   │   └── report/           # Report generation
│   ├── analysis/             # Analysis results page
│   ├── dashboard/            # Dashboard with charts
│   ├── about/                # About page
│   ├── docs/                 # Documentation page
│   ├── layout.tsx            # Root layout with navigation
│   ├── page.tsx              # Home page with upload
│   └── globals.css           # Global styles
├── lib/
│   ├── dataAnalyzer.ts       # Core analysis engine
│   └── aiAnalyzer.ts         # AI insights generation
├── public/                   # Static files
├── .env.local               # Environment variables
├── package.json             # Dependencies
└── tsconfig.json           # TypeScript config
```

## API Routes

### POST /api/analyze

Generates AI-powered insights for analysis results.

**Request:**

```json
{
	"analysis": {
		/* DataAnalysisResult */
	}
}
```

**Response:**

```json
{
	"insights": [
		/* AIInsight[] */
	]
}
```

### POST /api/report

Generates downloadable CSV or JSON reports.

**Request:**

```json
{
  "analysis": { /* DataAnalysisResult */ },
  "insights": [ /* AIInsight[] */ ],
  "format": "csv" | "json"
}
```

## Supported File Formats

### CSV

- First row must contain column headers
- Comma-separated values
- UTF-8 encoding recommended
- Example: [sample_employees.csv](public/sample_employees.csv)

### JSON

- Array of objects format
- Each object represents a row
- Object keys become column names
- Example: [sample_products.json](public/sample_products.json)

## Quality Metrics Explained

### Completeness (0-100)

Measures the percentage of non-null values in your dataset.

- 100% = No missing values
- Lower scores indicate missing data issues

### Consistency (0-100)

Evaluates whether data formats are uniform across columns.

- Checks for format standardization
- Penalizes text columns with high variation

### Accuracy (0-100)

Detects outliers and data type mismatches.

- Identifies non-numeric values in numeric columns
- Flags potential data entry errors

### Validity (0-100)

Verifies that data matches expected types and value ranges.

- Checks type consistency
- Identifies unusual data patterns

## Data Type Detection

The analyzer automatically infers column data types:

- **Text**: String values
- **Integer**: Whole numbers
- **Float**: Decimal numbers
- **Boolean**: True/False, Yes/No, 1/0 values
- **Date**: Date and timestamp values

## Environment Variables

| Variable                        | Description         | Example       |
| ------------------------------- | ------------------- | ------------- |
| `OPENAI_API_KEY`                | Your OpenAI API key | `sk-proj-...` |
| `NEXT_PUBLIC_MAX_FILE_SIZE_MB`  | Maximum upload size | `50`          |
| `NEXT_PUBLIC_SUPPORTED_FORMATS` | Allowed file types  | `csv,json`    |

## Performance Tips

- Keep datasets under 50MB for best performance
- Use CSV format for faster parsing
- Close browser tabs to free memory for large files
- Consider splitting very large datasets

## Troubleshooting

### "Missing credentials" Error

- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Restart the development server after setting the key

### File Upload Fails

- Check file size (max 50MB)
- Verify file format (CSV or JSON only)
- Ensure proper file encoding (UTF-8)

### Dashboard Not Loading

- Try refreshing the page
- Check browser console for errors
- Ensure you have sufficient memory

## Testing

Run the development server and manually test with sample files:

- [sample_employees.csv](public/sample_employees.csv)
- [sample_products.json](public/sample_products.json)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable: `OPENAI_API_KEY`
5. Deploy!

### Deploy to Other Platforms

Ensure these are configured:

- Node.js 18+ runtime
- Environment variable: `OPENAI_API_KEY`
- Build command: `npm run build` (or `pnpm build`)
- Start command: `npm run start` (or `pnpm start`)

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npm run type-check
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:

1. Check the [Documentation](/docs) page in the app
2. Review sample files in `/public`
3. Check browser console for error messages

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Data visualization with [Chart.js](https://www.chartjs.org)
- CSV parsing with [Papa Parse](https://www.papaparse.com)
- AI insights powered by [OpenAI](https://openai.com)
# Data-Analysis-Next.js

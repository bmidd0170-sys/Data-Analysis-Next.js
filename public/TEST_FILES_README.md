# Test Files Guide

This directory contains sample test files to help you test the Data Quality Analysis Platform. Each file is designed to demonstrate different data quality issues that the AI analysis can detect and provide recommendations for.

## Available Test Files

### 1. `sample_employees.csv`
**Location:** `public/sample_employees.csv`

**Description:** Employee dataset with 10 rows demonstrating common data quality issues.

**Data Quality Issues Included:**
- ✗ Missing values: Age (1), Email (1)
- ✗ Outliers: Ethan Hunt has Age=150 (likely data entry error)
- ✗ Inactive employee: Status varies between Active/Inactive
- ✓ Proper date formatting in Hire_Date
- ✓ Numeric fields with valid ranges

**Columns:**
- ID (Integer) - Employee ID
- Name (Text) - Full name
- Email (Text) - Email address (missing in row 4)
- Age (Integer) - Age in years (missing in row 3, outlier in row 7)
- City (Text) - City name
- Department (Text) - Department assignment
- Salary (Integer) - Annual salary
- Hire_Date (Date) - Hire date in YYYY-MM-DD format
- Performance_Score (Float) - 1-5 scale performance rating
- Status (Text) - Active/Inactive status

**Expected Analysis Results:**
- Quality Score: ~75-80
- Completeness: ~95% (2 missing values out of 20)
- Accuracy Issues: Outlier detected in Age column
- Consistency Issues: Status values need standardization

**How to Test:**
1. Download or copy `sample_employees.csv`
2. Upload to the platform
3. View AI recommendations for:
   - Handling missing Age/Email values
   - Correcting the Age=150 outlier
   - Standardizing the Status field

---

### 2. `sample_products.json`
**Location:** `public/sample_products.json`

**Description:** Product inventory dataset with 10 products demonstrating various data quality scenarios.

**Data Quality Issues Included:**
- ✗ Missing/null values: stock_quantity (1), supplier (1), reviews_count (1)
- ✗ Outliers: rating=999 (should be max 5)
- ✗ Zero inventory: USB-C Cable has stock_quantity=0
- ✗ Empty string: Webcam HD has empty supplier field
- ✓ Consistent numeric pricing
- ✓ ISO date formatting

**Fields:**
- product_id (Text) - Unique product identifier
- product_name (Text) - Product name
- category (Text) - Product category
- price (Float) - Unit price in USD
- stock_quantity (Integer) - Quantity in stock (with 1 null value)
- supplier (Text) - Supplier name (with 1 empty value)
- rating (Float) - Product rating 0-5 (with 1 outlier: 999)
- reviews_count (Integer) - Number of reviews (with 1 null value)
- last_restocked (Date) - Date last restocked in YYYY-MM-DD format
- status (Text) - In Stock / Out of Stock

**Expected Analysis Results:**
- Quality Score: ~70-75
- Completeness: ~97% (3 missing values out of 100)
- Consistency: ~80% (empty strings, missing values)
- Accuracy: ~65% (outlier rating of 999)
- Validity: ~90% (mostly valid data types)

**How to Test:**
1. Download or copy `sample_products.json`
2. Upload to the platform
3. View AI recommendations for:
   - Handling null stock_quantity values
   - Correcting the rating outlier (999 → should be ≤5)
   - Standardizing supplier field (removing empty strings)
   - Handling missing reviews_count

---

## How to Download Test Files

### Option 1: Direct Download
The files are in `/my-app/public/`:
```bash
# From the project root
cp my-app/public/sample_employees.csv ~/Downloads/
cp my-app/public/sample_products.json ~/Downloads/
```

### Option 2: Copy & Paste
1. Open the file in your code editor
2. Select all content (Ctrl+A or Cmd+A)
3. Copy to clipboard
4. Create a new file with appropriate extension
5. Paste and save

### Option 3: Create Yourself
You can create new test files by copying the content from this guide.

---

## Testing Workflow

### Test 1: CSV File Upload
1. Open the application at `http://localhost:3000`
2. Click "Choose File" or drag-and-drop `sample_employees.csv`
3. Wait for analysis to complete
4. Review the data quality metrics:
   - Check the progress bar
   - View data preview table
   - Read quality scores
   - Check AI insights for recommendations
5. Verify that:
   - All 10 rows are displayed
   - Quality metrics show appropriate percentages
   - AI identifies the Age outlier (150)
   - Recommendations include SQL scripts

### Test 2: JSON File Upload
1. Go back to Home (click "Home" in navigation)
2. Upload `sample_products.json`
3. Review the analysis:
   - Verify 10 products are analyzed
   - Check for missing values detection
   - Look for outlier detection (rating=999)
   - Review SQL recommendations

### Test 3: Error Handling
Try uploading:
- Invalid file format (e.g., `.txt`, `.xlsx`)
- Empty/corrupted CSV
- Malformed JSON
- Very large file (>50MB)

---

## Data Quality Issues Reference

### Common Issues Found in Test Files:

| Issue Type | Test File | Location | Expected Fix |
|------------|-----------|----------|--------------|
| Missing Values | CSV | Age (row 3), Email (row 4) | Imputation or deletion |
| Outliers | CSV | Age=150 (row 7) | Investigation or correction |
| Empty Strings | JSON | Supplier field (PROD006) | Standardization |
| Null Values | JSON | stock_quantity (PROD005), reviews_count (PROD010) | Imputation |
| Invalid Range | JSON | rating=999 (PROD009) | Correction to valid range |
| Zero Values | JSON | stock_quantity=0 (PROD003) | May be valid (out of stock) |

---

## API Configuration

To get full AI insights, configure your OpenAI API key:

1. Create `.env.local` in `my-app/`:
```
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
```

2. Get API key from: https://platform.openai.com/api-keys

3. Restart the development server

Without API key configuration, the platform will show default insights based on the data analysis.

---

## Expected Output Example

### CSV Analysis (sample_employees.csv):
```
Quality Score: 78/100

Completeness: 95%
Consistency: 85%
Accuracy: 72%
Validity: 90%

AI Insights:
1. [HIGH] Address Missing Values
   - 2 missing values found (Email: 1, Age: 1)
   - Suggestion: Impute with median/mode or remove rows

2. [HIGH] Fix Age Outlier
   - Age=150 detected (likely data entry error)
   - Suggestion: Correct to valid age range (18-100)

3. [MEDIUM] Standardize Status Field
   - Values: Active, Inactive
   - Suggestion: Ensure consistent capitalization
```

### JSON Analysis (sample_products.json):
```
Quality Score: 72/100

Completeness: 97%
Consistency: 80%
Accuracy: 65%
Validity: 90%

AI Insights:
1. [HIGH] Correct Rating Outlier
   - Rating=999 found (valid range: 0-5)
   - Suggestion: Fix to valid rating value

2. [HIGH] Handle Missing Stock Quantity
   - 1 null value in stock_quantity
   - Suggestion: Investigate or set default

3. [MEDIUM] Standardize Supplier Field
   - Empty string found in supplier field
   - Suggestion: Investigate supplier or mark as "Unknown"
```

---

## Tips for Testing

✓ **Do:**
- Test with both CSV and JSON formats
- Review all AI recommendations
- Check SQL fix scripts for accuracy
- Test error scenarios
- Verify UI responsiveness on different screen sizes

✗ **Don't:**
- Upload files > 50MB
- Use unsupported formats (.xlsx, .txt, etc.)
- Put sensitive data in test files
- Rely solely on automated fixes without review

---

## Creating Your Own Test Files

You can create custom test files to test specific scenarios:

### Example CSV Template:
```csv
Name,Email,Age,Status
John,john@email.com,30,Active
Jane,,28,Active
Bob,bob@email.com,,Inactive
```

### Example JSON Template:
```json
[
  {
    "id": 1,
    "name": "Test",
    "value": 100
  },
  {
    "id": 2,
    "name": "Test2",
    "value": null
  }
]
```

---

## Troubleshooting

### File won't upload:
- Check file extension (.csv or .json only)
- Verify file size < 50MB
- Check browser console for errors

### No AI insights showing:
- Verify `NEXT_PUBLIC_OPENAI_API_KEY` in `.env.local`
- Check OpenAI API quota/balance
- Default insights will show if API unavailable

### Data preview looks wrong:
- Verify CSV has headers in first row
- Check JSON is valid array of objects
- Ensure encoding is UTF-8

---

Happy testing! 🚀

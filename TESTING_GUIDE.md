# Quick Start: Testing the Data Quality Analysis Platform

## Step 1: Start the Development Server

```bash
cd my-app
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Step 2: Download Test Files

The test files are located in `my-app/public/`:

### Option A: Copy from File Explorer
1. Navigate to `my-app/public/` folder
2. Find and copy these files to your Downloads folder:
   - `sample_employees.csv`
   - `sample_products.json`

### Option B: Create Files Manually

**File 1: sample_employees.csv**
Save this content to a file named `sample_employees.csv`:
```
ID,Name,Email,Age,City,Department,Salary,Hire_Date,Performance_Score,Status
1,John Doe,john.doe@company.com,32,New York,Engineering,85000,2020-01-15,4.5,Active
2,Jane Smith,jane.smith@company.com,28,Los Angeles,Marketing,65000,2021-03-22,4.2,Active
3,Bob Johnson,bob.johnson@company.com,,Chicago,Sales,72000,2019-06-10,3.8,Active
4,Alice Williams,,45,Houston,Engineering,95000,2018-11-05,4.8,Active
5,Charlie Brown,charlie.b@company.com,38,Phoenix,HR,58000,2020-07-18,3.5,Active
6,Diana Prince,diana.prince@company.com,29,Philadelphia,Engineering,88000,2021-02-14,4.6,Active
7,Ethan Hunt,ethan.hunt@company.com,150,San Antonio,Sales,71000,2019-09-30,3.9,Inactive
8,Fiona Green,fiona.green@company.com,34,San Diego,Marketing,68000,2020-05-11,4.1,Active
9,George Harris,george.harris@company.com,,Dallas,Engineering,92000,2018-08-22,4.7,Active
10,Hannah Lee,hannah.lee@company.com,26,San Jose,HR,55000,2022-01-03,3.2,Active
```

**File 2: sample_products.json**
Save this content to a file named `sample_products.json`:
```json
[
  {
    "product_id": "PROD001",
    "product_name": "Laptop Pro 15",
    "category": "Electronics",
    "price": 1299.99,
    "stock_quantity": 45,
    "supplier": "TechCorp Industries",
    "rating": 4.8,
    "reviews_count": 234,
    "last_restocked": "2024-11-15",
    "status": "In Stock"
  },
  {
    "product_id": "PROD002",
    "product_name": "Wireless Mouse",
    "category": "Accessories",
    "price": 29.99,
    "stock_quantity": 156,
    "supplier": "PeripheralMaker",
    "rating": 4.2,
    "reviews_count": 89,
    "last_restocked": "2024-11-18",
    "status": "In Stock"
  },
  {
    "product_id": "PROD003",
    "product_name": "USB-C Cable",
    "category": "Accessories",
    "price": 15.99,
    "stock_quantity": 0,
    "supplier": "CableSolutions",
    "rating": 4.5,
    "reviews_count": 156,
    "last_restocked": "2024-10-22",
    "status": "Out of Stock"
  },
  {
    "product_id": "PROD004",
    "product_name": "Monitor 4K 32inch",
    "category": "Electronics",
    "price": 599.99,
    "stock_quantity": 12,
    "supplier": "DisplayTech",
    "rating": 4.7,
    "reviews_count": 198,
    "last_restocked": "2024-11-10",
    "status": "In Stock"
  },
  {
    "product_id": "PROD005",
    "product_name": "Mechanical Keyboard",
    "category": "Accessories",
    "price": 149.99,
    "stock_quantity": null,
    "supplier": "KeyMaster Electronics",
    "rating": 4.9,
    "reviews_count": 312,
    "last_restocked": "2024-11-12",
    "status": "In Stock"
  },
  {
    "product_id": "PROD006",
    "product_name": "Webcam HD",
    "category": "Accessories",
    "price": 79.99,
    "stock_quantity": 34,
    "supplier": "",
    "rating": 4.1,
    "reviews_count": 67,
    "last_restocked": "2024-11-08",
    "status": "In Stock"
  },
  {
    "product_id": "PROD007",
    "product_name": "Desk Lamp LED",
    "category": "Furniture",
    "price": 45.99,
    "stock_quantity": 78,
    "supplier": "LightWorks Co",
    "rating": 3.8,
    "reviews_count": 45,
    "last_restocked": "2024-11-14",
    "status": "In Stock"
  },
  {
    "product_id": "PROD008",
    "product_name": "Notebook Set",
    "category": "Stationery",
    "price": 12.99,
    "stock_quantity": 245,
    "supplier": "PaperGoods Ltd",
    "rating": 4.3,
    "reviews_count": 123,
    "last_restocked": "2024-11-16",
    "status": "In Stock"
  },
  {
    "product_id": "PROD009",
    "product_name": "Portable Charger",
    "category": "Electronics",
    "price": 49.99,
    "stock_quantity": 89,
    "supplier": "PowerCell Corp",
    "rating": 999,
    "reviews_count": 298,
    "last_restocked": "2024-11-13",
    "status": "In Stock"
  },
  {
    "product_id": "PROD010",
    "product_name": "Screen Protector",
    "category": "Accessories",
    "price": 9.99,
    "stock_quantity": 567,
    "supplier": "ProtectGlass Inc",
    "rating": 4.0,
    "reviews_count": null,
    "last_restocked": "2024-11-17",
    "status": "In Stock"
  }
]
```

## Step 3: Test the Application

### Test 1: CSV Upload
1. Open `http://localhost:3000` in your browser
2. Click "Choose File" or drag-and-drop `sample_employees.csv`
3. Wait for analysis to complete (should take 2-5 seconds)
4. Review:
   - Data preview table with 10 employees
   - Quality metrics (Completeness, Consistency, Accuracy, Validity)
   - AI-powered insights with recommendations

**What to look for:**
- ✓ Missing Age value (row 3)
- ✓ Missing Email value (row 4)
- ✓ Age outlier detection (Ethan Hunt: 150 years)
- ✓ Quality score around 75-80

### Test 2: JSON Upload
1. Click "Home" to go back
2. Upload `sample_products.json`
3. Review the analysis:
   - 10 products displayed in preview
   - Quality metrics calculated
   - AI recommendations for data fixes

**What to look for:**
- ✓ Rating outlier (999 instead of 0-5)
- ✓ Null/missing values in stock_quantity
- ✓ Empty supplier field detection
- ✓ Quality score around 70-75

### Test 3: Full AI Integration (Optional)
To see full AI insights with SQL fix scripts:

1. Get OpenAI API key from: https://platform.openai.com/api-keys
2. Create `my-app/.env.local`:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
   ```
3. Restart development server: `npm run dev`
4. Upload test files again to see enhanced AI recommendations

## Step 4: Test Navigation

Click these links to verify routing:
- **Home**: `/` - Main upload page
- **About**: `/about` - Platform information
- **Docs**: `/docs` - User documentation
- **Continue to Full Analysis**: Placeholder for Screen 3 (dashboard)

## What Gets Tested

| Feature | CSV File | JSON File | Notes |
|---------|----------|-----------|-------|
| File Upload | ✓ | ✓ | Drag-drop and button upload |
| File Parsing | ✓ | ✓ | CSV via PapaParse, JSON native |
| Data Preview | ✓ | ✓ | First 5 rows in table |
| Quality Metrics | ✓ | ✓ | Completeness, Consistency, Accuracy, Validity |
| Missing Values | ✓ | ✓ | Detected and reported |
| Outliers | ✓ | ✓ | Age=150, rating=999 |
| Empty Strings | ✗ | ✓ | Supplier field |
| Null Values | ✓ | ✓ | Both types detected |
| AI Insights | ✓ | ✓ | Requires API key for full features |

## Expected Results

### CSV (sample_employees.csv)
- **Overall Score**: ~78/100
- **Completeness**: ~95%
- **Consistency**: ~85%
- **Accuracy**: ~72% (due to outlier)
- **Validity**: ~90%
- **Issues Found**: 
  - 2 missing values
  - 1 outlier
  - Format inconsistencies

### JSON (sample_products.json)
- **Overall Score**: ~72/100
- **Completeness**: ~97%
- **Consistency**: ~80%
- **Accuracy**: ~65% (due to rating=999)
- **Validity**: ~90%
- **Issues Found**:
  - 3 missing/null values
  - 1 invalid range (rating)
  - 1 empty string

## Troubleshooting

### Problem: File upload fails
**Solution:**
- Ensure file is `.csv` or `.json` only
- Check file size is under 50MB
- Verify CSV headers are on first row
- Validate JSON is proper array format

### Problem: No AI insights appear
**Solution:**
- OpenAI API key is optional
- Platform shows default insights without API key
- To enable full AI: set `NEXT_PUBLIC_OPENAI_API_KEY` in `.env.local`

### Problem: Data looks wrong in preview
**Solution:**
- For CSV: ensure first row contains column headers
- For JSON: verify it's an array of objects
- Check file encoding is UTF-8

## Next Steps

After successful testing:
1. Create custom test files with your own data
2. Verify all AI recommendations are accurate
3. Test error scenarios (invalid formats, corrupted files)
4. Prepare for Screen 3 (Dashboard/Results page)

Happy testing! 🚀

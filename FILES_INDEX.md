# Data Quality Analysis Platform - Test Files Index

## 📂 File Structure

```
data-analysis-tutorial/
├── my-app/
│   ├── public/
│   │   ├── sample_employees.csv          ✓ CSV test file (10 rows)
│   │   ├── sample_products.json          ✓ JSON test file (10 items)
│   │   ├── TEST_FILES_README.md          📖 Detailed documentation
│   │   ├── TEST_FILES_QUICK_START.txt    📖 Quick reference
│   │   └── [other static files...]
│   ├── app/
│   │   ├── page.tsx                      Home page with upload
│   │   ├── analysis/
│   │   │   └── page.tsx                  Screen 2 - Analysis results
│   │   ├── about/
│   │   │   └── page.tsx                  About page
│   │   ├── docs/
│   │   │   └── page.tsx                  Documentation page
│   │   └── globals.css                   Styling
│   ├── lib/
│   │   ├── dataAnalyzer.ts               CSV/JSON parsing & analysis
│   │   └── aiAnalyzer.ts                 OpenAI integration
│   ├── TESTING_GUIDE.md                  📖 Testing instructions
│   └── .env.example                      Environment template
│
└── TEST_FILES_PACKAGE.md                 📖 This package overview
```

---

## 🎯 Quick Access Guide

### I Want to...

**Test the Application Quickly**
1. Open: `my-app/TESTING_GUIDE.md`
2. Download: `my-app/public/sample_employees.csv`
3. Run: `npm run dev`
4. Upload test file

**Understand the Test Files**
1. Read: `my-app/public/TEST_FILES_README.md`
2. Check expected results
3. Review data quality issues

**Get Started Immediately**
1. See: `my-app/public/TEST_FILES_QUICK_START.txt`
2. Quick reference for rapid setup

**Create Custom Test Files**
1. See templates in: `TEST_FILES_PACKAGE.md`
2. Copy structure from provided samples

---

## 📊 Test Files Overview

### File 1: sample_employees.csv
**What:** Employee dataset with 10 records
**Where:** `my-app/public/sample_employees.csv`
**Size:** ~1 KB
**Data Quality Issues:**
- ✗ Missing Email (Bob Johnson, row 3)
- ✗ Missing Age (Alice Williams, row 4)
- ✗ Age outlier: 150 years (Ethan Hunt, row 7)
- ✗ Missing Email (George Harris, row 9)
**Quality Score:** ~75-80/100
**Best For:** Testing CSV parsing, missing value detection, outlier detection

### File 2: sample_products.json
**What:** Product inventory dataset with 10 items
**Where:** `my-app/public/sample_products.json`
**Size:** ~3 KB
**Data Quality Issues:**
- ✗ Null stock_quantity (Mechanical Keyboard)
- ✗ Empty supplier field (Webcam HD)
- ✗ Invalid rating: 999 (should be 0-5) (Portable Charger)
- ✗ Null reviews_count (Screen Protector)
**Quality Score:** ~70-75/100
**Best For:** Testing JSON parsing, null handling, outlier detection

---

## 🚀 Getting Started

### Step 1: Start Server
```bash
cd my-app
npm run dev
```

### Step 2: Access Application
```
http://localhost:3000
```

### Step 3: Upload Test File
- Option A: Download from `my-app/public/`
- Option B: Use drag-and-drop on home page
- Option C: Copy content and create new file

### Step 4: View Results
- Automatic redirect to `/analysis` page
- View data quality metrics
- Review AI-powered insights

---

## ✅ Testing Checklist

### Before Testing
- [ ] Server running (`npm run dev`)
- [ ] Browser open to `http://localhost:3000`
- [ ] Test files downloaded or copied
- [ ] `.env.local` configured (optional, for AI insights)

### CSV Test
- [ ] File uploads successfully
- [ ] All 10 rows visible in preview
- [ ] Quality metrics calculated
- [ ] Missing values detected
- [ ] Age outlier (150) detected
- [ ] Recommendations appear

### JSON Test
- [ ] File uploads successfully
- [ ] All 10 products visible
- [ ] Quality metrics calculated
- [ ] Null values detected
- [ ] Rating outlier (999) detected
- [ ] Recommendations appear

### Navigation Test
- [ ] Home page loads
- [ ] About page loads
- [ ] Docs page loads
- [ ] Analysis page shows correctly
- [ ] Back navigation works

---

## 📈 Expected Results

### CSV Analysis Results
```
File: sample_employees.csv
Rows: 10 | Columns: 10

Quality Scores:
├─ Overall: 75-80/100
├─ Completeness: 95%
├─ Consistency: 85%
├─ Accuracy: 70-75%
└─ Validity: 90%

Issues Detected:
├─ Missing Email: 2 values
├─ Missing Age: 1 value
├─ Age Outlier: 150 years
└─ Format Issues: Date consistency
```

### JSON Analysis Results
```
File: sample_products.json
Items: 10 | Attributes: 10

Quality Scores:
├─ Overall: 70-75/100
├─ Completeness: 97%
├─ Consistency: 80%
├─ Accuracy: 65-70%
└─ Validity: 85-90%

Issues Detected:
├─ Null Values: 3 fields
├─ Invalid Rating: 999
├─ Empty Supplier: 1 product
└─ Format Issues: Multiple
```

---

## 🔧 Environment Configuration

### For Full AI Features

Create `my-app/.env.local`:
```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
```

Get API key: https://platform.openai.com/api-keys

### Without API Key
- Platform still works
- Default insights provided
- No OpenAI API calls made

---

## 📚 Documentation Files

| File | Location | Purpose |
|------|----------|---------|
| TESTING_GUIDE.md | `my-app/` | Step-by-step testing instructions |
| TEST_FILES_README.md | `my-app/public/` | Detailed file documentation |
| TEST_FILES_QUICK_START.txt | `my-app/public/` | Quick reference guide |
| TEST_FILES_PACKAGE.md | `data-analysis-tutorial/` | Complete package overview |
| .env.example | `my-app/` | Environment variables template |

---

## 🐛 Troubleshooting

### File Won't Upload
```
Cause: Wrong file extension or corrupted file
Solution: 
- Check file is .csv or .json
- Verify file size < 50MB
- Ensure proper format (CSV headers in row 1, JSON is array)
```

### No AI Insights Appearing
```
Cause: OpenAI API key not configured
Solution:
- Optional - platform works without API
- To enable: add NEXT_PUBLIC_OPENAI_API_KEY to .env.local
- Restart development server
```

### Data Looks Wrong in Preview
```
Cause: File format issue
Solution:
- CSV: Verify headers in first row, proper comma separation
- JSON: Verify valid JSON, array of objects format
- Check UTF-8 encoding
```

### Server Won't Start
```
Cause: Dependencies not installed
Solution:
- Run: npm install
- Then: npm run dev
```

---

## 💡 Pro Tips

1. **Test Both Formats**: Upload both CSV and JSON to verify all features
2. **Check All Metrics**: Review all 4 quality metrics (Completeness, Consistency, Accuracy, Validity)
3. **Verify Outlier Detection**: Confirm Age=150 and rating=999 are caught
4. **Review Recommendations**: Check AI suggestions are relevant
5. **Test Navigation**: Ensure all links work properly

---

## 📞 Support Resources

- **Need help?** → See TESTING_GUIDE.md
- **Want details?** → See TEST_FILES_README.md
- **Quick start?** → See TEST_FILES_QUICK_START.txt
- **File specs?** → See this document

---

## ✨ What You Can Test

| Feature | CSV | JSON | Notes |
|---------|-----|------|-------|
| File Upload | ✓ | ✓ | Drag-drop & button |
| File Parsing | ✓ | ✓ | PapaParse & native JSON |
| Data Preview | ✓ | ✓ | First 5 rows in table |
| Quality Metrics | ✓ | ✓ | All 4 calculated |
| Missing Values | ✓ | ✓ | Detected correctly |
| Outlier Detection | ✓ | ✓ | Age=150, rating=999 |
| AI Insights | ✓ | ✓ | With OpenAI API key |
| Navigation | ✓ | ✓ | All routes work |
| Error Handling | ✓ | ✓ | Invalid files rejected |
| Responsiveness | ✓ | ✓ | Mobile & desktop |

---

## 🎉 Success!

After running tests successfully, you should see:
- ✓ Files upload without errors
- ✓ Data quality analysis completes
- ✓ All 4 metrics calculated correctly
- ✓ Data quality issues identified
- ✓ AI recommendations displayed
- ✓ Navigation works smoothly

---

## 📝 Next Steps

1. ✓ Download test files
2. ✓ Run application
3. ✓ Upload test files
4. ✓ Verify results
5. ⏭️ Create Screen 3 (Dashboard/Results)
6. ⏭️ Add export/download features
7. ⏭️ Build additional features

---

## 🚀 Ready?

**Start testing now:**
```bash
cd my-app
npm run dev
```

Open: `http://localhost:3000`

Upload: `sample_employees.csv` or `sample_products.json`

Enjoy! 🎯

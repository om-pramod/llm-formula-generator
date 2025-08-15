# Demo & Showcase Guide

This guide provides methods to showcase your LLM Formula Generator without consuming your Codespace hours.

## Public Demo Options (Zero Resource Usage)

### Option 1: Replit Live Demo

**Perfect for**: Instant public showcase, interactive testing

1. **Create Demo:**
   ```
   - Go to replit.com  
   - Click "Create Repl" → "Import from GitHub"
   - Enter: https://github.com/om-pramod/llm-formula-generator
   - Make it public
   ```

2. **Demo Features:**
   - Live server testing
   - API endpoint testing
   - Formula generation examples
   - No cost to you

### Option 2: Railway.app Free Deployment

**Perfect for**: Always-on API demo

1. **One-Click Deploy:**
   ```
   - Connect GitHub repo to Railway.app
   - Auto-deploys on push
   - Get permanent API URL
   - Free tier: 512MB RAM
   ```

2. **Live API Demo:**
   ```bash
   # Visitors can test live API
   curl -X POST https://your-app.railway.app/api/generate-formula \
     -H "Content-Type: application/json" \
     -d '{"range":"A2:A10","description":"CAGR"}'
   ```

### Option 3: GitHub Pages Documentation

**Perfect for**: Professional presentation of documentation

1. **Create GitHub Pages:**
   ```bash
   # In your repo settings:
   Settings → Pages → Source: GitHub Actions
   # Will auto-generate from your README.md
   ```

## Interactive Demo Script

### Google Sheets Demo (5 minutes)

```javascript
// Step 1: Create test spreadsheet
A2: 100000    (Year 1 Revenue)
A3: 110000    (Year 2 Revenue)  
A4: 125000    (Year 3 Revenue)
A5: 130000    (Year 4 Revenue)
A6: 145000    (Year 5 Revenue)

// Step 2: Add Apps Script code
Extensions → Apps Script → Paste Code.gs

// Step 3: Update server URL  
const SERVER_URL = 'https://your-demo-url';

// Step 4: Test formulas
B2: =LLMFORMULA(A2:A6, "CAGR")
B3: =LLMFORMULA(A2:A6, "total growth percentage")
B4: =LLMFORMULA(A2:A6, "average annual growth")
```

### Real-World Use Case Demonstrations

#### Financial Analysis
```javascript
=LLMFORMULA(A2:A10, "IRR internal rate of return")
=LLMFORMULA(B2:B50, "NPV with 10% discount rate")
=LLMFORMULA(C2:C20, "debt to equity ratio")
```

#### Data Analysis
```javascript
=LLMFORMULA(E2:E1000, "remove outliers beyond 2 standard deviations")
=LLMFORMULA(F2:F500, "interpolate missing values")
=LLMFORMULA(G1:I100, "correlation matrix")
```

#### Business Metrics
```javascript
=LLMFORMULA(K2:K365, "customer lifetime value")
=LLMFORMULA(L2:L50, "churn rate monthly")
=LLMFORMULA(M1:M24, "seasonal adjustment factor")
```

## Performance Results

| Method         | Avg Response | Use Case          |
| -------------- | ------------ | ----------------- |
| Cache Hit      | <50ms        | Repeated requests |
| Static Pattern | <100ms       | Common formulas   |
| LLM Generated  | 3-8s         | Complex requests  |

## Before/After Comparison

### Traditional Approach
```
Manual Formula Creation:
├── Google formula syntax (5+ mins)
├── Debug parentheses (2+ mins)  
├── Test with sample data (3+ mins)
└── Total: 10-15 minutes per formula
```

### LLMFORMULA Approach  
```
AI-Powered Generation:
├── Describe what you need (10 seconds)
├── Get working formula (3 seconds)
└── Total: ~15 seconds per formula
```

---
Last updated: 2025-08-14  
Author: [om-pramod](https://github.com/om-pramod)

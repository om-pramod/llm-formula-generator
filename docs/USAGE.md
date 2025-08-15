# Using LLM Formula Generator

This guide explains how to use the `=LLMFORMULA()` function in your Google Sheets after setup.

## Basic Syntax

```
=LLMFORMULA(range, description)
```

### Parameters

- **range**: The cell range you want the formula to work with (e.g., "A2:A10"), can also be a direct array of values
- **description**: A natural language description of what you want to calculate (e.g., "CAGR")

## Simple Examples

```
=LLMFORMULA(A2:A10, "average")
=LLMFORMULA(B5:B20, "sum")
=LLMFORMULA(C1:C50, "count non-empty cells")
```

## Advanced Examples

### Financial Formulas

```
=LLMFORMULA(A2:A10, "CAGR")
=LLMFORMULA(B2:B50, "NPV with 10% discount rate")
=LLMFORMULA(C2:C20, "debt to equity ratio")
=LLMFORMULA(D1:D12, "monthly recurring revenue growth")
```

### Statistical Analysis

```
=LLMFORMULA(E2:E1000, "remove outliers beyond 2 standard deviations")
=LLMFORMULA(F2:F500, "interpolate missing values")
=LLMFORMULA(G1:I100, "correlation matrix")
=LLMFORMULA(J2:J200, "z-score normalization")
```

### Business Metrics

```
=LLMFORMULA(K2:K365, "customer lifetime value")
=LLMFORMULA(L2:L50, "churn rate monthly")
=LLMFORMULA(M1:M24, "seasonal adjustment factor")
=LLMFORMULA(N2:N100, "cohort retention analysis")
```

## Direct Array Input

You can also pass direct array values instead of cell references:

```
=LLMFORMULA({100, 110, 125, 130, 145}, "CAGR")
=LLMFORMULA({1, 2, 3, 0, 5}, "sum excluding zeros")
```

This is useful for quick calculations or testing without needing to fill cells with data.

## Tips for Best Results

1. **Be specific**: "Calculate moving average over 7 periods" is better than "moving average"

2. **Include units or rates when relevant**: "Compound annual growth rate" is better than just "growth rate"

3. **For complex calculations, mention the methodology**: "NPV using 8% discount rate" instead of just "NPV"

4. **Check the output**: The function returns an actual Google Sheets formula, which you can view and modify

5. **For time series data, specify periods**: "Moving average 7 days" or "forecast next 3 months"

6. **Reference sample data**: If providing sample data helps clarify, mention: "Calculate trend line from this sales data"

## Working with Multi-Column Data

For calculations across multiple columns:

```
=LLMFORMULA(A2:C10, "correlation between columns")
=LLMFORMULA(D1:F20, "multiply column 1 by column 2 and divide by column 3")
```

## Offline Usage and Fallbacks

If your server is unavailable, the system will automatically fall back to static patterns. However, these are more limited than the LLM-generated formulas.

### How Fallbacks Work

1. First, the function tries to connect to your LLM server
2. If successful, it generates a custom formula for your specific need
3. If connection fails, it uses built-in pattern matching for common formulas
4. The essential patterns are included directly in the Apps Script
5. The server contains a more comprehensive set of 60+ formula patterns

### When to Expect Fallbacks

- When your Codespace is sleeping (after 30 minutes of inactivity)
- When your network connection is limited
- When the LLM server is experiencing high load or errors

## Troubleshooting

### Formula Error: #ERROR!
- Check that your server is running
- Verify the range is valid
- Ensure the description is clear

### Unexpected Formula Result
- Try being more specific in your description
- Check the generated formula by double-clicking the cell
- Modify the formula manually if needed

### Slow Response
- First-time requests to the LLM take 3-8 seconds
- Subsequent similar requests will use the cache (much faster)
- Consider adding more fallback patterns for common calculations

## Adding Custom Formula Patterns

This project maintains formula patterns in two places:

1. **Primary Source**: All 60+ patterns are in `server/formulas.js`
2. **Fallback Patterns**: A minimal set is duplicated in `apps-script/Code.gs` for offline use

When adding new formula patterns:
- Always update `server/formulas.js` first (the source of truth)
- Only add to `apps-script/Code.gs` if it's a frequently used pattern

### Example: Adding Custom Patterns

```javascript
// In server/formulas.js
const patterns = {
  // Existing patterns...
  
  // Add your custom patterns:
  'sales commission': (range) => `=${range}*0.15`,
  'tax calculation': (range) => `=${range}*1.08`,
  'profit margin': (range) => `=(${range.replace('A','B')}-${range})/${range.replace('A','B')}`
};
```

## Advanced: Optimizing for Your Needs

If you find yourself using certain formulas frequently:

1. Add them to the server's pattern list in `server/formulas.js`
2. For critical formulas that you need to work offline, add them to the minimal fallback set in `apps-script/Code.gs`
3. Consider hosting the server on a more reliable platform if you need constant availability

## Performance Considerations

- **Cache duration**: Results are cached for 6 hours by default
- **Timeout**: Server requests timeout after 10 seconds
- **Sample data**: Only the first 5 values are sent to the server for context
- **Formula validation**: All generated formulas are validated for safety

---
Last updated: 2025-08-14 21:04:19  
Author: [om-pramod](https://github.com/om-pramod)

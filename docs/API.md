# API Documentation

## Overview

The LLM Formula Generator provides a REST API for generating Google Sheets formulas using AI with fallback to static patterns.

## Base URL

```
Local: http://localhost:3000
Codespaces: https://your-codespace-url.app.github.dev
```

## Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "cache_size": 15
}
```

### Generate Formula
```http
POST /api/generate-formula
```

**Request Body:**
```json
{
  "range": "A2:A10",
  "description": "CAGR",
  "sampleData": [100, 110, 125, 130, 145]
}
```

**Response (Success):**
```json
{
  "success": true,
  "formula": "=POWER(INDEX(A2:A10,ROWS(A2:A10))/INDEX(A2:A10,1),1/(ROWS(A2:A10)-1))-1",
  "source": "generated",
  "range": "A2:A10",
  "description": "CAGR"
}
```

**Response (Fallback):**
```json
{
  "success": true,
  "formula": "=POWER(INDEX(A2:A10,ROWS(A2:A10))/INDEX(A2:A10,1),1/(ROWS(A2:A10)-1))-1",
  "source": "fallback",
  "range": "A2:A10",
  "description": "CAGR",
  "error": "LLM timeout"
}
```

## Request Parameters

### `range` (required)
- **Type:** String
- **Description:** Google Sheets range reference
- **Examples:** `"A2:A10"`, `"A1:C5"`, `"Sheet1!A2:B10"`

### `description` (required)
- **Type:** String  
- **Description:** Natural language description of desired formula
- **Examples:** `"CAGR"`, `"sum excluding zeros"`, `"moving average 7 periods"`

### `sampleData` (optional)
- **Type:** Array of numbers
- **Description:** Sample data points to help LLM understand context
- **Limit:** First 5 values used
- **Example:** `[100, 110, 125, 130, 145]`

## Response Fields

### `success` (boolean)
- Always `true` (errors return fallback formulas)

### `formula` (string)
- Generated Google Sheets formula starting with `=`
- Validated and safe (no dangerous functions)

### `source` (string)
- `"generated"` - Created by LLM
- `"cache"` - Retrieved from cache
- `"fallback"` - Static pattern used

### `range` (string)
- Echo of input range parameter

### `description` (string)
- Echo of input description parameter

### `error` (string, optional)
- Present when fallback is used
- Describes why LLM generation failed

## Error Handling

The API never returns HTTP error codes for formula requests. Instead, it returns fallback formulas with an error explanation when LLM generation fails.

## Rate Limiting

There are no artificial rate limits, but be aware that:
- LLM generation takes 3-8 seconds
- Cached results return in <50ms
- Fallback patterns return in <100ms

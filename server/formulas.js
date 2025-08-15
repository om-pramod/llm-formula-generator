/**
 * Static formula patterns for LLM Formula Generator
 * These serve as fallbacks when the LLM is unavailable
 */

const patterns = {
  // Financial formulas
  'cagr': (range) => `=POWER(INDEX(${range},ROWS(${range}))/INDEX(${range},1),1/(ROWS(${range})-1))-1`,
  'compound annual growth rate': (range) => patterns['cagr'](range),
  'compound growth': (range) => patterns['cagr'](range),
  'annual growth rate': (range) => patterns['cagr'](range),
  
  'total growth': (range) => `=(INDEX(${range},ROWS(${range}))/INDEX(${range},1))-1`,
  'total growth percentage': (range) => `=(INDEX(${range},ROWS(${range}))/INDEX(${range},1)-1)*100`,
  'growth percentage': (range) => patterns['total growth percentage'](range),
  
  'average growth': (range) => `=AVERAGE(ARRAYFORMULA(${range}/OFFSET(${range},1,0,ROWS(${range})-1,1)-1))`,
  'average annual growth': (range) => patterns['average growth'](range),
  
  // Statistical formulas
  'average': (range) => `=AVERAGE(${range})`,
  'mean': (range) => `=AVERAGE(${range})`,
  
  'median': (range) => `=MEDIAN(${range})`,
  
  'standard deviation': (range) => `=STDEV(${range})`,
  'stdev': (range) => `=STDEV(${range})`,
  'std dev': (range) => `=STDEV(${range})`,
  
  'variance': (range) => `=VAR(${range})`,
  'var': (range) => `=VAR(${range})`,
  
  'correlation': (range) => `=CORREL(${range})`,
  'correl': (range) => `=CORREL(${range})`,
  
  'percentile': (range) => `=PERCENTILE(${range}, 0.9)`,
  '90th percentile': (range) => `=PERCENTILE(${range}, 0.9)`,
  '75th percentile': (range) => `=PERCENTILE(${range}, 0.75)`,
  '50th percentile': (range) => `=PERCENTILE(${range}, 0.5)`,
  '25th percentile': (range) => `=PERCENTILE(${range}, 0.25)`,
  '10th percentile': (range) => `=PERCENTILE(${range}, 0.1)`,
  
  // Time series formulas
  'moving average': (range) => `=AVERAGE(OFFSET(${range},ROW()-ROW(${range})-4,0,5,1))`,
  'moving average 3': (range) => `=AVERAGE(OFFSET(${range},ROW()-ROW(${range})-2,0,3,1))`,
  'moving average 5': (range) => `=AVERAGE(OFFSET(${range},ROW()-ROW(${range})-4,0,5,1))`,
  'moving average 7': (range) => `=AVERAGE(OFFSET(${range},ROW()-ROW(${range})-6,0,7,1))`,
  'ma 3': (range) => patterns['moving average 3'](range),
  'ma 5': (range) => patterns['moving average 5'](range),
  'ma 7': (range) => patterns['moving average 7'](range),
  
  'exponential moving average': (range) => `=EMA(${range}, 0.3)`,
  'ema': (range) => `=EMA(${range}, 0.3)`,
  
  'forecast': (range) => `=FORECAST(ROWS(${range})+1,ROW(${range}),${range})`,
  'linear forecast': (range) => patterns['forecast'](range),
  'trend': (range) => `=TREND(${range},ROW(${range}),ROW(${range})+1)`,
  'linear trend': (range) => patterns['trend'](range),
  
  // Basic math operations
  'sum': (range) => `=SUM(${range})`,
  'total': (range) => `=SUM(${range})`,
  'add': (range) => `=SUM(${range})`,
  
  'sum excluding zeros': (range) => `=SUMIF(${range},"<>0")`,
  'sum ignoring zeros': (range) => `=SUMIF(${range},"<>0")`,
  'sum non-zero': (range) => `=SUMIF(${range},"<>0")`,
  
  'product': (range) => `=PRODUCT(${range})`,
  'multiply': (range) => `=PRODUCT(${range})`,
  
  'minimum': (range) => `=MIN(${range})`,
  'min': (range) => `=MIN(${range})`,
  'smallest': (range) => `=MIN(${range})`,
  
  'maximum': (range) => `=MAX(${range})`,
  'max': (range) => `=MAX(${range})`,
  'largest': (range) => `=MAX(${range})`,
  
  'count': (range) => `=COUNT(${range})`,
  'count values': (range) => `=COUNT(${range})`,
  
  'count non-empty': (range) => `=COUNTA(${range})`,
  'count non-empty cells': (range) => `=COUNTA(${range})`,
  'count all': (range) => `=COUNTA(${range})`,
  
  'count empty': (range) => `=COUNTBLANK(${range})`,
  'count empty cells': (range) => `=COUNTBLANK(${range})`,
  'count blanks': (range) => `=COUNTBLANK(${range})`,
  
  // Conditional formulas
  'count if greater than zero': (range) => `=COUNTIF(${range},">0")`,
  'count positive': (range) => `=COUNTIF(${range},">0")`,
  'count if less than zero': (range) => `=COUNTIF(${range},"<0")`,
  'count negative': (range) => `=COUNTIF(${range},"<0")`,
  
  'sum if greater than zero': (range) => `=SUMIF(${range},">0")`,
  'sum positive': (range) => `=SUMIF(${range},">0")`,
  'sum if less than zero': (range) => `=SUMIF(${range},"<0")`,
  'sum negative': (range) => `=SUMIF(${range},"<0")`,
  
  'average if greater than zero': (range) => `=AVERAGEIF(${range},">0")`,
  'average positive': (range) => `=AVERAGEIF(${range},">0")`,
  'average if less than zero': (range) => `=AVERAGEIF(${range},"<0")`,
  'average negative': (range) => `=AVERAGEIF(${range},"<0")`,

  'average excluding zeros': (range) => `=AVERAGEIF(${range},"<>0")`,
  'average ignoring zeros': (range) => `=AVERAGEIF(${range},"<>0")`,
  'average non-zero': (range) => `=AVERAGEIF(${range},"<>0")`,

  'growth rate': (range) => `=(INDEX(${range},ROWS(${range}))/INDEX(${range},1))-1`,

  // Text formulas
  'concatenate': (range) => `=CONCATENATE(${range})`,
  'join text': (range) => `=CONCATENATE(${range})`,
  'trim whitespace': (range) => `=TRIM(${range})`,
  'clean text': (range) => `=TRIM(${range})`,

  // Lookup formulas
  'vlookup': (range) => `=VLOOKUP("search_key", ${range}, 2, FALSE)`,
  'vertical lookup': (range) => `=VLOOKUP("search_key", ${range}, 2, FALSE)`,

  // Date formulas
  'today': (range) => `=TODAY()`,
  'current date': (range) => `=TODAY()`,

  // Logical formulas
  'iferror': (range) => `=IFERROR(${range}, "Error")`,
  'if error': (range) => `=IFERROR(${range}, "Error")`,
};

/**
 * Get a static formula matching the description
 * @param {string} description - Natural language description of formula
 * @param {string} range - Cell range (e.g., "A2:A10")
 * @returns {string} Google Sheets formula or null if no match
 */
function getStaticFormula(description, range) {
  // Normalize description
  const normalizedDesc = description.toLowerCase().trim();
  
  // Direct match
  if (patterns[normalizedDesc]) {
    return patterns[normalizedDesc](range);
  }
  
  // Fuzzy match
  for (const [key, formulaFn] of Object.entries(patterns)) {
    if (normalizedDesc.includes(key)) {
      return formulaFn(range);
    }
  }
  
  // Default to AVERAGE if no match
  return `=AVERAGE(${range})`;
}

/**
 * Validate a formula for safety and correctness
 * @param {string} formula - Formula to validate
 * @returns {boolean} True if formula is valid and safe
 */
function validateFormula(formula) {
  // Must start with equals sign
  if (!formula.startsWith('=')) {
    return false;
  }

  // Check for minimum and maximum length
  if (formula.length < 2 || formula.length > 500) {
    return false;
  }
  
  // Dangerous functions to block
  const dangerousFunctions = [
    'IMPORTRANGE', 'IMPORTDATA', 'IMPORTXML', 'IMPORTHTML', 'IMPORTFEED',
    'DELETE', 'REMOVE', 'DROP', 'EXECUTE', 'SCRIPT', 'EVAL',
    'IMAGE', 'URL', 'HYPERLINK'
  ];
  
  // Check for dangerous functions
  for (const func of dangerousFunctions) {
    if (formula.toUpperCase().includes(func)) {
      return false;
    }
  }
  
  // Check for balanced parentheses
  let parenCount = 0;
  for (const char of formula) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) return false;
  }
  if (parenCount !== 0) return false;
  
  // Simple syntax check for quotes
  let quoteCount = 0;
  for (const char of formula) {
    if (char === '"') quoteCount++;
  }
  if (quoteCount % 2 !== 0) return false;
  
  return true;
}

module.exports = {
  getStaticFormula,
  validateFormula
};
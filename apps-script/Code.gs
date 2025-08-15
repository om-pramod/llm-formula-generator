/**
 * LLM Formula Generator - Google Apps Script
 * This script adds the LLMFORMULA function to Google Sheets
 * 
 * Custom function that generates spreadsheet formulas using AI
 * Completely free implementation with local LLM and fallback patterns
 * 
 * Usage: =LLMFORMULA(A2:A10, "CAGR")
 *        =LLMFORMULA(range, "description of formula needed")
 */

// Configuration - UPDATE THIS URL
const SERVER_URL = 'YOUR_CODESPACE_URL'; // e.g., 'https://fuzzy-space-disco-abc123.github.dev'
const CACHE_EXPIRATION = 21600; // 6 hours in seconds
const TIMEOUT_MS = 10000; // 10 seconds

/**
 * Generate formulas using LLM with fallback to static patterns
 * 
 * @param {Range|string|Array} range - Range of cells to operate on
 * @param {string} description - Natural language description of what the formula should do
 * @return {string} A Google Sheets formula as a string
 * @customfunction
 */
function LLMFORMULA(range, description) {
  // Input validation
  if (!range || !description || description.toString().trim() === '') {
    return "=ERROR(\"Missing parameters: LLMFORMULA requires a range and description\")";
  }
  
  // Handle different input types
  let sampleData = [];
  let rangeRef = '';

  if (Array.isArray(range)) {
    // Direct array input
    sampleData = range.flat().filter(cell => cell !== '' && cell != null && !isNaN(cell));
    rangeRef = 'A2:A' + (sampleData.length + 1);
  } else if (typeof range === 'string') {
    // String range reference
    rangeRef = range;
    try {
      // Try to get actual data from range
      const rangeObj = SpreadsheetApp.getActiveSheet().getRange(range);
      const values = rangeObj.getValues().flat();
      sampleData = values.filter(cell => cell !== '' && cell != null && !isNaN(cell));
    } catch (e) {
      // Range might not exist yet, that's okay
      sampleData = [];
    }
  } else {
    // Assume it's a Range object
    rangeRef = range.getA1Notation();
  }
  
  try {
    // Use CacheService for faster responses
    const cache = CacheService.getScriptCache();
    const cacheKey = rangeRef + '|' + description.toString().toLowerCase().trim();
    const cachedFormula = cache.get(cacheKey);
    
    if (cachedFormula) {
      return cachedFormula;
    }
    
    // Send request to the LLM Formula Generator server
    const formula = sendFormulaRequest(rangeRef, description, sampleData.slice(0, 5));
    
    // Cache the result
    if (formula && formula.startsWith('=')) {
      cache.put(cacheKey, formula, CACHE_EXPIRATION);
    }
    
    return formula;
  } catch (error) {
    Logger.log('Error in LLMFORMULA: ' + error);
    
    // Fallback to static patterns
    const fallbackFormula = getLocalFallback(description.toString().trim(), rangeRef);
    Logger.log(`Using fallback formula: ${fallbackFormula}`);
    
    return fallbackFormula;
  }
}

/**
 * Send request to the LLM Formula Generator server
 * 
 * @param {string} range - Range reference
 * @param {string} description - Formula description
 * @param {Array} sampleData - Optional sample data for context
 * @return {string} Generated formula
 */
function sendFormulaRequest(range, description, sampleData = []) {
  if (!SERVER_URL || SERVER_URL === 'YOUR_CODESPACE_URL') {
    throw new Error('Server URL not configured');
  }
  
  // Prepare request
  const requestData = {
    range: range,
    description: description,
    sampleData: sampleData
  };
  
  // Define request options
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(requestData),
    muteHttpExceptions: true,
    timeout: TIMEOUT_MS
  };
  
  try {
    // Send request to server
    const response = UrlFetchApp.fetch(SERVER_URL + '/api/generate-formula', options);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200) {
      const responseData = JSON.parse(response.getContentText());
      
      if (responseData.success && responseData.formula) {
        return responseData.formula;
      } else {
        Logger.log('API error: ' + JSON.stringify(responseData));
        throw new Error('LLM Formula Generator API error');
      }
    } else {
      Logger.log('HTTP error: ' + responseCode);
      throw new Error('Server error: ' + responseCode);
    }
  } catch (error) {
    Logger.log('Request error: ' + error);
    throw new Error('Connection error: ' + error.toString());
  }
}

/**
 * Local fallback formula patterns (minimal version for essential offline use)
 * For the full set of patterns, see server/formulas.js
 * 
 * @param {string} description - Formula description
 * @param {string} range - Range reference
 * @return {string} Fallback formula
 */
function getLocalFallback(description, range) {
  const desc = description.toLowerCase();
  
  // ESSENTIAL PATTERNS ONLY - Core patterns for offline fallback
  // For the complete set, see server/formulas.js
  
  // Financial formulas
  if (desc.includes('cagr') || desc.includes('compound annual growth')) {
    return `=POWER(INDEX(${range},ROWS(${range}))/INDEX(${range},1),1/(ROWS(${range})-1))-1`;
  }
  
  if (desc.includes('growth') || desc.includes('percentage change')) {
    return `=(INDEX(${range},ROWS(${range}))/INDEX(${range},1)-1)*100`;
  }
  
  // Statistical formulas
  if (desc.includes('sum') && (desc.includes('excluding zero') || desc.includes('without zero'))) {
    return `=SUMIF(${range},"<>0")`;
  }
  
  if (desc.includes('sum')) {
    return `=SUM(${range})`;
  }
  
  if (desc.includes('average') || desc.includes('mean')) {
    return `=AVERAGE(${range})`;
  }
  
  if (desc.includes('median')) {
    return `=MEDIAN(${range})`;
  }
  
  if (desc.includes('standard deviation') || desc.includes('stdev')) {
    return `=STDEV.S(${range})`;
  }
  
  if (desc.includes('count')) {
    return `=COUNT(${range})`;
  }
  
  if (desc.includes('max') || desc.includes('maximum')) {
    return `=MAX(${range})`;
  }
  
  if (desc.includes('min') || desc.includes('minimum')) {
    return `=MIN(${range})`;
  }

  // Time series
  if (desc.includes('moving average')) {
    return `=AVERAGE(OFFSET(${range.split(':')[0]},ROW()-ROW(${range.split(':')[0]})-2,0,3,1))`;
  }

  // Default fallback
  return `=AVERAGE(${range})`;
}

/**
 * Adds a menu to the Google Sheets UI when the spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('LLM Formula Generator')
    .addItem('About', 'showAbout')
    .addSeparator()
    .addItem('Health Check', 'checkServerHealth')
    .addToUi();
}

/**
 * Shows information about the LLM Formula Generator
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    'LLM Formula Generator',
    'Version: 1.0.0\n' +
    'Author: om-pramod\n\n' +
    'Usage: =LLMFORMULA(range, "description")\n\n' +
    'Example: =LLMFORMULA(A1:A10, "CAGR")\n\n' +
    'For more information, visit: https://github.com/om-pramod/llm-formula-generator',
    ui.ButtonSet.OK
  );
}

/**
 * Checks the health of the LLM Formula Generator server
 */
function checkServerHealth() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const response = UrlFetchApp.fetch(SERVER_URL + '/health', {
      muteHttpExceptions: true,
      timeout: 5000
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      
      ui.alert(
        'Server Status: ' + data.status.toUpperCase(),
        'Status: ' + data.status + '\n' +
        'Timestamp: ' + data.timestamp + '\n' +
        'Cache size: ' + data.cache_size + ' entries\n\n' +
        'Server is working correctly!',
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        'Server Error',
        'The server returned an error status: ' + response.getResponseCode() + '\n\n' +
        'Please check your server configuration.',
        ui.ButtonSet.OK
      );
    }
  } catch (error) {
    ui.alert(
      'Connection Error',
      'Could not connect to the LLM Formula Generator server.\n\n' +
      'Error: ' + error.toString() + '\n\n' +
      'Please check your server URL and make sure the server is running.',
      ui.ButtonSet.OK
    );
  }
}

/**
 * Test function for development - can be run from Script Editor
 */
function testLLMFormula() {
  // Test with sample data
  const testCases = [
    { range: [100, 110, 125, 130, 145], desc: "CAGR" },
    { range: [1, 2, 3, 0, 5], desc: "sum excluding zeros" },
    { range: "A1:A5", desc: "average" },
    { range: [10, 20, 30], desc: "percentage change" }
  ];
  
  testCases.forEach((test, i) => {
    try {
      const result = LLMFORMULA(test.range, test.desc);
      Logger.log(`Test ${i + 1}: ${test.desc} -> ${result}`);
    } catch (error) {
      Logger.log(`Test ${i + 1} failed: ${error.toString()}`);
    }
  });
  
  Logger.log(getServerStatus());
}

/**
 * Helper function to get server status
 */
function getServerStatus() {
  if (!SERVER_URL || SERVER_URL === 'YOUR_CODESPACE_URL') {
    return 'Server URL not configured';
  }
  
  try {
    const response = UrlFetchApp.fetch(SERVER_URL + '/health', {
      method: 'GET',
      timeout: 5000,
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return `Server healthy - Cache: ${data.cache_size} entries`;
    } else {
      return `Server unreachable - Status: ${response.getResponseCode()}`;
    }
  } catch (error) {
    return `Server error: ${error.toString()}`;
  }
}

// Last updated: 2025-08-14
// Author: om-pramod

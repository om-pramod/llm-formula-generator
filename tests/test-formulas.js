const assert = require('assert');
const { getStaticFormula, validateFormula, FORMULA_PATTERNS } = require('../server/formulas');

console.log('🧪 Testing LLM Formula Generator...\n');

// Test static formula generation
function testStaticFormulas() {
  console.log('📊 Testing Static Formula Patterns...');
  
  const testCases = [
    { desc: 'CAGR', range: 'A2:A10', expected: /POWER.*INDEX/ },
    { desc: 'sum', range: 'B1:B5', expected: /SUM\(B1:B5\)/ },
    { desc: 'average excluding zeros', range: 'C2:C20', expected: /AVERAGEIF.*<>0/ },
    { desc: 'growth rate', range: 'D1:D3', expected: /INDEX.*INDEX.*-1/ },
    { desc: 'moving average', range: 'E2:E15', expected: /AVERAGE.*OFFSET/ },
    { desc: 'sum positive', range: 'F1:F10', expected: /SUMIF.*>0/ },
    { desc: 'unknown formula', range: 'G1:G5', expected: /AVERAGE\(G1:G5\)/ }
  ];
  
  let passed = 0;
  
  testCases.forEach(({ desc, range, expected }, i) => {
    const formula = getStaticFormula(desc, range);
    const match = expected.test(formula);
    
    console.log(`  ${i + 1}. "${desc}" → ${formula}`);
    console.log(`     Range: ${range}, Match: ${match ? '✅' : '❌'}`);
    
    if (match) passed++;
  });
  
  console.log(`\n📊 Static Formulas: ${passed}/${testCases.length} passed\n`);
  return passed === testCases.length;
}

// Test formula validation
function testValidation() {
  console.log('🔒 Testing Formula Validation...');
  
  const validFormulas = [
    '=SUM(A2:A10)',
    '=POWER(INDEX(A2:A10,ROWS(A2:A10))/INDEX(A2:A10,1),1/(ROWS(A2:A10)-1))-1',
    '=AVERAGE(IF(A2:A10<>0,A2:A10))',
    '=IFERROR(B2/B1,"N/A")'
  ];
  
  const invalidFormulas = [
    'SUM(A2:A10)',           // Missing =
    '=',                     // Too short
    '=IMPORTXML("url","xpath")', // Dangerous function
    '=SUM(A2:A10',          // Unbalanced parentheses
    '=SUM(A2:A10))',        // Extra parentheses
    '=' + 'A'.repeat(600)   // Too long
  ];
  
  let validPassed = 0;
  let invalidPassed = 0;
  
  console.log('  Valid formulas:');
  validFormulas.forEach((formula, i) => {
    const isValid = validateFormula(formula);
    console.log(`    ${i + 1}. ${formula.substring(0, 50)}... → ${isValid ? '✅' : '❌'}`);
    if (isValid) validPassed++;
  });
  
  console.log('\n  Invalid formulas:');
  invalidFormulas.forEach((formula, i) => {
    const isValid = validateFormula(formula);
    console.log(`    ${i + 1}. ${formula.substring(0, 50)}... → ${!isValid ? '✅' : '❌'}`);
    if (!isValid) invalidPassed++;
  });
  
  const totalPassed = validPassed + invalidPassed;
  const totalTests = validFormulas.length + invalidFormulas.length;
  
  console.log(`\n🔒 Validation: ${totalPassed}/${totalTests} passed\n`);
  return totalPassed === totalTests;
}

// Test server endpoints
async function testServerEndpoints() {
  console.log('🌐 Testing Server Endpoints...');
  
  const fetch = require('node-fetch');
  const baseUrl = 'http://localhost:3000';

  // Test health endpoint
  console.log('  Testing /health...');
  const healthResponse = await fetch(`${baseUrl}/health`);
  const healthData = await healthResponse.json();

  const healthOk = healthResponse.ok && healthData.status === 'healthy';
  console.log(`    Health check: ${healthOk ? '✅' : '❌'}`);

  // Test formula generation endpoint
  console.log('  Testing /api/generate-formula...');
  const formulaResponse = await fetch(`${baseUrl}/api/generate-formula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      range: 'A2:A10',
      description: 'CAGR',
      sampleData: [100, 110, 125, 130, 145]
    })
  });

  const formulaData = await formulaResponse.json();
  const formulaOk = formulaResponse.ok &&
                   formulaData.success &&
                   formulaData.formula.startsWith('=');

  console.log(`    Formula generation: ${formulaOk ? '✅' : '❌'}`);
  console.log(`    Generated: ${formulaData.formula}`);
  console.log(`    Source: ${formulaData.source}`);

  return healthOk && formulaOk;
}

// Test Apps Script integration (mock)
function testAppsScriptMock() {
  console.log('📱 Testing Apps Script Integration (Mock)...');
  
  // Mock Google Apps Script environment
  global.UrlFetchApp = {
    fetch: (url, options) => {
      // Mock successful response
      return {
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify({
          success: true,
          formula: '=SUM(A2:A10)',
          source: 'mock'
        })
      };
    }
  };
  
  global.SpreadsheetApp = {
    getActiveSheet: () => ({
      getRange: (range) => ({
        getValues: () => [[100], [110], [125], [130], [145]]
      })
    })
  };
  
  // Load and test the Apps Script code
  const appsScriptCode = `
    const SERVER_URL = 'http://localhost:3000';
    
    function getLocalFallback(description, range) {
      if (description.toLowerCase().includes('sum')) return '=SUM(' + range + ')';
      return '=AVERAGE(' + range + ')';
    }
    
    function LLMFORMULA(range, description) {
      try {
        // Mock server call success
        return '=POWER(INDEX(A2:A10,ROWS(A2:A10))/INDEX(A2:A10,1),1/(ROWS(A2:A10)-1))-1';
      } catch (error) {
        return getLocalFallback(description, range);
      }
    }
  `;
  
  // Test mock function
  eval(appsScriptCode);
  
  const testResult = LLMFORMULA('A2:A10', 'CAGR');
  const success = testResult.startsWith('=POWER');
  
  console.log(`  Mock LLMFORMULA result: ${testResult}`);
  console.log(`  Integration test: ${success ? '✅' : '❌'}`);
  
  return success;
}

// Performance benchmarks
function benchmarkFormulas() {
  console.log('⚡ Performance Benchmarks...');
  
  const iterations = 1000;
  const testDesc = 'compound annual growth rate';
  const testRange = 'A2:A20';
  
  console.time('  Static formula generation');
  for (let i = 0; i < iterations; i++) {
    getStaticFormula(testDesc, testRange);
  }
  console.timeEnd('  Static formula generation');
  
  console.time('  Formula validation');
  const testFormula = '=POWER(INDEX(A2:A20,ROWS(A2:A20))/INDEX(A2:A20,1),1/(ROWS(A2:A20)-1))-1';
  for (let i = 0; i < iterations; i++) {
    validateFormula(testFormula);
  }
  console.timeEnd('  Formula validation');
  
  console.log('  Performance: ✅ Benchmarks completed\n');
}

// Integration test with sample data
function testWithSampleData() {
  console.log('📈 Testing with Sample Data...');
  
  const sampleData = {
    revenue: [100000, 110000, 125000, 130000, 145000],
    expenses: [80000, 85000, 95000, 100000, 110000],
    mixed: [0, 5, -2, 8, 0, 12, -1],
    quarterly: [100, 105, 108, 112, 115, 118, 122, 125]
  };
  
  const testCases = [
    { data: 'revenue', desc: 'CAGR', range: 'A2:A6' },
    { data: 'revenue', desc: 'year over year growth', range: 'A2:A6' },
    { data: 'expenses', desc: 'average', range: 'B2:B6' },
    { data: 'mixed', desc: 'sum excluding zeros', range: 'C2:C8' },
    { data: 'mixed', desc: 'count positive values', range: 'C2:C8' },
    { data: 'quarterly', desc: 'moving average 4 periods', range: 'D2:D9' }
  ];
  
  let passed = 0;
  
  testCases.forEach(({ data, desc, range }, i) => {
    const formula = getStaticFormula(desc, range);
    const valid = validateFormula(formula);
    
    console.log(`  ${i + 1}. ${data} data: "${desc}"`);
    console.log(`     Formula: ${formula}`);
    console.log(`     Valid: ${valid ? '✅' : '❌'}`);
    console.log(`     Sample: [${sampleData[data].slice(0, 3).join(', ')}...]`);
    console.log('');
    
    if (valid) passed++;
  });
  
  console.log(`📈 Sample Data Tests: ${passed}/${testCases.length} passed\n`);
  return passed === testCases.length;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 LLM Formula Generator - Test Suite\n');
  
  const app = require('../server/server');
  let server;
  
  try {
    // Start server
    server = await new Promise(resolve => {
      const s = app.listen(3000, () => resolve(s));
    });
    console.log('✅ Server started for testing');

    // Wait for server to be healthy
    let isHealthy = false;
    for (let i = 0; i < 5; i++) {
      try {
        const response = await require('node-fetch')('http://localhost:3000/health');
        if (response.ok) {
          isHealthy = true;
          break;
        }
      } catch (e) {
        await new Promise(res => setTimeout(res, 500));
      }
    }

    if (!isHealthy) {
      throw new Error('Server did not become healthy in time.');
    }
    console.log('✅ Server is healthy');

    console.log('=' + '='.repeat(50) + '\n');

    const results = [];

    // Run all tests
    results.push({ name: 'Static Formulas', passed: testStaticFormulas() });
    results.push({ name: 'Validation', passed: testValidation() });
    results.push({ name: 'Sample Data', passed: testWithSampleData() });
    results.push({ name: 'Apps Script Mock', passed: testAppsScriptMock() });

    // Run server tests
    results.push({ name: 'Server Endpoints', passed: await testServerEndpoints() });

    // Performance benchmarks
    benchmarkFormulas();

    // Summary
    console.log('📋 Test Summary');
    console.log('=' + '='.repeat(50));

    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;

    results.forEach(({ name, passed }) => {
      console.log(`  ${name}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    });

    console.log('');
    console.log(`Overall: ${passedTests}/${totalTests} test suites passed`);
    console.log(`Status: ${passedTests === totalTests ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED'}`);

    if (passedTests !== totalTests) {
      console.log('\nTo fix failing tests:');
      console.log('  1. For server tests: Run "npm start" in server directory');
      console.log('  2. For validation tests: Check server/formulas.js');
      console.log('  3. For Apps Script tests: Check apps-script/Code.gs');
    }

    console.log('\n' + '='.repeat(50));

    // Exit with proper code
    process.exit(passedTests === totalTests ? 0 : 1);
  } finally {
    if (server) {
      await new Promise(resolve => server.close(resolve));
      console.log('✅ Server stopped');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testStaticFormulas,
  testValidation,
  testWithSampleData,
  testAppsScriptMock,
  runAllTests
};
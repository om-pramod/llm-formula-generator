const { spawn } = require('child_process');

// Generate formula using Ollama
async function generateFormulaWithLLM(range, description, sampleData) {
  const isLlmEnabled = process.env.OLLAMA_ENABLED !== 'false' && process.env.NODE_ENV !== 'test';
  if (!isLlmEnabled) {
    return Promise.reject(new Error('Ollama is disabled'));
  }

  const model = process.env.OLLAMA_MODEL || 'phi3:mini';
  const timeoutMs = parseInt(process.env.OLLAMA_TIMEOUT, 10) || 8000;

  return new Promise((resolve, reject) => {
    const prompt = createPrompt(range, description, sampleData);

    // Call Ollama via command line
    const ollama = spawn('ollama', ['run', model, prompt]);

    let output = '';
    let errorOutput = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    const timeout = setTimeout(() => {
      ollama.kill();
      reject(new Error('LLM timeout'));
    }, timeoutMs);

    ollama.on('close', (code) => {
      clearTimeout(timeout);

      if (code !== 0) {
        reject(new Error(`Ollama failed: ${errorOutput}`));
        return;
      }

      const formula = extractFormula(output);
      if (!formula) {
        reject(new Error('No formula extracted from LLM response'));
        return;
      }

      resolve(formula);
    });

    ollama.on('error', (error) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start Ollama: ${error.message}`));
    });
  });
}

/**
 * Create a prompt for the LLM to generate a formula
 */
function createPrompt(range, description, sampleData) {
  const sampleDataText = sampleData && sampleData.length > 0
    ? `Sample data: ${JSON.stringify(sampleData.slice(0, 5))}`
    : '';

  return `You are a Google Sheets expert. Create a formula for this task.

Task: ${description}
Range: ${range}
${sampleDataText}

Rules:
1. Return ONLY the formula starting with =
2. Use standard Google Sheets functions (SUM, AVERAGE, INDEX, etc.)
3. Reference the range: ${range}
4. No explanations, just the formula

Examples:
CAGR: =POWER(INDEX(A2:A10,ROWS(A2:A10))/INDEX(A2:A10,1),1/(ROWS(A2:A10)-1))-1
Sum: =SUM(A2:A10)
Average without zeros: =AVERAGEIF(A2:A10,"<>0")

Formula:`;
}

/**
 * Extract formula from LLM output
 */
function extractFormula(llmOutput) {
  // Find formula in LLM output
  const lines = llmOutput.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('=') && trimmed.length > 3) {
      // Clean up the formula
      return trimmed;
    }
  }

  // Try to find any line with formula-like content
  for (const line of lines) {
    if (line.includes('=') && (line.includes('SUM') || line.includes('AVERAGE') || line.includes('INDEX'))) {
      let formula = line.substring(line.indexOf('='));
      formula = formula.split(' ')[0]; // Take first part
      return formula;
    }
  }

  return null;
}

function checkLlmAvailability() {
  return new Promise((resolve) => {
    const testOllama = spawn('ollama', ['--version']);
    testOllama.on('close', (code) => {
      if (code === 0) {
        console.log(`🤖 Ollama is available`);
        resolve(true);
      } else {
        console.log(`⚠️  Ollama not found - install with: curl -fsSL https://ollama.ai/install.sh | sh`);
        resolve(false);
      }
    });
    testOllama.on('error', () => {
      console.log(`⚠️  Ollama not found - install with: curl -fsSL https://ollama.ai/install.sh | sh`);
      resolve(false);
    });
  });
}

module.exports = {
  generateFormulaWithLLM,
  createPrompt,
  extractFormula,
  checkLlmAvailability,
};

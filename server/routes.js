const express = require('express');
const { getStaticFormula, validateFormula } = require('./formulas');
const { generateFormulaWithLLM } = require('./llm'); // This file doesn't exist yet, I'll create it.

const router = express.Router();

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clean expired cache entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiry) {
      cache.delete(key);
    }
  }
}, 60000);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache_size: cache.size
  });
});

// Formula generation endpoint
router.post('/api/generate-formula', async (req, res) => {
  try {
    const { range, description, sampleData } = req.body;

    // Validate inputs
    if (!range || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: range and description'
      });
    }

    // Check cache first
    const cacheKey = `${range}|${description.toLowerCase()}`;
    if (cache.has(cacheKey)) {
      const cachedResult = cache.get(cacheKey);
      return res.json({
        ...cachedResult.data,
        source: 'cache'
      });
    }

    // Try to generate formula with LLM
    try {
      const formula = await generateFormulaWithLLM(range, description, sampleData);

      // Validate formula
      if (validateFormula(formula)) {
        // Cache the result
        cache.set(cacheKey, {
          data: {
            success: true,
            formula,
            range,
            description,
            source: 'generated'
          },
          expiry: Date.now() + CACHE_TTL
        });

        return res.json({
          success: true,
          formula,
          range,
          description,
          source: 'generated'
        });
      } else {
        // Fall back to static formula if validation fails
        throw new Error('Generated formula failed validation');
      }
    } catch (error) {
      // If LLM generation fails, use static formula
      const fallbackFormula = getStaticFormula(description, range);

      // Cache the fallback result too
      cache.set(cacheKey, {
        data: {
          success: true,
          formula: fallbackFormula,
          range,
          description,
          source: 'fallback',
          error: error.message || 'LLM generation failed'
        },
        expiry: Date.now() + CACHE_TTL
      });

      return res.json({
        success: true,
        formula: fallbackFormula,
        range,
        description,
        source: 'fallback',
        error: error.message || 'LLM generation failed'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;

/**
 * LLM Formula Generator Server
 * Main entry point for the server application.
 */

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { checkLlmAvailability } = require('./llm');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/', apiRoutes);

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ LLM Formula Generator server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔥 API endpoint: http://localhost:${PORT}/api/generate-formula`);
    
    // Check for LLM availability if enabled
    if (process.env.OLLAMA_ENABLED !== 'false') {
      checkLlmAvailability();
    }
  });
}

module.exports = app;
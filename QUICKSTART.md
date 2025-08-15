# Quick Setup Guide

This guide will help you set up the LLM Formula Generator in under 5 minutes.

## GitHub Codespaces Setup (Recommended)

1. **Fork the Repository:**
   - Visit https://github.com/om-pramod/llm-formula-generator
   - Click the "Fork" button in the top right
   - Wait for GitHub to create your copy of the repository

2. **Create Codespace:**
   - Go to your forked repo
   - Click "Code" → "Codespaces" → "Create codespace on main"

3. **Setup in Codespace:**
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull model (one-time, ~2.3GB)
   ollama pull phi3:mini
   
   # Start server
   npm start
   ```

4. **Copy your Codespace URL** (shown in terminal)

5. **Add to Google Sheets:**
   - Extensions → Apps Script
   - Paste code from `apps-script/Code.gs`
   - Update `SERVER_URL` with your Codespace URL
   - Save & authorize

6. **Test:**
   ```
   =LLMFORMULA(A2:A5, "CAGR")
   ```

## Alternative Setup Options

### Local Development with ngrok
```bash
# Clone your forked repository
git clone https://github.com/YOUR_USERNAME/llm-formula-generator.git
cd llm-formula-generator

# Install Ollama locally
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull phi3:mini

# Run server
npm install
npm start

# Expose with ngrok (for Google Sheets)
npx ngrok http 3000
```

### Railway.app Free Tier
1. Connect your forked GitHub repo to Railway
2. Deploy automatically
3. Use the generated URL in your Google Sheets

## Troubleshooting

**Codespace sleeps after 30min idle:**
- Functions will use fallback formulas
- Wake up by visiting the URL

**Model too slow:**
- Use smaller model: `ollama pull qwen2:0.5b`
- Add more fallback patterns

**API errors:**
- Check Apps Script logs in Google Sheets
- Verify server URL is correct
- Test health endpoint: `curl http://localhost:3000/health`

---
Last updated: 2025-08-14 21:33:20  
Author: [om-pramod](https://github.com/om-pramod)

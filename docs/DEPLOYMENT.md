# Deployment Guide - 100% Free LLM Formula Generator

This guide shows you how to deploy the project using completely free resources.

## Option 1: GitHub Codespaces (Recommended)

**Why this option:** 60 hours/month free, always accessible, automatic HTTPS.

### Step 1: Push to GitHub

```bash
# Initialize git repository
cd llm-formula-generator
git init
git add .
git commit -m "Initial commit: Free LLM Formula Generator"

# Create GitHub repo and push
gh repo create llm-formula-generator --public --push
# OR manually create repo on github.com and push
```

### Step 2: Create Codespace

1. Go to your GitHub repository
2. Click green "Code" button → "Codespaces" → "Create codespace on main"
3. Wait for environment to load (2-3 minutes)

### Step 3: Setup in Codespace

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull small model (phi3:mini is 2.3GB)
ollama pull phi3:mini

# Install dependencies and start server
cd server
npm install
npm start
```

### Step 4: Get Your URL

In Codespace terminal, you'll see:
```
✅ LLM Formula Generator running on port 3000
🔥 Your URL: https://fuzzy-space-disco-abc123-3000.app.github.dev
```

Copy this URL for the Apps Script configuration.

### Step 5: Configure Apps Script

1. Open Google Sheets
2. Extensions → Apps Script
3. Replace default code with contents of `apps-script/Code.gs`
4. Update line 11: `const SERVER_URL = 'YOUR_CODESPACE_URL';`
5. Save and authorize the script

### Step 6: Test

In Google Sheets:
```
=LLMFORMULA(A2:A5, "CAGR")
=LLMFORMULA(B1:B10, "sum excluding zeros")
```

---

## Option 2: Local Development

**Why this option:** Unlimited usage, fastest response, complete control.

### Step 1: Install Ollama

**MacOS/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
1. Download from [ollama.ai](https://ollama.ai/download)
2. Run installer
3. Open Command Prompt

### Step 2: Setup Model

```bash
# Pull lightweight model (2.3GB)
ollama pull phi3:mini

# Verify installation
ollama list
```

### Step 3: Start Server

```bash
cd llm-formula-generator/server
npm install
npm start
```

Server runs on `http://localhost:3000`

### Step 4: Expose to Internet (for Sheets)

**Using ngrok (free):**
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000
```

Copy the HTTPS URL for Apps Script.

**Using serveo (free, no signup):**
```bash
ssh -R 80:localhost:3000 serveo.net
```

---

## Option 3: Railway.app (Free Tier)

**Why this option:** Always on, no sleep, 512MB RAM free.

### Step 1: Prepare for Railway

Create `railway.toml`:
```toml
[build]
builder = "nixpacks"
buildCommand = "npm install"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300

[env]
NODE_ENV = "production"
PORT = "3000"
```

### Step 2: Deploy

1. Connect GitHub repo to Railway.app
2. Deploy automatically triggers
3. Get your app URL from Railway dashboard

**Note:** Railway free tier has limitations, may need fallback patterns.

---

## Option 4: Replit (Free)

### Step 1: Import Project

1. Go to replit.com
2. Create new Repl → "Import from GitHub"
3. Enter your repo URL

### Step 2: Configure

Replit auto-detects Node.js. Add to `replit.nix`:
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.curl
  ];
}
```

### Step 3: Install Ollama

In Replit shell:
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Add to PATH
export PATH=$PATH:/home/runner/.ollama/bin

# Pull model
ollama pull phi3:mini
```

### Step 4: Auto-start

Create `.replit` file:
```toml
run = "cd server && npm start"

[nix]
channel = "stable-22_11"

[deployment]
run = ["sh", "-c", "cd server && npm start"]
```

---

## Troubleshooting

### Common Issues

**1. Codespace goes to sleep:**
- Solution: Use fallback formulas automatically
- Prevention: Keep browser tab open, or use paid plan

**2. Ollama model not found:**
```bash
ollama list  # Check installed models
ollama pull phi3:mini  # Reinstall if needed
```

**3. Apps Script CORS errors:**
- Ensure server has CORS enabled (included in code)
- Check URL format: `https://` required

**4. Formula errors in Sheets:**
- Check Apps Script logs: Extensions → Apps Script → Executions
- Test with simple descriptions first

### Performance Tips

**Reduce latency:**
1. Use shorter model names in prompts
2. Enable caching (included)
3. Use fallback patterns for common formulas

**Optimize Ollama:**
```bash
# Use smaller model for speed
ollama pull phi3:mini

# Or even smaller (1.7GB)
ollama pull phi3:mini-4k
```

### Cost Monitoring

**GitHub Codespaces:**
- 60 hours/month free
- Check usage: Settings → Billing → Codespaces

**All options are designed to be completely free forever.**

---

## Production Considerations

### Security
- Server has built-in validation for dangerous functions
- Apps Script runs in Google's sandbox
- No sensitive data stored

### Reliability
- Multiple fallback layers
- Graceful degradation
- Client-side caching

### Scaling
- Add more formula patterns to `server/formulas.js`
- Use faster models for paid tiers later
- Consider dedicated server for high usage

### Monitoring
- Health endpoint: `/health`
- Built-in cache statistics
- Error logging to console

---

## Next Steps

1. **Start with Codespaces** - easiest setup
2. **Test basic formulas** - CAGR, sum, average
3. **Add custom patterns** - edit `server/formulas.js`
4. **Monitor usage** - check Codespace hours
5. **Scale up** - move to dedicated server when needed

Remember: This entire stack costs $0 forever with the free tier approach!
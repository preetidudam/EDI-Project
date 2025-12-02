# 🚀 GitHub Setup Guide

## Your Repository
Your project is already connected to GitHub:
- **Repository URL**: https://github.com/preetidudam/EDI-Project.git
- **Current Branch**: main

## 📋 Step-by-Step: Push Your Changes to GitHub

### Step 1: Check Current Status
```bash
git status
```

### Step 2: Add All Changes
```bash
# Add all modified files
git add .

# Or add specific files
git add PROJECT_EXPLANATION.md
git add frontend/src/hooks/useDeviceRegistry.js
git add .gitignore
```

### Step 3: Commit Your Changes
```bash
git commit -m "Fix frontend issues and add comprehensive documentation

- Fixed MetaMask connection and button functionality
- Fixed event parsing for ethers v6 compatibility
- Improved account change handling
- Added comprehensive technical documentation for research papers
- Updated .gitignore to exclude .env files
- Enhanced error handling throughout the application"
```

### Step 4: Push to GitHub
```bash
git push origin main
```

If you encounter authentication issues, you may need to:
- Use a Personal Access Token (PAT) instead of password
- Set up SSH keys
- Use GitHub CLI

---

## 🔐 Important: Before Pushing

### ✅ Files That Should NOT Be Committed

Make sure these are in `.gitignore`:
- `.env` files (contains sensitive contract addresses)
- `node_modules/` (dependencies)
- `artifacts/` and `cache/` (build files)
- `frontend/.env` (frontend environment variables)
- `*.log` files

### ✅ Files That SHOULD Be Committed

- Source code (`.sol`, `.js`, `.jsx` files)
- Configuration files (`package.json`, `hardhat.config.js`)
- Documentation (`.md` files)
- ABI files (`frontend/src/abi/DeviceRegistry.json`)
- `.gitignore` itself

---

## 🆕 First Time Setup (If Starting Fresh)

### 1. Initialize Git (if not already done)
```bash
git init
```

### 2. Create .gitignore
```bash
# Make sure .gitignore includes:
node_modules
artifacts
cache
frontend/node_modules
frontend/build
.env
frontend/.env
.DS_Store
*.log
```

### 3. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `EDI-Project`
3. Description: "Decentralized IoT Device Identity Registry (DID-IoT) on Ethereum"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (you already have these)
6. Click "Create repository"

### 4. Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/EDI-Project.git
```

### 5. Add, Commit, and Push
```bash
git add .
git commit -m "Initial commit: DID-IoT Device Registry"
git branch -M main
git push -u origin main
```

---

## 🔄 Regular Workflow

### Daily Development Workflow

1. **Make changes** to your code
2. **Check status**: `git status`
3. **Add changes**: `git add .`
4. **Commit**: `git commit -m "Description of changes"`
5. **Push**: `git push origin main`

### Example Commit Messages

```bash
# Feature addition
git commit -m "Add device transfer functionality"

# Bug fix
git commit -m "Fix MetaMask connection error handling"

# Documentation
git commit -m "Update README with deployment instructions"

# Multiple changes
git commit -m "Fix frontend issues and improve error handling

- Fixed button click handlers
- Improved MetaMask connection flow
- Added comprehensive error messages"
```

---

## 🛠️ Troubleshooting

### Authentication Issues

**Problem**: `remote: Support for password authentication was removed`

**Solution**: Use Personal Access Token (PAT)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

### Merge Conflicts

**Problem**: `error: failed to push some refs`

**Solution**: Pull first, then push
```bash
git pull origin main
# Resolve any conflicts
git push origin main
```

### Large Files

**Problem**: File too large for GitHub

**Solution**: Use Git LFS or exclude large files
```bash
# Install Git LFS
git lfs install
git lfs track "*.largefile"
```

---

## 📝 Recommended Repository Settings

### 1. Add Repository Description
- Go to repository → Settings → General
- Add description: "Decentralized IoT Device Identity Registry (DID-IoT) built on Ethereum"

### 2. Add Topics/Tags
- Go to repository main page
- Click ⚙️ next to "About"
- Add topics: `blockchain`, `ethereum`, `iot`, `smart-contracts`, `web3`, `solidity`, `react`, `decentralized-identity`

### 3. Add README Badges (Optional)
Add to your README.md:
```markdown
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.15.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)
```

### 4. Add License File
Create `LICENSE` file with MIT license (or your preferred license)

---

## 🎯 Quick Commands Reference

```bash
# Check status
git status

# See what changed
git diff

# Add all changes
git add .

# Commit with message
git commit -m "Your message here"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# See remote repository
git remote -v
```

---

## ✅ Checklist Before Pushing

- [ ] All `.env` files are in `.gitignore`
- [ ] `node_modules` is excluded
- [ ] No sensitive data (private keys, API keys) in code
- [ ] All changes are tested locally
- [ ] Commit message is descriptive
- [ ] Documentation is up to date

---

**Your repository is ready! Just commit and push your changes.** 🚀


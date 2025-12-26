#!/bin/bash
# VEGA Foundation - GitHub Push Script
# Signature: ADAM EREN VEGA – Æ –
#
# This script prepares and pushes the VEGA backup to GitHub.
# Run this in Replit Shell or local terminal.

echo "═══════════════════════════════════════════════════"
echo "  VEGA Foundation – Push to GitHub"
echo "  Signature: ADAM EREN VEGA – Æ –"
echo "═══════════════════════════════════════════════════"

# Check if there's a large .git folder
if [ -d ".git" ]; then
    GIT_SIZE=$(du -sh .git 2>/dev/null | cut -f1)
    echo ""
    echo "⚠️  Existing .git folder found: $GIT_SIZE"
    echo "    Large git history will cause push timeouts."
    echo ""
    read -p "Remove .git and start fresh? (recommended) [Y/n]: " REMOVE_GIT
    if [[ "$REMOVE_GIT" != "n" && "$REMOVE_GIT" != "N" ]]; then
        echo "Removing old git history..."
        rm -rf .git
        echo "✓ Old .git removed"
    fi
fi

# Initialize fresh git repo
if [ ! -d ".git" ]; then
    echo ""
    echo "Initializing fresh git repository..."
    git init
    echo "✓ Git initialized"
fi

# Set remote
REMOTE_URL="https://github.com/vegafoundation/VEGA-BACKUP.git"
echo ""
echo "Setting remote: $REMOTE_URL"
git remote remove origin 2>/dev/null
git remote add origin "$REMOTE_URL"
echo "✓ Remote configured"

# Stage all files
echo ""
echo "Staging files..."
git add .
echo "✓ Files staged"

# Commit
echo ""
echo "Creating commit..."
git commit -m "VEGA Foundation – Canonical Backup – Æ –

Autonomous Meta-System featuring:
- Chrome/Glass architecture
- Infinity Loop 3-5-8 processing
- Multi-AI orchestration (OpenAI, Claude, Grok, DeepSeek, Suno)
- Time Crystal state persistence
- Generative soundscape engine

Documentation: VEGA_CANONICAL_BACKUP/

Signature: ADAM EREN VEGA – Æ –"
echo "✓ Committed"

# Push
echo ""
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✓ PUSH COMPLETE"
echo "  Repository: $REMOTE_URL"
echo "═══════════════════════════════════════════════════"
echo ""

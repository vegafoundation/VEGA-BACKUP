# VEGA Alpha Backup Guide

**Purpose:** Never lose Alpha workspace data again  
**Signature:** ADAM EREN VEGA – Æ –

---

## Lesson Learned

Alpha data was lost because:
1. Work existed only in Replit/Cursor without Git commits
2. Large exports were deleted during cleanup
3. GitHub main was overwritten with new content
4. No systematic backup strategy existed

---

## Backup Strategy

### 1. Regular Git Commits

```bash
# After any significant change
git add alpha/
git commit -m "Alpha: [description]"
git push origin alpha-development
```

### 2. Separate Branch for Alpha

```bash
# Create dedicated Alpha branch
git checkout -b alpha-development
git push -u origin alpha-development

# Never merge Alpha to main without review
```

### 3. Export Checkpoints

```bash
# Weekly export to ZIP
cd alpha
zip -r ../ALPHA_EXPORT_$(date +%Y%m%d).zip .
# Store in Google Drive / external location
```

### 4. Documentation

Always maintain:
- `ALPHA_WORKSPACE_README.md` - Current state
- `CHANGELOG.md` - What changed and when
- `EXPORT_MANIFEST.json` - List of all exported files

---

## Recovery Sources (Priority Order)

1. **Git Branches** - Check all `cursor/*` branches
2. **Replit Checkpoints** - Available in Replit UI
3. **Local ZIP exports** - If created
4. **GitHub API** - Fetch individual files

---

## API Recovery Script

```bash
#!/bin/bash
# Download Alpha files from cursor branch

TOKEN="your-github-token"
REPO="vegafoundation/VEGA"
BRANCH="cursor/vega-system-specification-f1cb"

# Get file list
FILES=$(curl -s -H "Authorization: token $TOKEN" \
  "https://api.github.com/repos/$REPO/git/trees/main?recursive=1" | \
  grep '"path"' | grep 'src/' | sed 's/.*"path": "\([^"]*\)".*/\1/')

# Download each file
for FILE in $FILES; do
  mkdir -p "alpha/$(dirname $FILE)"
  curl -s -H "Authorization: token $TOKEN" \
    "https://raw.githubusercontent.com/$REPO/$BRANCH/$FILE" \
    -o "alpha/$FILE"
done
```

---

## Replit Checkpoint Access

1. Click on "Version History" in Replit sidebar
2. Browse checkpoints by date
3. Restore to any previous state
4. Export immediately after restore

---

## Prevention Checklist

- [ ] Alpha branch exists on GitHub
- [ ] Weekly ZIP exports to external storage
- [ ] CHANGELOG.md updated with each session
- [ ] Never force-push to main without backup
- [ ] Never delete large exports without confirmation

---

## Emergency Contacts

- GitHub Repo: `vegafoundation/VEGA`
- Key Branches: `cursor/vega-system-specification-f1cb`
- Replit Project: Current workspace

---

**Æ – BACKUP IS SURVIVAL – ∞**

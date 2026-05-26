# Elimination Mode — Status & Completion Map

**Generated:** 2026-05-25 (resumed from prior session)
**Branch:** master (NOT yet committed to `elimination-mode` branch as Bill's standing rule prescribes)
**Upstream:** https://github.com/MattSurabian/DuckHunt-JS.git (unchanged remote)

---

## 1. Current State — what is DONE

### Code changes (all uncommitted, working tree)
| File | Change | Lines |
|---|---|---|
| `main.js` | Setup screen wiring, name parsing, localStorage persistence, classic-mode toggle | +146 |
| `dist/index.html` | New setup-screen DOM + CSS + elimination side panel | +281 |
| `src/modules/Game.js` | `mode`/`names`/`survivorPool` state, `eliminationWin()`, hit reconciliation | +110 |
| `src/modules/Stage.js` | `addDucks(n, speed, assignedNames[])`, `eliminatedHits[]` in hit results | +39 |
| `src/modules/Duck.js` | `assignedName` property on Duck instances | +2 |
| `src/modules/EliminationUI.js` | **NEW** — side panel, reveal toast, victory screen | +103 |

**Total:** ~569 lines added, ~16 removed. Original DuckHunt classic mode preserved via setup-screen "Play Classic" path.

### Build status
- `npx webpack` → compiles clean (3 size-only warnings, no errors)
- `dist/duckhunt.js` is 650 KiB (rebuilt 2026-05-25 23:54)
- Compiled bundle contains the elimination module (verified via grep)

### Dev server status
- **Running now:** `webpack-dev-server` on port **8088** (background process)
- Smoke-tested endpoints all return 200:
  - `http://localhost:8088/` (index, 7.7KB)
  - `http://localhost:8088/duckhunt.js` (665KB)
  - `http://localhost:8088/sprites.json` (11KB)
- Log: `/tmp/dh-devserver.log` — only size warnings, no compile errors

### Game design implemented (matches Bill's 3 choices)
1. ✅ Top-level dir `/home/aiuser/projects/duckhunt-elimination/`
2. ✅ Paste textarea on start screen, one name per line, min 3
3. ✅ Names HIDDEN during flight, revealed when shot, last duck = winner

### Tradeoff decision made by prior run
- **Missed ducks = SURVIVE the round** (stay in pool). Game cycles waves until exactly 1 name remains. This may or may not match Bill's intent — flag for review.

---

## 2. What is NOT done

| Item | Status | Why |
|---|---|---|
| **Browser smoke test** | ❌ NOT VERIFIED | This container has no Playwright tool loaded. Bill must visual-test in browser. |
| **Git commit** | ❌ Not committed | Working tree dirty. Spec says: branch `elimination-mode` + single commit. |
| **README update** | ⚠️ Unverified | Spec said to prepend elimination section — needs check. |
| **Eslint pass** | ⚠️ Warnings only | TypeScript-style lodash declaration warnings (pre-existing, not our code). |
| **GitHub push** | ❌ FORBIDDEN until morning | Per Bill's standing rule — he pushes himself. |

---

## 3. Map to "Done" — exact next steps

### Step A: Manual browser verification (BILL DOES THIS, ~5 min)
Dev server is already up. Open:
```
http://localhost:8088/
```
Verify:
1. Setup screen loads with textarea + "Start Elimination" button
2. Button is disabled until 3+ names pasted (try 1, 2, then 3)
3. Click Start → ducks spawn, NO names visible on screen
4. Shoot a duck → name reveal toast appears, name added to "Eliminated" list
5. Survivors counter decrements
6. Keep playing until 1 survivor → victory screen with winner name
7. "Play Classic" path still works (no elimination wiring leaks in)

If any of those fail → fix before commit. Most likely failure points:
- DOM IDs in `dist/index.html` mismatch the selectors in `main.js` / `EliminationUI.js`
- The reveal toast positioning (`screenPos` from Stage may not be set)
- `survivorPool.length === 1` end condition firing at the wrong moment

### Step B: Check README has the elimination section
```bash
head -50 /home/aiuser/projects/duckhunt-elimination/README.md
```
If it doesn't lead with elimination mode + the 3 design choices + the "missed = survives" rule note, prepend that section before committing.

### Step C: Commit (LOCAL ONLY)
```bash
cd /home/aiuser/projects/duckhunt-elimination
git checkout -b elimination-mode
git add -A
git commit -m "Elimination mode: name-list paste, hidden until shot, last-one-standing wins"
git log --oneline -3
git status   # should be clean
```

### Step D: Bill pushes in the morning
```bash
gh repo create n3-will/duckhunt-elimination --public --source=. --remote=origin --push
```

---

## 4. Files to read if you need to debug

| Concern | File |
|---|---|
| Setup screen DOM & CSS | `dist/index.html` lines 1–280 |
| Parse-and-boot flow | `main.js` lines 40–150 |
| Survivor pool / win condition | `src/modules/Game.js` (search `survivorPool`, `eliminationWin`) |
| Duck → name assignment | `src/modules/Stage.js` `addDucks()` ~line 191 |
| Reveal toast + side panel | `src/modules/EliminationUI.js` (all 103 lines) |

---

## 5. Hard rules reminder

- ❌ NO `git push`
- ❌ NO `gh repo create`
- ❌ Do NOT change the `origin` remote (still points at MattSurabian)
- ✅ All work stays local until Bill pushes in the morning

---

## 6. Process state to clean up

The dev server is running as a background bash process. If you need to stop it:
```bash
pkill -f "webpack-dev-server --port 8088"
```
Leave it running for Bill's morning verification, then he can kill it.

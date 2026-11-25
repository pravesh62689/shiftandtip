# Shift & Tip Cleanup Inventory

Generated: 2026-11-25

## 1. Directory & Component Inventory

| Path / Target | Exists | Size (MB) | Size (GB) | Retention / Action Plan |
|---|---|---|---|---|
| `F:\shiftandtip` | Yes | 361.89 MB | 0.353 GB | Project source root; push to private GitHub repo `pravesh62689/shiftandtip` |
| `F:\shiftandtip\node_modules` | Yes | 281.65 MB | 0.275 GB | Safe cleanup: delete locally; rebuilt via `npm ci` |
| `F:\shiftandtip\dist` | Yes | 1.79 MB | 0.002 GB | Safe cleanup: delete locally; rebuilt via `npm run build` |
| `F:\shiftandtip\reports` | Yes | 14.27 MB | 0.014 GB | Retain top-level markdown summaries; purge `live/`, `drafts/`, and lighthouse JSON |
| `F:\shiftandtip\reports\live` | Yes | 5.95 MB | 0.006 GB | Safe cleanup: delete screenshot caches |
| `F:\shiftandtip\reports\drafts` | Yes | 1.23 MB | 0.001 GB | Safe cleanup: delete draft run logs |
| `F:\shiftandtip\reports\lighthouse` | Yes | 4.82 MB | 0.005 GB | Safe cleanup: delete `.json` raw reports; retain `.md` summary |
| `F:\shiftandtip\backups` | Yes | 0.11 MB | 0.000 GB | **Retained**: XML theme rollbacks committed to git |
| `F:\shiftandtip\.pw-profile` | Yes | 5.50 MB | 0.005 GB | Safe cleanup: delete Playwright profile; log in again when needed |
| `F:\shiftandtip\secrets` | Yes | 0.001 MB | 0.000 GB | **Protected**: Excluded from git; migrated to GitHub Repo Secrets & 7-Zip encrypted backup |
| `F:\shiftandtip-assets` | Yes | 1.19 MB | 0.001 GB | Hosted on GitHub at `pravesh62689/shiftandtip-assets` |
| `F:\filebrik` | No | 0.00 MB | 0.000 GB | Not present on disk; skipped |
| `%LOCALAPPDATA%\ms-playwright` | Yes | 2,341.71 MB | 2.287 GB | Safe cleanup: delete cached Playwright browser binaries; reinstall via `npx playwright install` |
| `%LOCALAPPDATA%\npm-cache` | Yes | 2,221.70 MB | 2.170 GB | Safe cleanup: run `npm cache clean --force` |

---

## 2. Downloads Inventory

### Stitch UI Exports (`stitch_*.zip`)
- `stitch_dolphin_matrix_studio (1).zip` (367.7 KB)
- `stitch_dolphin_matrix_studio (2).zip` (6,732.7 KB)
- `stitch_dolphin_matrix_studio (3).zip` (393.4 KB)
- `stitch_dolphin_matrix_studio.zip` (677.7 KB)
- `stitch_filebrik_browser_tools_ui.zip` (1,045.2 KB)
- `stitch_shift_tip_v1 (1).zip` (222.4 KB)
- `stitch_shift_tip_v1 (2).zip` (2,134.1 KB)
- `stitch_shift_tip_v1.zip` (256.8 KB)
*Total Stitch Downloads: ~12.0 MB (All screens confirmed in `F:\shiftandtip\design\exports`).*

### Client Secrets
- `client_secret_29255626265-bpqohcolkv4gomgit4bubeapkqcb8gsc.apps.googleusercontent.com.json` (399 bytes)
*Confirmed identical to `secrets/client_secret.json`.*

---

## 3. Potential Space Savings
- **Immediate Safe Cleanup**: **~4,850 MB (~4.85 GB)**
- **Full Project Folder Removal** (after GitHub verification & approval): **~363 MB (~0.36 GB)**
- **Total Recoverable Disk Space**: **~5,213 MB (~5.21 GB)**

# ONG — Operation Name Generator

**Date**: 2026-03-22
**Status**: Draft
**Hosting**: GitHub Pages (static site, no server)

## Problem

Security professionals running forensics incident response, red team operations, and security projects need memorable, themed operation names. Currently there's no lightweight, offline-capable tool for this — people resort to ad-hoc naming or generic random generators that don't understand security culture.

## Solution

A single-page static website that generates randomized operation names using a combinatorial engine with themed word pools. Two modes: fully random and keyword-influenced. Hosted on GitHub Pages for free, zero-dependency deployment.

## Architecture

### Tech Stack
- **Pure HTML/CSS/JS** — zero build step, zero dependencies
- Single `index.html` + `style.css` + `app.js` + `data.js`
- Deployed directly to GitHub Pages from the repo root

### File Structure
```
/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles
├── js/
│   ├── data.js         # Word pools and keyword mappings
│   └── app.js          # Generation logic and UI interactions
├── favicon.ico         # Site icon
└── README.md           # Project description for GitHub
```

## Name Generation Engine

### Combinatorial Approach
Names follow the format: `"Operation " + MODIFIER + " " + NOUN`

**Modifiers** (adjectives/prefixes): ~50+ words like CRIMSON, DARK, IRON, SILENT, OBSIDIAN, FROZEN, BURNING, PHANTOM, BLACK, SHADOW, STEEL, STORM, FALLEN, ETERNAL, HOLLOW, etc.

**Nouns** organized into 14 theme categories:

| Category | Examples | Count |
|----------|----------|-------|
| Norse Mythology | ODIN, FENRIR, MJOLNIR, RAGNAROK, VALKYRIE, YGGDRASIL | ~20 |
| Greek Mythology | CERBERUS, HYDRA, TITAN, OLYMPUS, CHIMERA, PROMETHEUS | ~20 |
| Egyptian Mythology | ANUBIS, OSIRIS, SCARAB, SPHINX, HORUS, SETH | ~15 |
| Sumerian/Babylonian | TIAMAT, MARDUK, ENKI, GILGAMESH, ISHTAR | ~12 |
| Celtic Mythology | MORRIGAN, DAGDA, BANSHEE, SIDHE, AVALON | ~12 |
| Military/Tactical | VIPER, SENTINEL, BASTION, RAPTOR, SIEGE, RECON | ~20 |
| Weather/Nature | TEMPEST, AVALANCHE, TYPHOON, ECLIPSE, INFERNO | ~15 |
| Celestial | NEBULA, PULSAR, NOVA, VOID, QUASAR, AURORA | ~15 |
| Cryptography/Cyber | CIPHER, ENIGMA, ZERO-DAY, ROOTKIT, VECTOR | ~15 |
| Historical Battles | THERMOPYLAE, HASTINGS, STALINGRAD, VERDUN | ~15 |
| Chess | GAMBIT, ZUGZWANG, ENDGAME, CASTLING, CHECKMATE | ~10 |
| Elements/Metals | COBALT, TITANIUM, OBSIDIAN, MERCURY, TUNGSTEN | ~15 |
| Legendary Weapons | EXCALIBUR, GUNGNIR, KUSANAGI, DURANDAL | ~12 |
| Predator Animals | WOLF, HAWK, COBRA, PANTHER, KRAKEN | ~15 |

**Total**: ~50 modifiers × ~200 nouns = ~10,000 unique combinations

### Generation Algorithm
```
function generateName(themes, count):
    results = Set()  // deduplicate within a batch
    availableNouns = themes == ALL ? allNouns : nouns.filter(themes)
    while results.size < count:
        modifier = random(modifiers)
        noun = random(availableNouns)
        results.add("Operation " + modifier + " " + noun)
    return Array.from(results)
```

### Keyword Mode
A mapping table associates input keywords with relevant theme categories:

```javascript
keywordMap = {
    "bank": ["elements_metals", "military", "chess"],
    "hospital": ["greek", "nature", "elements_metals"],
    "energy": ["celestial", "weather", "norse"],
    "tech": ["crypto_cyber", "celestial", "chess"],
    "government": ["military", "historical", "norse"],
    // ... ~50 keyword mappings
}
```

For unknown keywords, the system uses simple `String.includes()` substring matching against the keyword map keys. If no match is found, it falls back to random mode across all themes.

## UI Design

### Visual Style
- **Modern dark tactical** aesthetic
- Background: `#0d1117` (GitHub dark)
- Cards: `#161b22` with `#30363d` borders
- Primary accent: `#ff6b35` (tactical orange)
- Text: `#e6edf3` (primary), `#8b949e` (secondary)
- Font: System sans-serif stack, monospace for operation names
- Sharp edges, subtle glow effects on hover

### Layout: Centered Single Column
All content centered, max-width ~800px:

1. **Header** — "ONG" title with "OPERATION NAME GENERATOR" subtitle, tactical styling
2. **Mode Toggle** — Random / Keyword switch. Keyword mode reveals a text input
3. **Theme Filters** — Horizontal pill/chip buttons, multi-select. "ALL" selected by default
4. **Output Mode Toggle** — Batch (grid, default) / Spotlight (single dramatic reveal)
5. **Generate Button** — Large, prominent, orange accent
6. **Results Area**:
   - **Batch mode**: 2-column grid of name cards (theme tag, "OPERATION" label, name, copy button)
   - **Spotlight mode**: Single large name with subtle entrance animation + re-roll button
7. **History Section** — Collapsible "Recent" section, last ~20 individual names (not events), persisted in localStorage

### Interactions
- **Copy to clipboard**: Click copy button → brief "Copied!" toast/feedback
- **Theme filter**: Click to toggle, multiple selections allowed, "ALL" deselects others
- **Generate**: Produces 6 names (batch) or 1 name (spotlight)
- **Re-roll** (spotlight): Generates a new single name with animation
- **History**: Auto-saves generated names, collapsible section at bottom

### Responsive Design
- Single column naturally works on mobile
- Theme pills wrap on narrow screens
- Batch grid collapses to single column on mobile
- Touch-friendly button sizes

## GitHub Pages Deployment

- Repository name: user's choice (e.g., `ONG` or `operation-name-generator`)
- Deploy from root `/` of `main` branch
- No build step needed — just push and it's live
- Custom domain optional (via CNAME file)
- Add `.superpowers/` to `.gitignore`

## Verification

1. Open `index.html` locally in a browser
2. Test random mode: click Generate, verify 6 unique names appear
3. Test keyword mode: type "bank", verify names skew toward metals/tactical/chess themes
4. Test theme filters: select only "Norse", verify all names use Norse nouns
5. Test spotlight mode: verify single name with animation, re-roll works
6. Test copy: click copy button, paste elsewhere, verify correct text
7. Test history: generate names, scroll to history, verify they appear
8. Test mobile: resize browser to 375px width, verify responsive layout
9. Test GitHub Pages: push to repo, enable Pages, verify site loads at `<user>.github.io/<repo>`

// ONG — Operation Name Generator: Application Logic

(function () {
  "use strict";

  // --- State ---
  let currentMode = "random";       // "random" | "keyword"
  let outputMode = "batch";         // "batch" | "spotlight"
  let selectedCategories = new Set();   // empty = all themes

  // --- Utility ---
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getAllThemeIds() {
    return Object.keys(NOUNS);
  }

  function resolveCategories(categoryIds) {
    var themes = [];
    for (var i = 0; i < categoryIds.length; i++) {
      var cat = CATEGORIES[categoryIds[i]];
      if (cat) {
        for (var j = 0; j < cat.themes.length; j++) {
          themes.push(cat.themes[j]);
        }
      }
    }
    return themes;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [key, val] of Object.entries(attrs)) {
        if (key === "className") node.className = val;
        else if (key === "textContent") node.textContent = val;
        else if (key.startsWith("data-")) node.setAttribute(key, val);
        else node[key] = val;
      }
    }
    if (children) {
      for (const child of Array.isArray(children) ? children : [children]) {
        if (typeof child === "string") node.appendChild(document.createTextNode(child));
        else if (child) node.appendChild(child);
      }
    }
    return node;
  }

  // --- Generation ---
  function generateNames(themes, count) {
    const themeIds = themes.length > 0 ? themes : getAllThemeIds();
    const pool = [];
    for (const id of themeIds) {
      if (NOUNS[id]) {
        for (const noun of NOUNS[id]) {
          pool.push({ noun, theme: id });
        }
      }
    }
    if (pool.length === 0) return [];

    const results = [];
    const seen = new Set();
    const maxAttempts = count * 20;
    let attempts = 0;

    while (results.length < count && attempts < maxAttempts) {
      const entry = pick(pool);
      const name = Math.random() > 0.3
        ? "Operation " + pick(MODIFIERS) + " " + entry.noun
        : "Operation " + entry.noun;
      if (!seen.has(name)) {
        seen.add(name);
        results.push({
          name: name,
          theme: entry.theme,
          themeName: THEME_META[entry.theme].name,
          themeIcon: THEME_META[entry.theme].icon
        });
      }
      attempts++;
    }
    return results;
  }

  function generateFromKeyword(keyword, count) {
    const lower = keyword.toLowerCase().trim();
    if (!lower) return generateNames([], count);

    // Direct match
    if (KEYWORD_MAP[lower]) {
      return generateNames(KEYWORD_MAP[lower], count);
    }

    // Substring match
    for (const key of Object.keys(KEYWORD_MAP)) {
      if (lower.includes(key) || key.includes(lower)) {
        return generateNames(KEYWORD_MAP[key], count);
      }
    }

    // Fallback: all themes
    return generateNames([], count);
  }

  // --- History ---
  const HISTORY_KEY = "ong_history";
  const MAX_HISTORY = 20;

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveToHistory(names) {
    const history = loadHistory();
    for (const item of names) {
      history.unshift(item.name);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }

  // --- Clipboard ---
  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(function () {
      var original = btn.textContent;
      btn.textContent = "COPIED!";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1500);
    });
  }

  // --- Rendering ---
  function makeCopyBtn(name) {
    const btn = el("button", { className: "copy-btn", textContent: "COPY" });
    btn.addEventListener("click", function () {
      copyToClipboard(name, btn);
    });
    return btn;
  }

  function renderBatch(names) {
    const container = document.getElementById("results");
    container.textContent = "";
    container.className = "results-grid";

    for (const item of names) {
      const displayName = item.name.replace("Operation ", "");
      const card = el("div", { className: "name-card" }, [
        el("div", { className: "card-theme", textContent: item.themeIcon + " " + item.themeName }),
        el("div", { className: "card-label", textContent: "OPERATION" }),
        el("div", { className: "card-name", textContent: displayName }),
        makeCopyBtn(item.name)
      ]);
      container.appendChild(card);
    }
  }

  function renderSpotlight(item) {
    const container = document.getElementById("results");
    container.textContent = "";
    container.className = "results-spotlight";

    const displayName = item.name.replace("Operation ", "");
    const copyBtn = makeCopyBtn(item.name);
    copyBtn.classList.add("spotlight-copy");

    const rerollBtn = el("button", { className: "reroll-btn", textContent: "RE-ROLL" });
    rerollBtn.addEventListener("click", doGenerate);

    const card = el("div", { className: "spotlight-card" }, [
      el("div", { className: "spotlight-theme", textContent: item.themeIcon + " " + item.themeName }),
      el("div", { className: "spotlight-label", textContent: "OPERATION" }),
      el("div", { className: "spotlight-name", textContent: displayName }),
      el("div", { className: "spotlight-actions" }, [copyBtn, rerollBtn])
    ]);
    container.appendChild(card);

    requestAnimationFrame(function () { card.classList.add("revealed"); });
  }

  function renderHistory() {
    const history = loadHistory();
    const section = document.getElementById("historySection");
    var list = document.getElementById("historyList");

    if (history.length === 0) {
      section.classList.add("hidden");
      return;
    }

    section.classList.remove("hidden");
    list.textContent = "";

    for (const name of history) {
      const row = el("div", { className: "history-item" }, [
        el("span", { className: "history-name", textContent: name }),
        makeCopyBtn(name)
      ]);
      row.querySelector(".copy-btn").classList.add("copy-sm");
      list.appendChild(row);
    }
  }

  // --- Core Action ---
  function doGenerate() {
    const categories = Array.from(selectedCategories);
    const themes = categories.length > 0 ? resolveCategories(categories) : [];
    const count = outputMode === "batch" ? 6 : 1;
    var names;

    if (currentMode === "keyword") {
      var keyword = document.getElementById("keywordInput").value;
      names = generateFromKeyword(keyword, count);
    } else {
      names = generateNames(themes, count);
    }

    if (names.length === 0) return;

    if (outputMode === "batch") {
      renderBatch(names);
    } else {
      renderSpotlight(names[0]);
    }

    saveToHistory(names);
    renderHistory();
  }

  // --- UI Wiring ---
  function init() {
    // Mode toggle
    document.querySelectorAll(".mode-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".mode-btn").forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
        currentMode = this.dataset.mode;
        document.getElementById("keywordGroup").classList.toggle("hidden", currentMode !== "keyword");
      });
    });

    // Output mode toggle
    document.querySelectorAll(".output-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".output-btn").forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
        outputMode = this.dataset.output;
      });
    });

    // Theme filters
    document.querySelectorAll(".theme-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        var theme = this.dataset.theme;
        if (theme === "all") {
          selectedCategories.clear();
          document.querySelectorAll(".theme-pill").forEach(function (p) { p.classList.remove("active"); });
          this.classList.add("active");
        } else {
          document.querySelector('.theme-pill[data-theme="all"]').classList.remove("active");
          if (selectedCategories.has(theme)) {
            selectedCategories.delete(theme);
            this.classList.remove("active");
          } else {
            selectedCategories.add(theme);
            this.classList.add("active");
          }
          if (selectedCategories.size === 0) {
            document.querySelector('.theme-pill[data-theme="all"]').classList.add("active");
          }
        }
      });
    });

    // Generate button
    document.getElementById("generateBtn").addEventListener("click", doGenerate);

    // Keyboard shortcut: Enter in keyword input
    document.getElementById("keywordInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") doGenerate();
    });

    // History toggle
    document.getElementById("historyToggle").addEventListener("click", function () {
      var list = document.getElementById("historyList");
      var arrow = this.querySelector(".toggle-arrow");
      list.classList.toggle("collapsed");
      arrow.textContent = list.classList.contains("collapsed") ? "\u25B6" : "\u25BC";
    });

    // Clear history
    document.getElementById("clearHistory").addEventListener("click", clearHistory);

    // Initial render
    renderHistory();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

export type ThemeMode = "dark" | "light";

export const THEME_STORAGE_KEY = "mc-theme";

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore storage errors
  }
}

export function readStoredTheme(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore storage errors
  }
  return "dark";
}

export const themeBootstrapScript = `(function(){try{var m=localStorage.getItem("${THEME_STORAGE_KEY}");if(m!=="light"){m="dark";}var r=document.documentElement;r.classList.toggle("dark",m==="dark");r.style.colorScheme=m;}catch(e){document.documentElement.classList.add("dark");}})();`;
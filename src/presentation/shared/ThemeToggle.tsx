import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { applyTheme, readStoredTheme, type ThemeMode } from "./theme";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMode(readStoredTheme());
    setReady(true);
  }, []);

  function select(next: ThemeMode) {
    setMode(next);
    applyTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="Tema da interface"
      className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1"
    >
      <button
        type="button"
        onClick={() => select("dark")}
        aria-pressed={ready && mode === "dark"}
        title="Tema escuro"
        className={`flex size-7 items-center justify-center rounded-full transition-colors ${
          ready && mode === "dark"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Moon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Tema escuro</span>
      </button>
      <button
        type="button"
        onClick={() => select("light")}
        aria-pressed={ready && mode === "light"}
        title="Tema claro"
        className={`flex size-7 items-center justify-center rounded-full transition-colors ${
          ready && mode === "light"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sun className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Tema claro</span>
      </button>
    </div>
  );
}
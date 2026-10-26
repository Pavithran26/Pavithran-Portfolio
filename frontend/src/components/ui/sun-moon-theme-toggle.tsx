"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

export type SunMoonTheme = "light" | "dark";

export interface SunMoonThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> {
  /** Controlled theme. Leave undefined to let the toggle manage it. */
  theme?: SunMoonTheme;
  /** Initial theme when there is no saved choice. */
  defaultTheme?: SunMoonTheme;
  /** Called with the next theme on every toggle. */
  onThemeChange?: (theme: SunMoonTheme) => void;
  /** Follow and toggle the .dark class on <html>, and fade page colors. */
  syncDocument?: boolean;
  /** Persist the choice in localStorage under this key. */
  storageKey?: string;
  /** Length of the whole swap in milliseconds. */
  duration?: number;
  /** Button diameter in pixels. */
  size?: number;
  /** Override the default sun / moon color classes. */
  classNames?: { sun?: string; moon?: string };
  /** Paint a night/day sky inside the button. */
  sky?: boolean;
  /** React 19 accepts ref as a regular prop. */
  ref?: React.Ref<HTMLButtonElement>;
}

const STORAGE_KEY = "portfolio-universe-theme";
const PAGE_FADE_STYLE_ID = "sun-moon-theme-fade";
const PAGE_FADE_PROPERTIES =
  "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke";
let pageFadeCleanup: number | undefined;

function readStoredTheme(key?: string): SunMoonTheme | null {
  if (!key || typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(key);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function readDocumentTheme(fallback: SunMoonTheme = "light"): SunMoonTheme {
  if (typeof document === "undefined") return fallback;
  const saved = document.documentElement.dataset.appearance;
  if (saved === "light" || saved === "dark") return saved;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.body?.classList.contains("experience-animation")) return "dark";
  if (document.body?.classList.contains("experience-normal")) return "light";
  return fallback;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function applyDocumentTheme(theme: SunMoonTheme, duration: number) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.appearance = theme;
  document.body.dataset.appearance = theme;

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "dark" ? "#07130b" : "#f8fcf9";

  if (duration <= 0 || prefersReducedMotion()) return;

  const style =
    document.getElementById(PAGE_FADE_STYLE_ID) ??
    document.head.appendChild(
      Object.assign(document.createElement("style"), { id: PAGE_FADE_STYLE_ID }),
    );
  style.textContent =
    "*, *::before, *::after { transition-property: " + PAGE_FADE_PROPERTIES +
    " !important; transition-duration: " + duration +
    "ms !important; transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1) !important; transition-delay: 0s !important; }";
  if (pageFadeCleanup !== undefined) window.clearTimeout(pageFadeCleanup);
  pageFadeCleanup = window.setTimeout(() => {
    style.remove();
    pageFadeCleanup = undefined;
  }, duration + 100);
}

export function SunMoonThemeToggle({
  theme: controlledTheme,
  defaultTheme = "light",
  onThemeChange,
  syncDocument = true,
  storageKey = STORAGE_KEY,
  duration = 1740,
  size = 40,
  classNames,
  sky = true,
  ref,
  className,
  style,
  onClick,
  ...rest
}: SunMoonThemeToggleProps) {
  const isControlled = controlledTheme !== undefined;
  const [internalTheme, setInternalTheme] = React.useState<SunMoonTheme>(
    () => readStoredTheme(storageKey) ?? readDocumentTheme(defaultTheme),
  );
  const [mounted, setMounted] = React.useState(false);
  const currentTheme = controlledTheme ?? internalTheme;

  React.useEffect(() => {
    setMounted(true);
    if (isControlled) return;
    const initial = readStoredTheme(storageKey) ?? readDocumentTheme(defaultTheme);
    setInternalTheme(initial);
    if (syncDocument) applyDocumentTheme(initial, 0);
  }, [defaultTheme, isControlled, storageKey, syncDocument]);

  // Until the visitor makes an explicit choice, follow their Professional/Animation mode.
  React.useEffect(() => {
    if (isControlled || !syncDocument || typeof document === "undefined") return;
    const body = document.body;
    const observer = new MutationObserver(() => {
      if (readStoredTheme(storageKey)) return;
      const modeTheme = body.classList.contains("experience-animation")
        ? "dark"
        : body.classList.contains("experience-normal")
          ? "light"
          : null;
      if (!modeTheme) return;
      setInternalTheme(modeTheme);
      applyDocumentTheme(modeTheme, 0);
    });
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [isControlled, storageKey, syncDocument]);

  // Keep the control and document in sync when the preference changes in another tab.
  React.useEffect(() => {
    if (isControlled || !storageKey || typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      const nextTheme: SunMoonTheme =
        event.newValue === "light" || event.newValue === "dark"
          ? event.newValue
          : readDocumentTheme(defaultTheme);
      setInternalTheme(nextTheme);
      if (syncDocument) applyDocumentTheme(nextTheme, 0);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, isControlled, storageKey, syncDocument]);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const next: SunMoonTheme = currentTheme === "dark" ? "light" : "dark";
    if (!isControlled) setInternalTheme(next);
    try {
      if (storageKey) window.localStorage.setItem(storageKey, next);
    } catch {
      // The toggle still works when private browsing blocks localStorage.
    }
    if (syncDocument) applyDocumentTheme(next, duration);
    onThemeChange?.(next);
  };

  const toggleStyle = {
    width: size,
    height: size,
    "--sun-moon-duration": String(duration) + "ms",
    ...style,
  } as React.CSSProperties;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="theme-toggle"
      data-state={currentTheme}
      aria-label={currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={currentTheme === "dark"}
      className={["sun-moon-theme-toggle", className].filter(Boolean).join(" ")}
      style={toggleStyle}
      onClick={toggle}
      {...rest}
    >
      {sky && (
        <span
          className={"sun-moon-theme-toggle__sky sun-moon-theme-toggle__sky--night" + (currentTheme === "dark" ? " is-visible" : "")}
          aria-hidden="true"
        >
          <i style={{ left: "24%", top: "22%", width: 3.2, height: 3.2 }} />
          <i style={{ left: "66%", top: "16%", width: 2.4, height: 2.4 }} />
          <i style={{ left: "80%", top: "42%", width: 3.6, height: 3.6 }} />
          <i style={{ left: "38%", top: "58%", width: 2.2, height: 2.2 }} />
          <i style={{ left: "58%", top: "74%", width: 2.8, height: 2.8 }} />
          <i style={{ left: "14%", top: "72%", width: 2.4, height: 2.4 }} />
        </span>
      )}
      {sky && (
        <span
          className={"sun-moon-theme-toggle__sky sun-moon-theme-toggle__sky--day" + (currentTheme === "light" ? " is-visible" : "")}
          aria-hidden="true"
        />
      )}
      <span
        className={[
          "sun-moon-theme-toggle__body",
          "sun-moon-theme-toggle__body--moon",
          currentTheme === "dark" && mounted ? "is-active" : "",
          classNames?.moon ?? "",
        ].filter(Boolean).join(" ")}
        aria-hidden="true"
      >
        <Moon size="52%" strokeWidth={2.2} fill="currentColor" />
      </span>
      <span
        className={[
          "sun-moon-theme-toggle__body",
          "sun-moon-theme-toggle__body--sun",
          currentTheme === "light" && mounted ? "is-active" : "",
          classNames?.sun ?? "",
        ].filter(Boolean).join(" ")}
        aria-hidden="true"
      >
        <Sun size="52%" strokeWidth={2.1} />
      </span>
      <span className="sun-moon-theme-toggle__gloss" aria-hidden="true" />
    </button>
  );
}

export default SunMoonThemeToggle;

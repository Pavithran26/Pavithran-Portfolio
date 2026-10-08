import { useState } from "react";
import { OptimusLandingPage, KageLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  const [theme, setTheme] = useState<"optimus" | "kage">("optimus");

  return (
    <div className="shader-frame">
      {/* Top Floating Experience Switcher HUD */}
      <div
        style={{
          position: "fixed",
          top: "16px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(10, 14, 22, 0.88)",
          padding: "6px 14px",
          borderRadius: "8px",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        }}
      >
        <span style={{ color: "#8c9cb6", marginRight: "4px", fontSize: "11px", letterSpacing: "0.08em" }}>
          SCENE:
        </span>
        <button
          type="button"
          onClick={() => setTheme("optimus")}
          style={{
            background: theme === "optimus" ? "#e0231c" : "transparent",
            color: "#ffffff",
            border: "1px solid " + (theme === "optimus" ? "#e0231c" : "rgba(255,255,255,0.2)"),
            padding: "5px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "11px",
            letterSpacing: "0.05em",
            transition: "all 0.2s ease",
            boxShadow: theme === "optimus" ? "0 0 12px rgba(224, 35, 28, 0.6)" : "none",
          }}
        >
          ⚡ Optimus Prime
        </button>
        <button
          type="button"
          onClick={() => setTheme("kage")}
          style={{
            background: theme === "kage" ? "#e0231c" : "transparent",
            color: "#ffffff",
            border: "1px solid " + (theme === "kage" ? "#e0231c" : "rgba(255,255,255,0.2)"),
            padding: "5px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "11px",
            letterSpacing: "0.05em",
            transition: "all 0.2s ease",
            boxShadow: theme === "kage" ? "0 0 12px rgba(224, 35, 28, 0.6)" : "none",
          }}
        >
          ⛩️ Kage Temple
        </button>
      </div>

      {theme === "optimus" ? (
        <OptimusLandingPage
          headingFont="onest"
          bodyFont="onest"
          headingWeight="500"
          bodyWeight="300"
          primaryColor="#e0231c"
          headingSize={48}
          bodySize={17}
          headingLetterSpacing={-0.015}
        />
      ) : (
        <KageLandingPage
          headingFont="onest"
          bodyFont="onest"
          headingWeight="400"
          bodyWeight="300"
          primaryColor="#e0231c"
          headingSize={46}
          bodySize={17}
          headingLetterSpacing={-0.012}
        />
      )}
    </div>
  );
}

export default Scene;

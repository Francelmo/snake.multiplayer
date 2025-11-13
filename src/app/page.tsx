"use client";

import { useState, useEffect } from "react";
import GamePopup from "@/components/GamePopup";
import GameCanvas from "@/components/GameCanvas";
import { SettingsDialog } from "@/components/SettingsDialog";
import { GameControls } from "@/components/GameControls";
import { InfoDialog } from "@/components/InfoDialog";
import { CircleQuestionMark } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const resetGame = () => setResetCounter(prev => prev + 1);
  const backToModeSelect = () => {
    setMode(null);
    setResetCounter(0);
  };

  useEffect(() => {
    if (mode === "multiplayer") {
      setInfoOpen(true);
    }
  }, [mode]);

  return (
    <main
      data-theme={theme}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        gap: "1rem",
      }}
    >
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
          onClick={() => setSettingsOpen(true)}
        >
          ⚙️
        </button>
        {mode === "multiplayer" && (
          <button
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
            onClick={() => setInfoOpen(true)}
            title="Regras do multiplayer"
          >
            <CircleQuestionMark className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        )}
      </div>

      {!mode && <GamePopup onSelect={setMode} />}
      {mode && (
        <>
          <GameCanvas
            key={resetCounter}
            mode={
              mode === "classic"
                ? "classic"
                : mode === "1xCOM"
                ? "1xCOM"
                : "multiplayer"
            }
          />
          <GameControls onReset={resetGame} onBack={backToModeSelect} />
        </>
      )}

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={toggleTheme}
        onResetScore={resetGame}
      />

      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
    </main>
  );
}

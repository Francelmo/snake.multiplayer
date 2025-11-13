"use client";

interface ScoreboardProps {
  player1: number;
  player2: number;
  mode: "multiplayer" | "1xCOM";
}

export default function Scoreboard({ player1, player2, mode }: ScoreboardProps) {
  return (
    <div className="flex justify-center gap-8 mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
      <div>🟦 Jogador 1: {player1}</div>
      <div>🟩 {mode === "1xCOM" ? "COM" : "Jogador 2"}: {player2}</div>
    </div>
  );
}

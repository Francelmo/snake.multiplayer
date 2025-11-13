"use client";

import { useEffect, useRef, useState } from "react";
import { moveSnake, checkCollision, randomPosition, Position } from "../lib/gameLogic";
import Scoreboard from "./Scoreboard";
import { computeSuperAIMove } from "../lib/aiLogic";

export default function GameCanvas({
  mode,
}: {
  mode: "classic" | "multiplayer" | "1xCOM";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const gridSize = isMobile ? 15 : 20;
  const tileSize = isMobile ? 20 : 25;

  const [snake1, setSnake1] = useState<Position[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
  ]);

  const [snake2, setSnake2] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 11, y: 10 },
  ]);

  const [food, setFood] = useState<Position>(randomPosition(gridSize));

  const [dir1, setDir1] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [dir2, setDir2] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("LEFT");

  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  const [gameState, setGameState] = useState<"ready" | "countdown" | "playing" | "gameover">("ready");
  const [countdown, setCountdown] = useState<number>(3); 
  const [winner, setWinner] = useState<string | null>(null);
  const [ranking, setRanking] = useState<{ name: string; score: number }[]>([]);

  // Ranking local
  useEffect(() => {
    const saved = localStorage.getItem("snakeRanking");
    if (saved) setRanking(JSON.parse(saved));
  }, []);

  const saveRanking = (player: string, score: number) => {
    const newRank = [...ranking, { name: player, score }];
    newRank.sort((a, b) => b.score - a.score);
    setRanking(newRank);
    localStorage.setItem("snakeRanking", JSON.stringify(newRank));
  };

  const opposite: Record<"UP" | "DOWN" | "LEFT" | "RIGHT", "UP" | "DOWN" | "LEFT" | "RIGHT"> = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT",
  };

  // Controles teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
    if (gameState === "ready") setGameState("playing");

    // Tecla Enter reinicia o jogo se estiver gameover
    if (e.key === "Enter" && gameState === "gameover") {
      resetGame();
    }

    // Jogador 1 (setas) -> sempre ativo
    const keys1 = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (keys1.includes(e.key)) {
      const dir = e.key.replace("Arrow", "").toUpperCase() as "UP" | "DOWN" | "LEFT" | "RIGHT";
      if (dir !== opposite[dir1]) setDir1(dir);
    }

    // Jogador 2 (w/a/s/d) -> somente multiplayer
    if (mode === "multiplayer") {
      const map2: Record<string, "UP" | "DOWN" | "LEFT" | "RIGHT"> = {
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };
      const next = map2[e.key.toLowerCase()];
      if (next && next !== opposite[dir2]) setDir2(next);
    }
  };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, mode, dir1, dir2]);

  const resetGame = () => {
    setSnake1([
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ]);
    setSnake2([
      { x: 10, y: 10 },
      { x: 11, y: 10 },
    ]);
    setDir1("RIGHT");
    setDir2("LEFT");
    setFood(randomPosition(gridSize, [snake1, snake2]));
    setScore1(0);
    setScore2(0);
    setWinner(null);
    setCountdown(3);
    setGameState("ready");
  };

  // Função para iniciar o jogo com contador
  const startMultiplayerGame = () => {
    if (mode !== "multiplayer") {
      setGameState("playing");
      return;
    }

    setCountdown(3);
    setGameState("countdown");

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setGameState("playing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Loop principal
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      let grow1 = false;
      let grow2 = false;
      let newFood = { ...food };

      if (snake1[0].x === food.x && snake1[0].y === food.y) {
        grow1 = true;
        setScore1((s) => s + 1);
        newFood = randomPosition(gridSize, [snake1, snake2]);
      }

      if (mode !== "classic" && snake2[0].x === food.x && snake2[0].y === food.y) {
        grow2 = true;
        setScore2((s) => s + 1);
        newFood = randomPosition(gridSize, [snake1, snake2]);
      }

      const newSnake1 = moveSnake(snake1, dir1, grow1);
      let newSnake2 = snake2;

      if (mode === "multiplayer") {
        newSnake2 = moveSnake(snake2, dir2, grow2);
      } else if (mode === "1xCOM") {
        const nextDir = computeSuperAIMove(snake2, food, dir2, gridSize, snake1, dir1);
        setDir2(nextDir);
        newSnake2 = moveSnake(snake2, nextDir, grow2);
      }

      setSnake1(newSnake1);
      setSnake2(newSnake2);
      setFood(newFood);

      // Colisões
      if (checkCollision(newSnake1, gridSize)) {
        if (mode === "classic") {
          setWinner("Game Over");
          saveRanking("Jogador 1", score1);
        } else {
          const winnerName = mode === "1xCOM" ? "COM" : "Jogador 2";
          setWinner(winnerName);
          saveRanking(winnerName, score2);
        }
        setGameState("gameover");
        return;
      }

      if (mode !== "classic" && checkCollision(newSnake2, gridSize)) {
        setWinner("Jogador 1");
        saveRanking("Jogador 1", score1);
        setGameState("gameover");
        return;
      }

      if (
        mode !== "classic" &&
        newSnake2.some((p) => p.x === newSnake1[0].x && p.y === newSnake1[0].y)
      ) {
        const winnerName = mode === "1xCOM" ? "COM" : "Jogador 2";
        setWinner(winnerName);
        saveRanking(winnerName, score2);
        setGameState("gameover");
        return;
      }

      if (
        mode !== "classic" &&
        newSnake1.some((p) => p.x === newSnake2[0].x && p.y === newSnake2[0].y)
      ) {
        setWinner("Jogador 1");
        saveRanking("Jogador 1", score1);
        setGameState("gameover");
        return;
      }
    }, 150);

    return () => clearInterval(interval);
  }, [snake1, snake2, dir1, dir2, mode, food, gameState]);

  // Renderização do canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--bg-color");
    ctx.fillRect(0, 0, gridSize * tileSize, gridSize * tileSize);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--food-color");
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    if (snake1.length > 0) {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--snake1-head-color");
      ctx.fillRect(snake1[0].x * tileSize, snake1[0].y * tileSize, tileSize, tileSize);

      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--snake1-color");
      snake1.slice(1).forEach((p) =>
        ctx.fillRect(p.x * tileSize, p.y * tileSize, tileSize, tileSize)
      );
    }

    if (mode !== "classic" && snake2.length > 0) {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--snake2-head-color");
      ctx.fillRect(snake2[0].x * tileSize, snake2[0].y * tileSize, tileSize, tileSize);

      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--snake2-color");
      snake2.slice(1).forEach((p) =>
        ctx.fillRect(p.x * tileSize, p.y * tileSize, tileSize, tileSize)
      );
    }
  }, [snake1, snake2, food, mode]);

  return (
    <div className="text-center w-full max-w-md mx-auto">
      <Scoreboard
        player1={score1}
        player2={score2}
        mode={mode === "1xCOM" ? "1xCOM" : "multiplayer"}
      />

      <canvas
        ref={canvasRef}
        width={gridSize * tileSize}
        height={gridSize * tileSize}
        className="border-2 border-gray-700 dark:border-gray-200 mb-2 w-full h-auto touch-none"
      />

      <p className="text-sm">🍎 Pontuação: {score1 + score2}</p>

      {/* BOTÃO DE INICIAR E CONTADOR */}
      {mode === "multiplayer" && gameState === "ready" && (
        <button
          onClick={startMultiplayerGame}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mb-2"
        >
          ▶️ Iniciar
        </button>
      )}

      {gameState === "countdown" && (
        <div className="text-4xl font-bold mb-2 animate-pulse">{countdown}</div>
      )}

      {gameState === "gameover" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transform scale-90 animate-popIn">
            <h3 className="text-xl font-bold mb-2">🏁 Fim de jogo!</h3>
            <h4 className="text-lg mb-4">🏆 {winner}</h4>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              🔁 Jogar novamente
            </button>
            <div className="mt-4 text-left max-h-40 overflow-auto">
              <h5 className="font-semibold mb-1">🏅 Ranking Local</h5>
              <ol className="list-decimal pl-4">
                {ranking.slice(0, 5).map((r, i) => (
                  <li key={i}>
                    {r.name}: {r.score}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

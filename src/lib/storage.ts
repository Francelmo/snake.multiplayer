// src/lib/storage.ts

export interface SnakeScore {
  player1: number
  player2: number
}

export interface SnakeRankingEntry {
  name: string
  score: number
}

// --- Score ---
export function loadScore(): SnakeScore {
  if (typeof window === "undefined") return { player1: 0, player2: 0 };
  return JSON.parse(localStorage.getItem("snake-score") || '{"player1":0,"player2":0}');
}

export function saveScore(score: SnakeScore) {
  if (typeof window === "undefined") return;
  localStorage.setItem("snake-score", JSON.stringify(score));
}

// --- Ranking ---
export function loadRanking(): SnakeRankingEntry[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("snake-ranking") || "[]");
}

export function saveRanking(ranking: SnakeRankingEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("snake-ranking", JSON.stringify(ranking));
}

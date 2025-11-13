export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export interface Position {
  x: number;
  y: number;
}

// Mapeamento de direção oposta
export const opposite: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

// Próxima posição baseado na direção
const nextPos = (pos: Position, dir: Direction): Position => {
  switch (dir) {
    case "UP": return { x: pos.x, y: pos.y - 1 };
    case "DOWN": return { x: pos.x, y: pos.y + 1 };
    case "LEFT": return { x: pos.x - 1, y: pos.y };
    case "RIGHT": return { x: pos.x + 1, y: pos.y };
  }
};

// Verifica se a posição é segura (próprio corpo + adversário)
const isSafe = (
  pos: Position,
  snakeBody: Position[],
  opponentBody: Position[],
  gridSize: number
): boolean =>
  pos.x >= 0 &&
  pos.x < gridSize &&
  pos.y >= 0 &&
  pos.y < gridSize &&
  !snakeBody.some(p => p.x === pos.x && p.y === pos.y) &&
  !opponentBody.some(p => p.x === pos.x && p.y === pos.y);

// Calcula espaço livre ao redor (flood fill)
const freeSpace = (start: Position, snakeBody: Position[], gridSize: number): number => {
  const visited = new Set<string>();
  const queue: Position[] = [start];
  let count = 0;

  while (queue.length) {
    const p = queue.shift()!;
    const key = `${p.x},${p.y}`;

    if (visited.has(key) || !isSafe(p, snakeBody, [], gridSize)) continue;
    visited.add(key);
    count++;

    ["UP", "DOWN", "LEFT", "RIGHT"].forEach((dir) =>
      queue.push(nextPos(p, dir as Direction))
    );
  }

  return count;
};

// Função da IA super avançada
export const computeSuperAIMove = (
  snake: Position[],
  food: Position,
  currentDir: Direction,
  gridSize: number,
  opponent: Position[],
  opponentDir: Direction
): Direction => {
  const head = snake[0];

  // Prever próximo movimento do jogador
  const predictPlayerMove = (dir: Direction): Position => {
    return nextPos(opponent[0], dir);
  };

  const evaluateMove = (dir: Direction): number => {
    const pos = nextPos(head, dir);
    const tempSnake = [pos, ...snake.slice(0, -1)];
    const combinedBody = [...tempSnake, ...opponent];

    let score = 0;

    // Evitar se aproximar demais do jogador
    const opponentNext = predictPlayerMove(opponentDir);
    const distToOpponent = Math.abs(pos.x - opponentNext.x) + Math.abs(pos.y - opponentNext.y);
    if (distToOpponent <= 2) score -= 200; // Penalidade maior se muito perto

    // Prioridade comida
    const distFood = Math.abs(pos.x - food.x) + Math.abs(pos.y - food.y);
    score -= distFood * 3; // Peso maior para comida

    // Espaço livre
    const space = freeSpace(pos, combinedBody, gridSize);
    score += space * 2; // Peso alto para mobilidade

    // Distância estratégica para perseguir jogador
    const distToPlayer = Math.abs(pos.x - opponent[0].x) + Math.abs(pos.y - opponent[0].y);
    if (distToPlayer > 3 && distToPlayer < 6) score += 30;

    return score;
  };

  const possibleDirs: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
  const safeDirs = possibleDirs.filter(
    dir => dir !== opposite[currentDir] && isSafe(nextPos(head, dir), snake, opponent, gridSize)
  );

  if (safeDirs.length === 0) return currentDir; // Sem saída, mantém direção

  safeDirs.sort((a, b) => evaluateMove(b) - evaluateMove(a));
  return safeDirs[0]; // Melhor movimento
};

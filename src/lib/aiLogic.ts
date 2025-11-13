export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export interface Position {
  x: number;
  y: number;
}

// Função auxiliar para verificar se uma posição é válida
const isSafe = (pos: Position, snakeBody: Position[], gridSize: number): boolean =>
  pos.x >= 0 && pos.x < gridSize && pos.y >= 0 && pos.y < gridSize && !snakeBody.some((p) => p.x === pos.x && p.y === pos.y);

// Função auxiliar para prever a próxima posição de acordo com a direção
const nextPos = (pos: Position, dir: Direction): Position => {
  switch (dir) {
    case "UP": return { x: pos.x, y: pos.y - 1 };
    case "DOWN": return { x: pos.x, y: pos.y + 1 };
    case "LEFT": return { x: pos.x - 1, y: pos.y };
    case "RIGHT": return { x: pos.x + 1, y: pos.y };
  }
};

// Função para calcular o espaço livre ao redor de uma posição
const freeSpace = (start: Position, snakeBody: Position[], gridSize: number): number => {
  const visited = new Set<string>();
  const queue: Position[] = [start];
  let count = 0;

  while (queue.length) {
    const p = queue.shift()!;
    const key = `${p.x},${p.y}`;

    // Verifica se a posição é segura e não foi visitada
    if (visited.has(key) || !isSafe(p, snakeBody, gridSize)) continue;
    visited.add(key);
    count++;

    // Adiciona as posições adjacentes à fila
    ["UP", "DOWN", "LEFT", "RIGHT"].forEach((dir) =>
      queue.push(nextPos(p, dir as Direction))
    );
  }

  return count;  // Retorna o número de células livres ao redor da posição inicial
};

// Função de IA Super avançada
export const computeSuperAIMove = (
  snake: Position[],
  food: Position,
  currentDir: Direction,
  gridSize: number,
  opponent: Position[],
  opponentDir: Direction
): Direction => {
  const head = snake[0];

  // Função auxiliar para prever a próxima posição do jogador adversário
  const predictPlayerMove = (dir: Direction): Position => {
    const playerHead = opponent[0];
    return nextPos(playerHead, dir);
  };

  // Função de avaliação do movimento
  const evaluateMove = (dir: Direction): number => {
    let score = 0;
    let pos = nextPos(head, dir);
    let tempSnake = [pos, ...snake.slice(0, -1)];

    // Fuga estratégica: evita ficar perto do oponente
    const opponentHeadNext = predictPlayerMove(opponentDir);
    const distToOpponent = Math.abs(pos.x - opponentHeadNext.x) + Math.abs(pos.y - opponentHeadNext.y);
    if (distToOpponent <= 2) score -= 100; // Penalidade maior se o oponente estiver muito perto

    // **Prioridade pela comida**: A IA agora deve realmente priorizar a comida.
    const distFood = Math.abs(pos.x - food.x) + Math.abs(pos.y - food.y);
    score -= distFood * 2;  // A distância para a comida tem um peso maior (prioridade mais alta)

    // Avaliar se há um bom espaço livre para manobra
    const space = freeSpace(pos, tempSnake, gridSize);
    score += space * 1.2; // Peso do espaço livre um pouco mais alto para maior mobilidade

    // A IA pode tentar perseguir o jogador (de forma mais agressiva)
    const distToPlayer = Math.abs(pos.x - opponent[0].x) + Math.abs(pos.y - opponent[0].y);
    if (distToPlayer > 3 && distToPlayer < 6) score += 50;  // Peso leve se estiver distante o suficiente

    return score;
  };

  const possibleDirs: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
  const safeDirs = possibleDirs.filter(
    (dir) => dir !== opposite[currentDir] && isSafe(nextPos(head, dir), snake, gridSize)
  );

  if (safeDirs.length === 0) return currentDir;

  // Ordena os movimentos possíveis pela avaliação de cada movimento
  safeDirs.sort((a, b) => evaluateMove(b) - evaluateMove(a));
  return safeDirs[0];
};

// Mapeamento de direção oposta para evitar 180 graus de virada
export const opposite: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

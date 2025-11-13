// gameLogic.ts

export interface Position {
  x: number;
  y: number;
}

/**
 * Gera uma posição aleatória no grid,
 * evitando sobreposição com as cobras existentes.
 */
export function randomPosition(
  gridSize: number,
  snakes: Position[][] = []
): Position {
  let pos: Position;
  let occupied = true;

  do {
    pos = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    // Verifica se a posição está ocupada por alguma cobra
    occupied = snakes.some((snake) =>
      snake.some((segment) => segment.x === pos.x && segment.y === pos.y)
    );
  } while (occupied);

  return pos;
}

/**
 * Move a cobra em uma direção, com opção de crescimento.
 */
export function moveSnake(
  snake: Position[],
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT",
  grow = false
): Position[] {
  const head = { ...snake[0] };

  switch (direction) {
    case "UP":
      head.y -= 1;
      break;
    case "DOWN":
      head.y += 1;
      break;
    case "LEFT":
      head.x -= 1;
      break;
    case "RIGHT":
      head.x += 1;
      break;
  }

  const newSnake = [head, ...snake];
  if (!grow) newSnake.pop();

  return newSnake;
}

/**
 * Verifica colisões com as bordas ou com o próprio corpo.
 */
export function checkCollision(snake: Position[], gridSize: number): boolean {
  const [head, ...body] = snake;

  // Bateu nas bordas
  if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize)
    return true;

  // Bateu em si mesmo
  return body.some((p) => p.x === head.x && p.y === head.y);
}

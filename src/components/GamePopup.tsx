"use client";

interface GamePopupProps {
  onSelect: (mode: string) => void;
}

export default function GamePopup({ onSelect }: GamePopupProps) {
  return (
    <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">🐍 Snake Game</h1>
      <p className="text-gray-500 dark:text-gray-300 mb-6">Escolha um modo de jogo:</p>

      <div className="flex flex-col gap-3">
        <button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 rounded"
          onClick={() => onSelect("classic")}
        >
          Clássico
        </button>

        <button
          className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white py-2 rounded"
          onClick={() => onSelect("multiplayer")}
        >
          1 x 1
        </button>

        <button
          className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800 text-white py-2 rounded"
          onClick={() => onSelect("1xCOM")}
        >
          1 x COM 🤖
        </button>
      </div>
    </div>
  );
}

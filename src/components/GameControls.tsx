import { Button } from "@/components/ui/button"

interface GameControlsProps {
  onReset: () => void
  onBack: () => void
}

export function GameControls({ onReset, onBack }: GameControlsProps) {
  return (
    <div className="flex gap-4">
      <Button onClick={onReset}>Reiniciar</Button>
      <Button onClick={onBack} variant="outline">Trocar Modo</Button>
    </div>
  )
}

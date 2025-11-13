import { CircleQuestionMark } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'

interface InfoDialogProps {
  open: boolean
  onClose: () => void
}

export function InfoDialog({ open, onClose }: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CircleQuestionMark className="w-6 h-6 text-green-600" />
            Regras do Modo Multiplayer
          </DialogTitle>

          {/* Texto curto no DialogDescription */}
          <DialogDescription className="mt-2 text-sm text-muted-foreground">
            No modo <strong>multiplayer</strong>, cada jogador controla uma cobra no mesmo tabuleiro.
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo mais detalhado fora do DialogDescription */}
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p>
            O objetivo é comer a maior quantidade de comida sem colidir.
          </p>

          <div>
            <strong>Controles:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Jogador 1: ⬆️ ↑, ⬇️ ↓, ⬅️ ←, ➡️ →</li>
              <li>Jogador 2: ⬆️ W, ⬇️ S, ⬅️ A, ➡️ D</li>
            </ul>
          </div>

          <p>
            💡 Cuidado: se sua cobra colidir com a parede ou com qualquer parte da cobra (inclusive a do outro jogador), o jogo termina e o outro jogador vence!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

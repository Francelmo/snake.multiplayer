// src/components/SettingsDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
  onToggleTheme: () => void
  onResetScore: () => void
}

export function SettingsDialog({
  open,
  onClose,
  onToggleTheme,
  onResetScore,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button variant="outline" onClick={onToggleTheme}>
            Alternar Tema
          </Button>
          <Button variant="destructive" onClick={onResetScore}>
            Resetar Pontuação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

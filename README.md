# 🐍 Snake Game - Clássico & Multiplayer Local

Este é um projeto interativo do jogo da **Cobrinha (Snake)** com **dois modos de jogo**:

- **Clássico:** o tradicional modo single player onde o objetivo é comer o máximo de frutas sem bater nas paredes ou em si mesmo.  
- **Multiplayer Local:** jogue com um amigo no mesmo teclado, competindo para ver quem sobrevive e pontua mais!

Desenvolvido com **Next.js** e estilizado com **Tailwind CSS**, o projeto traz uma interface moderna, responsiva e uma jogabilidade fluida.

---

## 🚀 Demonstração
[Snake Multiplayer no Vercel](https://snake-multiplayer-io.vercel.app)

---

## ✨ Funcionalidades

🎮 **Dois modos de jogo**
- 🧍‍♂️ **Modo Clássico:** jogue sozinho e desafie seu próprio recorde.  
- 👥 **Modo Multiplayer Local:** dois jogadores controlando cobras diferentes simultaneamente.

⚙️ **Configurações personalizáveis**
- Ajuste de velocidade e tamanho inicial.
- Escolha de cores ou temas para as cobras.

💾 **Persistência de dados**
- Armazenamento de placares e configurações no `localStorage`.

📊 **Placar em tempo real**
- Exibe pontuações e status dos jogadores durante a partida.

🧠 **Lógica separada por módulos**
- `gameLogic.ts`: controle da movimentação, colisões e pontuação.  
- `aiLogic.ts`: suporte para lógica de oponentes (IA) e futuros modos automáticos.  
- `storage.ts`: manipulação de dados persistentes.  
- `utils.ts`: funções auxiliares de controle e desenho.

💬 **Interface interativa**
- `GameCanvas.tsx`: canvas principal do jogo.  
- `GameControls.tsx`: botões e comandos de jogo.  
- `Scoreboard.tsx`: exibição dos placares.  
- `SettingsDialog.tsx` e `InfoDialog.tsx`: modais para configuração e instruções.  
- `GamePopup.tsx`: tela de início e fim de partida.

---

## 📦 Tecnologias

- **Next.js** (React + SSR)
- **TypeScript**
- **Tailwind CSS**
- **LocalStorage** (para salvar configurações e placares)
- **Vercel** (para deploy)

---

## 🧪 Scripts

```bash
# Instalar dependências
npm install

# Rodar localmente
npm run dev

# Build para produção
npm run build
```

## 🕹️ Controles

- Jogador 1:
⬆️ ⬇️ ⬅️ ➡️ — movimentação

- Jogador 2:
W A S D — movimentação

## 💡 Estrutura de pastas

```bash
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── GameCanvas.tsx
│   ├── GameControls.tsx
│   ├── GamePopup.tsx
│   ├── InfoDialog.tsx
│   ├── Scoreboard.tsx
│   ├── SettingsDialog.tsx
│   └── ui/
│       ├── button.tsx
│       └── dialog.tsx
│
└── lib/
    ├── aiLogic.ts
    ├── gameLogic.ts
    ├── storage.ts
    └── utils.ts
```

## 🧠 Futuras melhorias

- 💻 Adicionar modo online multiplayer.
- 🎨 Customização de temas e skins.
- 📱 Suporte total para mobile (controles por toque).

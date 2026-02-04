# Specification

## Summary
**Goal:** Replace the current Love Memory Game with a new simple, more interactive mini-game, and add celebratory win pop-up animations using the existing kiss/cupcake/bouquet assets while preserving session-based “won” progress behavior.

**Planned changes:**
- Replace the current 4-color sequence-following mechanic in `frontend/src/components/valentine/sections/GameSection.tsx` with a different in-browser mini-game that has a clearly explained objective and a deterministic win condition.
- Add a full “Play Again” flow that resets all game state and returns the UI to a clean starting state.
- On win, immediately trigger celebratory animated pop-ups that render multiple instances of the existing images: `/assets/generated/kiss.dim_512x512.png`, `/assets/generated/cupcake.dim_512x512.png`, and `/assets/generated/bouquet.dim_512x512.png`, then allow proceeding to the rewards screen.
- Ensure any ongoing win pop-up animations are stopped/cleared when replaying.
- Keep the existing `useGameProgress` “won at least once per session” behavior so a prior win shows the won UI state on load, with rewards still accessible and replay still available.

**User-visible outcome:** Players see a new, more interactive mini-game with a clear win condition; winning triggers celebratory kiss/cupcake/bouquet pop-up animations, and players can view rewards or replay, with win status remembered for the session.

# Specification

## Summary
**Goal:** Show a short sweet love-message popup overlay whenever the player wins any mini-game, without disrupting the existing win/rewards flow.

**Planned changes:**
- Add a reusable love-message popup overlay component (composed from existing UI components, without editing files under `frontend/src/components/ui`).
- Wire the popup into the win-handling flow for all 5 mini-games so it appears on every win (first-time and repeat), alongside existing win celebration effects and before/alongside the Rewards modal.
- Auto-dismiss the popup after a short duration (about 2–4 seconds) and ensure popup state resets/clears on “Play Again” and “Back to Menu” to avoid stale UI.

**User-visible outcome:** When the player wins any mini-game, they briefly see a readable sweet love message popup on top of the game, which disappears automatically and does not block the Rewards modal or replay/menu navigation.

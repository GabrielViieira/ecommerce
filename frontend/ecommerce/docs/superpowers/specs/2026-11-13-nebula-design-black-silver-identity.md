# Design System: Nebula Black & Silver

## Intent and Why
Criar uma identidade visual moderna para o e-commerce mantendo o conceito minimalista, com tema preto e prata que combinem elegância e charme com animações sutis e modernas.

## Goals
- Mantener o minimalismo "silent" como base
- Introduzir identidade visual entre preto profundo (#0a0a0a) e prata/nobreza (#b8b8b8)
- Adicionar animações elegantes e modernas
- Melhorar a hierarquia visual com gradientes e sombras sutis

## Non-Goals
- Mudanças radicais na UX
- Nova paleta de cores fora do tema preto-prata
- Reestruturação completa dos componentes

## New CSS Variables (src/index.css)

### Colors
- `--site-bg: #0a0a0a` (Deep Black)
- `--background: #0a0a0a`
- `--card-bg: #121212` (Charcoal)
- `--surface: #161717`
- `--surface-hover: #1e1f20`
- `--text-main: #f0f0f0` (Pure Silver)
- `--primary-accent: #b8b8b8` (Chrome Silver - Primary)

### Shadows
- `--shadow-sm: 0 1px 2px rgba(184, 184, 184, 0.08)`
- `--shadow-md: 0 4px 6px rgba(184, 184, 184, 0.1)`
- `--shadow-lg: 0 10px 15px rgba(184, 184, 184, 0.15)`

### Utilities Created
- `.card-sleek` - Cards with subtle shadows and hover elevation
- `.btn-sleek` - Sleek buttons with gradient effect
- `.btn-outline-sleek` - Outline buttons with hover effects
- `.animate-fade-in` - Elegant fade-in animation
- `.animate-slide-up` - Slide up for menus
- `.animate-pulse-subtle` - Subtle pulse for interactive elements
- `.btn-shine` - Shine effect on hover
- `.animate-float` - Gentle float animation

## Implementation Status
- ✅ CSS variables updated in src/index.css
- ✅ Header component updated with new colors and animations
- ✅ HomePage updated with new background colors
- ✅ Banner component has gradient buttons (already good)
- 🔄 Pending: Other page components to be updated
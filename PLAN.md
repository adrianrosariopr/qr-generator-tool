# QR Code Generator - Implementation Plan

## Overview
A clean, modern QR code generator web app built with Vue 3 + Vite. Users can enter text/URLs, customize QR code appearance, and download in PNG format.

## Current State
- Vue 3 + Vite scaffolded
- `qrcode` npm package installed
- `useQRCode.js` composable implemented (generates PNG/SVG)
- `QRCodeDisplay.vue` component ready (display + download buttons)
- Tailwind CSS 4 configured with custom OKLCH color theme
- App.vue still has placeholder content (needs integration)

## Implementation Tasks

### 1. Update App.vue - Main Interface
- [x] Remove Vite boilerplate
- [x] Create two-column layout (input form | QR preview)
- [x] Mobile-first responsive design (stacked on mobile, side-by-side on desktop)

### 2. Build Input Form Section
- [x] Text/URL input field with debounced generation
- [x] Size selector (128px, 256px, 512px, 1024px)
- [x] Foreground color picker
- [x] Background color picker
- [x] Live preview updates on any change

### 3. Integrate QRCodeDisplay Component
- [x] Connect to useQRCode composable
- [x] Wire up download buttons (PNG/SVG)
- [x] Show loading/error states

### 4. Enhance useQRCode Composable
- [x] Accept color options (dark/light) - already supported
- [x] Accept size option - already supported
- [x] Ensure reactive updates on option changes

### 5. Styling & Polish
- [x] Clean header with app title
- [x] Card-based sections with subtle shadows
- [x] Smooth transitions on state changes
- [x] Consistent spacing and typography
- [x] Mobile responsive breakpoints

## Technical Decisions

- **Debounce**: 300ms delay on input to avoid excessive regeneration
- **Default size**: 256px (good balance of quality and performance)
- **Default colors**: Black foreground, white background
- **Error correction**: Level M (15% recovery, good default)

## File Changes

| File | Action | Status |
|------|--------|--------|
| `src/App.vue` | Rewrite with full QR generator UI | Done |
| `src/composables/useQRCode.js` | Already complete | Done |
| `src/components/QRCodeDisplay.vue` | Already complete | Done |
| `src/style.css` | Already configured | Done |

## UI Layout

```
┌─────────────────────────────────────────────────┐
│  QR Code Generator                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ INPUT SECTION    │  │ PREVIEW SECTION  │    │
│  │                  │  │                  │    │
│  │ [Text/URL input] │  │   ┌────────┐     │    │
│  │                  │  │   │  QR    │     │    │
│  │ Size: [dropdown] │  │   │  Code  │     │    │
│  │                  │  │   └────────┘     │    │
│  │ Colors:          │  │                  │    │
│  │ FG: [■ picker]   │  │ [Download PNG]   │    │
│  │ BG: [□ picker]   │  │ [Download SVG]   │    │
│  │                  │  │                  │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Mobile Layout (< 768px)
- Single column, stacked vertically
- Input section first, preview section below
- Full-width buttons

## Build Verification
- Production build: Successful (97KB JS, 14KB CSS gzipped)
- Dev server: Running

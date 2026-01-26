# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Architecture

Vue 3 SPA using Vite, Tailwind CSS 4, and the `qrcode` library for QR generation.

**Key files:**
- `src/composables/useQRCode.js` - Core QR generation logic using the `qrcode` npm package. Generates both PNG (data URL) and SVG formats. Exposes `generateQR()`, `downloadPNG()`, `downloadSVG()`.
- `src/components/QRCodeDisplay.vue` - Display component for QR preview and download buttons
- `src/style.css` - Tailwind 4 theme configuration using `@theme` directive with OKLCH colors

**Tech stack:**
- Vue 3 with `<script setup>` syntax
- Tailwind CSS 4 via `@tailwindcss/vite` plugin
- `qrcode` package for QR code generation (supports PNG/SVG output)
- `jsbarcode` package available for barcode generation

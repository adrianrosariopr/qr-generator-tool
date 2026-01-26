<script setup>
import { ref, watch } from 'vue'
import { useQRCode } from './composables/useQRCode'
import QRCodeDisplay from './components/QRCodeDisplay.vue'

const { qrDataUrl, error, isGenerating, generateQR, downloadPNG, downloadSVG } = useQRCode()

// Form state
const inputText = ref('')
const size = ref(256)
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')

// Size options
const sizeOptions = [
  { value: 128, label: '128 × 128' },
  { value: 256, label: '256 × 256' },
  { value: 512, label: '512 × 512' },
  { value: 1024, label: '1024 × 1024' }
]

// Debounce timer
let debounceTimer = null

// Generate QR code with current options
function generate() {
  generateQR(inputText.value, {
    width: size.value,
    color: {
      dark: fgColor.value,
      light: bgColor.value
    }
  })
}

// Debounced generation
function debouncedGenerate() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(generate, 300)
}

// Watch all inputs for changes
watch([inputText, size, fgColor, bgColor], debouncedGenerate)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">QR Code Generator</h1>
            <p class="text-sm text-gray-500">Create custom QR codes instantly</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Input Section -->
        <div class="space-y-6">
          <!-- Text Input Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Content</h2>
            <div>
              <label for="qr-input" class="block text-sm font-medium text-gray-700 mb-2">
                Text or URL
              </label>
              <textarea
                id="qr-input"
                v-model="inputText"
                rows="4"
                placeholder="Enter text, URL, or any data to encode..."
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none text-gray-900 placeholder-gray-400"
              ></textarea>
              <p class="mt-2 text-xs text-gray-500">
                Tip: Shorter content creates simpler, more scannable QR codes
              </p>
            </div>
          </div>

          <!-- Customization Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Customize</h2>

            <!-- Size Selection -->
            <div class="mb-6">
              <label for="size-select" class="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                id="size-select"
                v-model="size"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-900 bg-white cursor-pointer"
              >
                <option v-for="opt in sizeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Color Pickers -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Foreground Color -->
              <div>
                <label for="fg-color" class="block text-sm font-medium text-gray-700 mb-2">
                  Foreground
                </label>
                <div class="flex items-center gap-3">
                  <input
                    id="fg-color"
                    type="color"
                    v-model="fgColor"
                    class="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer p-1"
                  />
                  <input
                    type="text"
                    v-model="fgColor"
                    maxlength="7"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-700 uppercase"
                  />
                </div>
              </div>

              <!-- Background Color -->
              <div>
                <label for="bg-color" class="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <div class="flex items-center gap-3">
                  <input
                    id="bg-color"
                    type="color"
                    v-model="bgColor"
                    class="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer p-1"
                  />
                  <input
                    type="text"
                    v-model="bgColor"
                    maxlength="7"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-700 uppercase"
                  />
                </div>
              </div>
            </div>

            <!-- Color Contrast Warning -->
            <p class="mt-4 text-xs text-gray-500">
              Ensure good contrast between foreground and background for reliable scanning
            </p>
          </div>
        </div>

        <!-- Preview Section -->
        <div>
          <QRCodeDisplay
            :dataUrl="qrDataUrl"
            :isGenerating="isGenerating"
            :error="error"
            @downloadPng="downloadPNG"
            @downloadSvg="downloadSVG"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-auto py-6 text-center text-sm text-gray-500">
      <p>QR codes generated locally in your browser. No data is sent to any server.</p>
    </footer>
  </div>
</template>

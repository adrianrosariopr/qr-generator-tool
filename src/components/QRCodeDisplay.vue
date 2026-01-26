<script setup>
import { computed } from 'vue'

const props = defineProps({
  dataUrl: String,
  isGenerating: Boolean,
  error: String
})

const emit = defineEmits(['downloadPng', 'downloadSvg'])

const hasQRCode = computed(() => props.dataUrl && props.dataUrl.length > 0)
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4 text-center">Your QR Code</h2>

    <!-- QR Code Preview -->
    <div class="bg-gray-50 rounded-xl p-6 mb-4 flex items-center justify-center min-h-[300px]">
      <div v-if="isGenerating" class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-sm text-gray-500">Generating...</span>
      </div>

      <div v-else-if="error" class="text-center">
        <div class="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm text-error">{{ error }}</p>
      </div>

      <div v-else-if="hasQRCode" class="relative">
        <img
          :src="dataUrl"
          alt="Generated QR Code"
          class="w-64 h-64 rounded-lg"
        />
      </div>

      <div v-else class="text-center">
        <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <p class="text-sm text-gray-500">Fill in the form to generate<br/>your QR code</p>
      </div>
    </div>

    <!-- Download Buttons -->
    <div class="flex gap-3">
      <button
        @click="emit('downloadPng')"
        :disabled="!hasQRCode"
        class="flex-1 py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        PNG
      </button>
      <button
        @click="emit('downloadSvg')"
        :disabled="!hasQRCode"
        class="flex-1 py-2.5 px-4 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        SVG
      </button>
    </div>
  </div>
</template>

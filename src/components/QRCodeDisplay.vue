<script setup>
import { computed } from 'vue'

const props = defineProps({
  dataUrl: String,
  isGenerating: Boolean,
  error: String,
  size: Number,
  fgColor: String,
  bgColor: String,
  sizeOptions: Array
})

const emit = defineEmits(['downloadPng', 'downloadSvg', 'update:size', 'update:fgColor', 'update:bgColor'])

const hasQRCode = computed(() => props.dataUrl && props.dataUrl.length > 0)
</script>

<template>
  <div class="card-brutal sticky top-6">
    <div class="card-brutal-header">
      <span class="dot dot-red"></span>
      <span class="dot dot-blue"></span>
      <span class="dot dot-green"></span>
    </div>
    <div class="card-brutal-body">
      <!-- QR Code Preview -->
      <div class="border-3 border-dashed border-maroon rounded-lg p-6 mb-5 flex items-center justify-center min-h-[240px] bg-gray-50">
        <div v-if="isGenerating" class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-4 border-btn-blue border-t-transparent rounded-full animate-spin"></div>
          <span class="font-body text-sm text-maroon-light">Generating...</span>
        </div>

        <div v-else-if="error" class="text-center">
          <div class="w-14 h-14 bg-btn-red/20 border-3 border-btn-red rounded-lg flex items-center justify-center mx-auto mb-3">
            <i class="fa-solid fa-circle-exclamation text-2xl text-btn-red"></i>
          </div>
          <p class="font-body text-sm text-btn-red">{{ error }}</p>
        </div>

        <div v-else-if="hasQRCode" class="relative animate-pop-in">
          <img
            :src="dataUrl"
            alt="Generated QR Code"
            class="w-52 h-52 border-3 border-maroon rounded-lg"
          />
        </div>

        <div v-else class="text-center py-4">
          <div class="w-16 h-16 bg-gray-200 rounded-lg border-3 border-gray-300 flex items-center justify-center mx-auto mb-3">
            <i class="fa-solid fa-qrcode text-3xl text-gray-400"></i>
          </div>
          <p class="font-inter text-sm font-bold text-maroon-light">
            Enter text to generate<br/>your QR code
          </p>
        </div>
      </div>

      <!-- Customization Options -->
      <div class="mb-5 space-y-4">
        <!-- Size Selection -->
        <div>
          <label for="size-select" class="block font-inter text-sm font-bold text-maroon-light mb-2">
            Size
          </label>
          <select
            id="size-select"
            :value="size"
            @change="emit('update:size', Number($event.target.value))"
            class="w-full px-4 py-2.5 border-3 border-maroon rounded-lg focus:outline-3 focus:outline-btn-blue focus:outline-offset-2 transition-colors text-gray-900 bg-white cursor-pointer font-body text-sm"
          >
            <option v-for="opt in sizeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Color Pickers -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Foreground Color -->
          <div>
            <label for="fg-color" class="block font-inter text-sm font-bold text-maroon-light mb-2">
              Foreground
            </label>
            <div class="flex items-center gap-2">
              <input
                id="fg-color"
                type="color"
                :value="fgColor"
                @input="emit('update:fgColor', $event.target.value)"
              />
              <input
                type="text"
                :value="fgColor"
                @input="emit('update:fgColor', $event.target.value)"
                maxlength="7"
                class="flex-1 min-w-0 px-2 py-1.5 border-3 border-maroon rounded-lg text-xs font-mono text-gray-700 uppercase"
              />
            </div>
          </div>

          <!-- Background Color -->
          <div>
            <label for="bg-color" class="block font-inter text-sm font-bold text-maroon-light mb-2">
              Background
            </label>
            <div class="flex items-center gap-2">
              <input
                id="bg-color"
                type="color"
                :value="bgColor"
                @input="emit('update:bgColor', $event.target.value)"
              />
              <input
                type="text"
                :value="bgColor"
                @input="emit('update:bgColor', $event.target.value)"
                maxlength="7"
                class="flex-1 min-w-0 px-2 py-1.5 border-3 border-maroon rounded-lg text-xs font-mono text-gray-700 uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Download Buttons -->
      <div class="flex gap-3 max-sm:flex-col">
        <button
          @click="emit('downloadPng')"
          :disabled="!hasQRCode"
          class="btn-brutal flex-1 bg-btn-blue text-white inline-flex items-center justify-center gap-2 text-base"
          style="text-shadow: -1px 1.5px 0 black"
        >
          <i class="fa-solid fa-download"></i>
          <span>PNG</span>
        </button>
        <button
          @click="emit('downloadSvg')"
          :disabled="!hasQRCode"
          class="btn-brutal flex-1 bg-btn-green text-white inline-flex items-center justify-center gap-2 text-base"
          style="text-shadow: -1px 1.5px 0 black"
        >
          <i class="fa-solid fa-download"></i>
          <span>SVG</span>
        </button>
      </div>
    </div>
  </div>
</template>

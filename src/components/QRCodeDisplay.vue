<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  dataUrl: String,
  isGenerating: Boolean,
  error: String,
  size: Number,
  fgColor: String,
  bgColor: String,
  sizeOptions: Array
})

const emit = defineEmits(['downloadPng', 'downloadSvg', 'update:size', 'update:fgColor', 'update:bgColor', 'showHelp'])

const hasQRCode = computed(() => !!props.dataUrl)

const cardRef = ref(null)
const qrImageRef = ref(null)

onMounted(() => {
  if (cardRef.value) {
    gsap.fromTo(cardRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.25, ease: 'power2.out' }
    )
  }
})

watch(() => props.dataUrl, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal && qrImageRef.value) {
    gsap.fromTo(qrImageRef.value,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
    )
  }
})
</script>

<template>
  <div ref="cardRef" class="card-cipher has-marquee h-full flex flex-col">
    <div class="danger-marquee" aria-hidden="true"></div>
    <div class="card-cipher-header justify-between">
      <div class="flex items-center gap-2">
        <span class="indicator"></span>
        <span class="title">Output Module</span>
      </div>
      <button
        @click="emit('showHelp')"
        class="help-btn-cipher"
        aria-label="How it works"
        title="How it works"
      >
        ?
      </button>
    </div>
    <div class="card-cipher-body flex-1 flex flex-col">
      <!-- QR Code Preview -->
      <div class="qr-preview-area p-6 mb-5 flex items-center justify-center min-h-[240px]">
        <div v-if="isGenerating" class="flex flex-col items-center gap-3">
          <div class="loader-cipher"></div>
          <span class="font-display text-xs text-gold uppercase tracking-widest">Generating...</span>
        </div>

        <div v-else-if="error" class="text-center">
          <div class="w-14 h-14 border border-red-500 flex items-center justify-center mx-auto mb-3">
            <i class="fa-solid fa-triangle-exclamation text-2xl text-red-500"></i>
          </div>
          <p class="font-body text-xs text-red-500">{{ error }}</p>
        </div>

        <div v-else-if="hasQRCode" class="relative">
          <img
            ref="qrImageRef"
            :src="dataUrl"
            alt="Generated QR Code"
            class="w-52 h-52 border border-gold"
          />
        </div>

        <div v-else class="text-center py-4">
          <div class="w-16 h-16 border border-cyber-border flex items-center justify-center mx-auto mb-3">
            <i class="fa-solid fa-qrcode text-3xl text-text-muted"></i>
          </div>
          <p class="font-display text-xs text-text-muted uppercase tracking-widest">
            Enter data to generate<br/>your QR code
          </p>
        </div>
      </div>

      <!-- Customization Options -->
      <div class="mb-5 space-y-4">
        <!-- Size Selection -->
        <div>
          <label for="size-select" class="label-cipher">Size</label>
          <select
            id="size-select"
            :value="size"
            @change="emit('update:size', Number($event.target.value))"
            class="input-cipher"
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
            <label for="fg-color" class="label-cipher">Foreground</label>
            <div class="flex items-center gap-2">
              <input
                id="fg-color"
                type="color"
                :value="fgColor"
                @input="emit('update:fgColor', $event.target.value)"
                aria-label="Foreground color picker"
              />
              <input
                id="fg-color-text"
                type="text"
                :value="fgColor"
                @input="emit('update:fgColor', $event.target.value)"
                maxlength="7"
                class="input-cipher flex-1 min-w-0 px-2 py-1.5 text-xs font-mono uppercase"
                aria-label="Foreground color hex value"
              />
            </div>
          </div>

          <!-- Background Color -->
          <div>
            <label for="bg-color" class="label-cipher">Background</label>
            <div class="flex items-center gap-2">
              <input
                id="bg-color"
                type="color"
                :value="bgColor"
                @input="emit('update:bgColor', $event.target.value)"
                aria-label="Background color picker"
              />
              <input
                id="bg-color-text"
                type="text"
                :value="bgColor"
                @input="emit('update:bgColor', $event.target.value)"
                maxlength="7"
                class="input-cipher flex-1 min-w-0 px-2 py-1.5 text-xs font-mono uppercase"
                aria-label="Background color hex value"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Download Buttons -->
      <div class="flex gap-4 max-sm:flex-col mt-auto">
        <button
          @click="emit('downloadPng')"
          :disabled="!hasQRCode"
          class="cybr-btn flex-1"
        >
          <span class="cybr-btn__content"><i class="fa-solid fa-download"></i> PNG</span>_
          <span class="cybr-btn__glitch" aria-hidden>PNG_</span>
        </button>
        <button
          @click="emit('downloadSvg')"
          :disabled="!hasQRCode"
          class="cybr-btn secondary flex-1"
        >
          <span class="cybr-btn__content"><i class="fa-solid fa-download"></i> SVG</span>_
          <span class="cybr-btn__glitch" aria-hidden>SVG_</span>
        </button>
      </div>
    </div>
  </div>
</template>

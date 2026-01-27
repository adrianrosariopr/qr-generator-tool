<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import { useQRCode } from './composables/useQRCode'
import {
  formatWifi,
  formatVCard,
  formatTwitter,
  formatFacebook,
  formatInstagram,
  formatLinkedin,
  formatTiktok,
  formatYoutube,
  formatBluesky,
  formatWhatsapp,
  formatSnapchat,
  formatAppStore
} from './composables/useQRFormatters'
import QRCodeDisplay from './components/QRCodeDisplay.vue'

const { qrDataUrl, error, isGenerating, generateQR, downloadPNG, downloadSVG } = useQRCode()

// Form state
const size = ref(256)
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const selectedType = ref('url')

// Modal state
const showHelp = ref(false)

// Form data for each type
const formData = ref({
  // Simple types
  url: '',
  image: '',

  // WiFi
  wifi: { ssid: '', password: '', security: 'WPA', hidden: false },

  // vCard
  vcard: { firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', website: '' },

  // Social
  twitter: { username: '', tweet: '' },
  facebook: { url: '', pageId: '' },
  instagram: '',
  linkedin: '',
  tiktok: '',
  youtube: '',
  bluesky: '',
  whatsapp: '',
  snapchat: '',

  // App Stores
  appstore: { iosUrl: '', androidUrl: '' }
})

// QR Type options - General
const qrTypesGeneral = [
  { id: 'url', label: 'URL', icon: 'fa-solid fa-link' },
  { id: 'vcard', label: 'vCard', icon: 'fa-solid fa-address-card' },
  { id: 'wifi', label: 'WiFi', icon: 'fa-solid fa-wifi' },
  { id: 'appstore', label: 'App', icon: 'fa-solid fa-mobile-screen' },
  { id: 'image', label: 'Img', icon: 'fa-solid fa-image' },
]

// QR Type options - Social
const qrTypesSocial = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'fa-brands fa-linkedin' },
  { id: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram' },
  { id: 'facebook', label: 'Facebook', icon: 'fa-brands fa-facebook' },
  { id: 'twitter', label: 'X', icon: 'fa-brands fa-x-twitter' },
  { id: 'snapchat', label: 'Snapchat', icon: 'fa-brands fa-snapchat' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
  { id: 'tiktok', label: 'TikTok', icon: 'fa-brands fa-tiktok' },
  { id: 'youtube', label: 'YouTube', icon: 'fa-brands fa-youtube' },
  { id: 'bluesky', label: 'Bluesky', icon: 'fa-solid fa-cloud' },
]

// Size options
const sizeOptions = [
  { value: 128, label: '128 × 128' },
  { value: 256, label: '256 × 256' },
  { value: 512, label: '512 × 512' },
  { value: 1024, label: '1024 × 1024' }
]

// Formatter map - maps QR type to its formatting function
const formatters = {
  url: (d) => d.url,
  image: (d) => d.image,
  wifi: (d) => formatWifi(d.wifi),
  vcard: (d) => formatVCard(d.vcard),
  twitter: (d) => formatTwitter(d.twitter),
  facebook: (d) => formatFacebook(d.facebook),
  instagram: (d) => formatInstagram(d.instagram),
  linkedin: (d) => formatLinkedin(d.linkedin),
  tiktok: (d) => formatTiktok(d.tiktok),
  youtube: (d) => formatYoutube(d.youtube),
  bluesky: (d) => formatBluesky(d.bluesky),
  whatsapp: (d) => formatWhatsapp(d.whatsapp),
  snapchat: (d) => formatSnapchat(d.snapchat),
  appstore: (d) => formatAppStore(d.appstore)
}

// Computed QR data based on selected type
const qrContent = computed(() => {
  const formatter = formatters[selectedType.value]
  return formatter ? formatter(formData.value) : ''
})

// Debounce timer
let debounceTimer = null

// Generate QR code with current options
function generate() {
  if (!qrContent.value) return

  generateQR(qrContent.value, {
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

// Watch for changes
watch([qrContent, size, fgColor, bgColor], debouncedGenerate)

// Cleanup debounce timer on unmount to prevent memory leaks
onUnmounted(() => clearTimeout(debounceTimer))

// Input class for consistent styling
const inputClass = 'w-full px-4 py-2.5 border-3 border-maroon rounded-lg focus:outline-3 focus:outline-btn-blue focus:outline-offset-2 transition-colors text-gray-900 placeholder-gray-400 font-body text-sm'
const labelClass = 'block font-inter text-sm font-bold text-maroon-light mb-2'
</script>

<template>
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow focus:border-3 focus:border-maroon focus:rounded-lg focus:font-bold focus:text-maroon">
    Skip to main content
  </a>
  <div class="min-h-screen px-5 pt-5 pb-5 flex flex-col items-center max-md:px-4 max-sm:px-3">
    <!-- Header -->
    <header class="text-center mb-4">
      <h1
        class="font-display text-4xl md:text-5xl lg:text-6xl text-black m-0 mb-2 leading-tight"
        style="text-shadow: 0px 2px 0px #55112c"
      >
        QRMagic.io
      </h1>
      <p class="font-title text-xl md:text-2xl text-black m-0 leading-tight">
        Generate QR codes Instantly, locally and FREE!
      </p>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="w-[90%] max-w-5xl max-md:w-[95%] max-sm:w-[98%]" aria-label="QR Code Generator">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Content Card -->
        <div class="card-brutal">
          <div class="card-brutal-header">
            <span class="dot dot-red"></span>
            <span class="dot dot-blue"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="card-brutal-body">
            <!-- Type Selection -->
            <div class="mb-5">
              <!-- General label -->
              <div class="mb-3 flex items-center gap-3">
                <div class="flex-1 border-t-2 border-dashed border-gray-300"></div>
                <span class="text-xs text-gray-400 font-body uppercase tracking-wide">General</span>
                <div class="flex-1 border-t-2 border-dashed border-gray-300"></div>
              </div>

              <!-- General Types -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="type in qrTypesGeneral"
                  :key="type.id"
                  @click="selectedType = type.id"
                  :class="[
                    'flex items-center gap-2 px-3 py-2 border-2 rounded-lg font-body text-sm transition-all cursor-pointer',
                    selectedType === type.id
                      ? 'border-maroon bg-yellow text-maroon-light'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-maroon hover:bg-gray-50'
                  ]"
                >
                  <i :class="type.icon" aria-hidden="true"></i>
                  {{ type.label }}
                </button>
              </div>

              <!-- Divider with label -->
              <div class="my-3 flex items-center gap-3">
                <div class="flex-1 border-t-2 border-dashed border-gray-300"></div>
                <span class="text-xs text-gray-400 font-body uppercase tracking-wide">Social</span>
                <div class="flex-1 border-t-2 border-dashed border-gray-300"></div>
              </div>

              <!-- Social Types (icon only with tooltip) -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="type in qrTypesSocial"
                  :key="type.id"
                  @click="selectedType = type.id"
                  :title="type.label"
                  :aria-label="`Select ${type.label} QR code type`"
                  :class="[
                    'flex items-center justify-center w-10 h-10 border-2 rounded-lg text-lg transition-all cursor-pointer',
                    selectedType === type.id
                      ? 'border-maroon bg-yellow text-maroon-light'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-maroon hover:bg-gray-50'
                  ]"
                >
                  <i :class="type.icon" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <!-- Dynamic Forms -->
            <div class="space-y-4">

              <!-- URL Form -->
              <div v-if="selectedType === 'url'">
                <label :class="labelClass">URL</label>
                <input
                  type="url"
                  v-model="formData.url"
                  placeholder="https://example.com"
                  :class="inputClass"
                />
              </div>

              <!-- WiFi Form -->
              <div v-else-if="selectedType === 'wifi'" class="space-y-3">
                <div>
                  <label :class="labelClass">Network Name (SSID)</label>
                  <input
                    type="text"
                    v-model="formData.wifi.ssid"
                    placeholder="MyWiFiNetwork"
                    :class="inputClass"
                  />
                </div>
                <div>
                  <label :class="labelClass">Password</label>
                  <input
                    type="text"
                    v-model="formData.wifi.password"
                    placeholder="Enter password"
                    :class="inputClass"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label :class="labelClass">Security</label>
                    <select v-model="formData.wifi.security" :class="inputClass">
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                  <div class="flex items-end pb-1">
                    <label class="flex items-center gap-2 cursor-pointer font-body text-sm text-maroon-light">
                      <input
                        type="checkbox"
                        v-model="formData.wifi.hidden"
                        class="w-5 h-5 rounded border-2 border-maroon accent-maroon"
                      />
                      Hidden Network
                    </label>
                  </div>
                </div>
              </div>

              <!-- vCard Form -->
              <div v-else-if="selectedType === 'vcard'" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label :class="labelClass">First Name</label>
                    <input
                      type="text"
                      v-model="formData.vcard.firstName"
                      placeholder="John"
                      :class="inputClass"
                    />
                  </div>
                  <div>
                    <label :class="labelClass">Last Name</label>
                    <input
                      type="text"
                      v-model="formData.vcard.lastName"
                      placeholder="Doe"
                      :class="inputClass"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label :class="labelClass">Phone</label>
                    <input
                      type="tel"
                      v-model="formData.vcard.phone"
                      placeholder="+1 234 567 8900"
                      :class="inputClass"
                    />
                  </div>
                  <div>
                    <label :class="labelClass">Email</label>
                    <input
                      type="email"
                      v-model="formData.vcard.email"
                      placeholder="john@example.com"
                      :class="inputClass"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label :class="labelClass">Organization</label>
                    <input
                      type="text"
                      v-model="formData.vcard.organization"
                      placeholder="Company Inc."
                      :class="inputClass"
                    />
                  </div>
                  <div>
                    <label :class="labelClass">Title</label>
                    <input
                      type="text"
                      v-model="formData.vcard.title"
                      placeholder="Software Engineer"
                      :class="inputClass"
                    />
                  </div>
                </div>
                <div>
                  <label :class="labelClass">Website</label>
                  <input
                    type="url"
                    v-model="formData.vcard.website"
                    placeholder="https://example.com"
                    :class="inputClass"
                  />
                </div>
              </div>

              <!-- Twitter Form -->
              <div v-else-if="selectedType === 'twitter'" class="space-y-3">
                <div>
                  <label :class="labelClass">Username (for profile link)</label>
                  <input
                    type="text"
                    v-model="formData.twitter.username"
                    placeholder="@username"
                    :class="inputClass"
                  />
                </div>
                <div class="text-center text-sm text-gray-500 font-body">— or —</div>
                <div>
                  <label :class="labelClass">Tweet Text (for tweet intent)</label>
                  <textarea
                    v-model="formData.twitter.tweet"
                    rows="2"
                    placeholder="Check out this awesome site!"
                    :class="[inputClass, 'resize-none']"
                  ></textarea>
                </div>
              </div>

              <!-- Facebook Form -->
              <div v-else-if="selectedType === 'facebook'" class="space-y-3">
                <div>
                  <label :class="labelClass">Facebook URL</label>
                  <input
                    type="url"
                    v-model="formData.facebook.url"
                    placeholder="https://facebook.com/yourpage"
                    :class="inputClass"
                  />
                </div>
                <div class="text-center text-sm text-gray-500 font-body">— or —</div>
                <div>
                  <label :class="labelClass">Page/Profile ID</label>
                  <input
                    type="text"
                    v-model="formData.facebook.pageId"
                    placeholder="yourpage"
                    :class="inputClass"
                  />
                </div>
              </div>

              <!-- Instagram Form -->
              <div v-else-if="selectedType === 'instagram'">
                <label :class="labelClass">Instagram Username or URL</label>
                <input
                  type="text"
                  v-model="formData.instagram"
                  placeholder="@username or https://instagram.com/username"
                  :class="inputClass"
                />
              </div>

              <!-- LinkedIn Form -->
              <div v-else-if="selectedType === 'linkedin'">
                <label :class="labelClass">LinkedIn Username or URL</label>
                <input
                  type="text"
                  v-model="formData.linkedin"
                  placeholder="username or https://linkedin.com/in/username"
                  :class="inputClass"
                />
              </div>

              <!-- TikTok Form -->
              <div v-else-if="selectedType === 'tiktok'">
                <label :class="labelClass">TikTok Username or URL</label>
                <input
                  type="text"
                  v-model="formData.tiktok"
                  placeholder="@username or https://tiktok.com/@username"
                  :class="inputClass"
                />
              </div>

              <!-- YouTube Form -->
              <div v-else-if="selectedType === 'youtube'">
                <label :class="labelClass">YouTube Channel or URL</label>
                <input
                  type="text"
                  v-model="formData.youtube"
                  placeholder="@channel or https://youtube.com/@channel"
                  :class="inputClass"
                />
              </div>

              <!-- Bluesky Form -->
              <div v-else-if="selectedType === 'bluesky'">
                <label :class="labelClass">Bluesky Handle or URL</label>
                <input
                  type="text"
                  v-model="formData.bluesky"
                  placeholder="username.bsky.social"
                  :class="inputClass"
                />
              </div>

              <!-- WhatsApp Form -->
              <div v-else-if="selectedType === 'whatsapp'">
                <label :class="labelClass">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  v-model="formData.whatsapp"
                  placeholder="+1 234 567 8900"
                  :class="inputClass"
                />
                <p class="mt-2 text-xs text-gray-500 font-body">
                  Include country code for international numbers
                </p>
              </div>

              <!-- Snapchat Form -->
              <div v-else-if="selectedType === 'snapchat'">
                <label :class="labelClass">Snapchat Username or URL</label>
                <input
                  type="text"
                  v-model="formData.snapchat"
                  placeholder="username"
                  :class="inputClass"
                />
              </div>

              <!-- App Stores Form -->
              <div v-else-if="selectedType === 'appstore'" class="space-y-3">
                <div>
                  <label :class="labelClass">
                    <i class="fa-brands fa-apple mr-1"></i> App Store URL (iOS)
                  </label>
                  <input
                    type="url"
                    v-model="formData.appstore.iosUrl"
                    placeholder="https://apps.apple.com/app/id123456"
                    :class="inputClass"
                  />
                </div>
                <div>
                  <label :class="labelClass">
                    <i class="fa-brands fa-google-play mr-1"></i> Play Store URL (Android)
                  </label>
                  <input
                    type="url"
                    v-model="formData.appstore.androidUrl"
                    placeholder="https://play.google.com/store/apps/details?id=com.app"
                    :class="inputClass"
                  />
                </div>
                <p class="text-xs text-gray-500 font-body">
                  Note: QR will link to iOS URL if both are provided
                </p>
              </div>

              <!-- Image Form -->
              <div v-else-if="selectedType === 'image'">
                <label :class="labelClass">Image URL</label>
                <input
                  type="url"
                  v-model="formData.image"
                  placeholder="https://example.com/image.png"
                  :class="inputClass"
                />
                <p class="mt-2 text-xs text-gray-500 font-body">
                  Link to a hosted image file
                </p>
              </div>

            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div>
          <QRCodeDisplay
            :dataUrl="qrDataUrl"
            :isGenerating="isGenerating"
            :error="error"
            v-model:size="size"
            v-model:fgColor="fgColor"
            v-model:bgColor="bgColor"
            :sizeOptions="sizeOptions"
            @downloadPng="downloadPNG"
            @downloadSvg="downloadSVG"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-10 pb-5">
      <div class="flex bg-white border-3 border-maroon rounded-full shadow-brutal overflow-hidden">
        <button
          @click="showHelp = true"
          class="font-sans text-sm font-bold text-maroon hover:bg-yellow transition-colors cursor-pointer bg-transparent border-none px-5 py-2.5 max-sm:px-4 max-sm:py-2 max-sm:text-xs"
        >
          How it works?
        </button>
        <div class="w-[3px] bg-maroon" />
        <a
          href="https://invisionnaire.com"
          target="_blank"
          rel="noopener noreferrer"
          class="font-sans text-sm font-bold text-maroon hover:bg-yellow transition-colors no-underline px-5 py-2.5 max-sm:px-4 max-sm:py-2 max-sm:text-xs"
        >
          Powered by Invisionnaire
        </a>
      </div>
    </footer>
  </div>

  <!-- Help Modal -->
  <Teleport to="body">
    <div
      v-if="showHelp"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      @click="showHelp = false"
      @keydown.escape="showHelp = false"
    >
      <div
        class="bg-white border-3 border-maroon rounded-[15px] shadow-brutal-lg max-w-lg w-full max-h-[90vh] overflow-auto animate-pop-in"
        @click.stop
      >
        <div class="bg-yellow px-5 py-4 border-b-3 border-maroon flex justify-between items-center">
          <h2 id="help-modal-title" class="font-title text-xl text-maroon m-0">How it works</h2>
          <button
            @click="showHelp = false"
            class="text-2xl text-maroon hover:text-btn-red bg-transparent border-none cursor-pointer leading-none"
            aria-label="Close help dialog"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="p-6 font-body text-maroon-light space-y-4">
          <div class="flex gap-3">
            <span class="font-title text-btn-blue text-xl">1.</span>
            <p class="m-0"><strong>Select a type</strong> — Choose from 8 QR code types: URL, vCard, WiFi, Bitcoin, and more.</p>
          </div>
          <div class="flex gap-3">
            <span class="font-title text-btn-blue text-xl">2.</span>
            <p class="m-0"><strong>Fill in the form</strong> — Enter the required information for your selected type.</p>
          </div>
          <div class="flex gap-3">
            <span class="font-title text-btn-blue text-xl">3.</span>
            <p class="m-0"><strong>Customize & Download</strong> — Adjust colors and size, then download as PNG or SVG.</p>
          </div>
          <div class="mt-6 bg-green-50 border-2 border-btn-green rounded-lg p-4">
            <p class="m-0 text-btn-green font-bold flex items-center gap-2">
              <span class="text-xl">🔒</span>
              <span>100% Private</span>
            </p>
            <p class="m-0 mt-1 text-sm text-green-700">
              Your data never leaves your device. Everything happens in your browser — no uploads, no servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

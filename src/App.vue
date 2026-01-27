<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)
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
const fgColor = ref('#f5b800')
const bgColor = ref('#0a0a0a')
const selectedType = ref('url')

// Modal state
const showHelp = ref(false)

// Refs for GSAP animations
const headerRef = ref(null)
const formCardRef = ref(null)
const neonLabelRef = ref(null)
const lightningRef = ref(null)
const invWrapperRef = ref(null)
const invLogoRef = ref(null)
const invTooltipRef = ref(null)

// Invisionnaire logo hover animations
function showInvTooltip() {
  if (!invTooltipRef.value || !invLogoRef.value) return

  const logo = invLogoRef.value
  const img = logo.querySelector('img')

  gsap.killTweensOf([invTooltipRef.value, logo, img])

  // Rotate diamond to square (Z-axis rotation)
  gsap.to(logo, {
    rotationZ: 0,
    scale: 1.1,
    boxShadow: '0 0 25px rgba(245, 184, 0, 0.6)',
    duration: 0.4,
    ease: 'power2.out'
  })

  // Counter-rotate image to keep it upright
  gsap.to(img, {
    rotationZ: 0,
    duration: 0.4,
    ease: 'power2.out'
  })

  gsap.fromTo(invTooltipRef.value,
    { opacity: 0, y: 10, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
  )
}

function hideInvTooltip() {
  if (!invTooltipRef.value || !invLogoRef.value) return

  const logo = invLogoRef.value
  const img = logo.querySelector('img')

  gsap.killTweensOf([invTooltipRef.value, logo, img])

  // Rotate back to diamond (Z-axis rotation)
  gsap.to(logo, {
    rotationZ: 45,
    scale: 1,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    duration: 0.4,
    ease: 'power2.in'
  })

  // Counter-rotate image back
  gsap.to(img, {
    rotationZ: -45,
    duration: 0.4,
    ease: 'power2.in'
  })

  gsap.to(invTooltipRef.value, {
    opacity: 0,
    y: 5,
    duration: 0.15,
    ease: 'power2.in'
  })
}

// Form data for each type
const formData = ref({
  url: '',
  image: '',
  wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
  vcard: { firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', website: '' },
  twitter: { username: '', tweet: '' },
  facebook: { url: '', pageId: '' },
  instagram: '',
  linkedin: '',
  tiktok: '',
  youtube: '',
  bluesky: '',
  whatsapp: '',
  snapchat: '',
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
  { value: 128, label: '128 x 128' },
  { value: 256, label: '256 x 256' },
  { value: 512, label: '512 x 512' },
  { value: 1024, label: '1024 x 1024' }
]

// Formatter map
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

const qrContent = computed(() => {
  const formatter = formatters[selectedType.value]
  return formatter ? formatter(formData.value) : ''
})

let debounceTimer = null

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

function debouncedGenerate() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(generate, 300)
}

watch([qrContent, size, fgColor, bgColor], debouncedGenerate)

onMounted(() => {
  if (headerRef.value) {
    gsap.fromTo(headerRef.value,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }
  if (formCardRef.value) {
    gsap.fromTo(formCardRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' }
    )
  }
  // Light chaser neon effect - comet-like glow travels along text at random intervals
  if (neonLabelRef.value) {
    const split = SplitText.create(neonLabelRef.value, { type: 'chars' })
    const chars = split.chars

    // Set initial dim state for all characters
    gsap.set(chars, {
      textShadow: '0 0 2px rgba(245, 184, 0, 0.3)',
      color: 'rgba(245, 184, 0, 0.4)'
    })

    // Function to create and play the chaser animation
    const playChaser = () => {
      const chaserTl = gsap.timeline({
        onComplete: () => {
          // Random delay between 2-6 seconds before next play
          const randomDelay = 2 + Math.random() * 4
          gsap.delayedCall(randomDelay, playChaser)
        }
      })

      // Comet effect - bright head with fading tail
      chars.forEach((char, i) => {
        const startTime = i * 0.03

        // Leading bright flash (comet head)
        chaserTl.to(char, {
          textShadow: '0 0 5px #fff, 0 0 15px #f5b800, 0 0 30px #f5b800, 0 0 50px #f5b800, 0 0 70px rgba(245, 184, 0, 0.8)',
          color: '#ffffff',
          scale: 1.1,
          duration: 0.05,
          ease: 'power4.in'
        }, startTime)

        // Bright glow state
        chaserTl.to(char, {
          textShadow: '0 0 8px #f5b800, 0 0 20px #f5b800, 0 0 40px rgba(245, 184, 0, 0.6)',
          color: '#f5b800',
          scale: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, startTime + 0.05)

        // Fade to medium glow (tail)
        chaserTl.to(char, {
          textShadow: '0 0 4px rgba(245, 184, 0, 0.5)',
          color: 'rgba(245, 184, 0, 0.6)',
          duration: 0.2,
          ease: 'power1.out'
        }, startTime + 0.15)

        // Fade back to dim
        chaserTl.to(char, {
          textShadow: '0 0 2px rgba(245, 184, 0, 0.3)',
          color: 'rgba(245, 184, 0, 0.4)',
          duration: 0.3,
          ease: 'power1.out'
        }, startTime + 0.35)
      })
    }

    // Start the first animation after a short delay
    gsap.delayedCall(1, playChaser)
  }

  // Lightning effect - random flashes at random intervals
  if (lightningRef.value) {
    const lightningEl = lightningRef.value

    // Different lightning flash patterns
    const flashPatterns = [
      // Single bright flash
      () => {
        gsap.timeline()
          .to(lightningEl, { opacity: 0.8, duration: 0.05 })
          .to(lightningEl, { opacity: 0, duration: 0.15 })
      },
      // Double flash
      () => {
        gsap.timeline()
          .to(lightningEl, { opacity: 0.7, duration: 0.04 })
          .to(lightningEl, { opacity: 0.1, duration: 0.08 })
          .to(lightningEl, { opacity: 0.9, duration: 0.03 })
          .to(lightningEl, { opacity: 0, duration: 0.2 })
      },
      // Triple stutter flash
      () => {
        gsap.timeline()
          .to(lightningEl, { opacity: 0.5, duration: 0.03 })
          .to(lightningEl, { opacity: 0.1, duration: 0.05 })
          .to(lightningEl, { opacity: 0.8, duration: 0.03 })
          .to(lightningEl, { opacity: 0.2, duration: 0.06 })
          .to(lightningEl, { opacity: 0.6, duration: 0.04 })
          .to(lightningEl, { opacity: 0, duration: 0.25 })
      },
      // Slow rumble flash
      () => {
        gsap.timeline()
          .to(lightningEl, { opacity: 0.3, duration: 0.1 })
          .to(lightningEl, { opacity: 0.5, duration: 0.15 })
          .to(lightningEl, { opacity: 0.2, duration: 0.1 })
          .to(lightningEl, { opacity: 0, duration: 0.3 })
      }
    ]

    // Function to trigger random lightning
    const triggerLightning = () => {
      // Pick a random flash pattern
      const pattern = flashPatterns[Math.floor(Math.random() * flashPatterns.length)]

      // Randomize the gradient position for variety
      const xPos = 20 + Math.random() * 60 // 20% to 80%
      gsap.set(lightningEl, {
        background: `radial-gradient(ellipse at ${xPos}% 0%, rgba(255, 255, 255, 0.95) 0%, rgba(200, 220, 255, 0.5) 30%, transparent 60%)`
      })

      // Play the flash
      pattern()

      // Schedule next lightning at random interval (5-15 seconds)
      const nextDelay = 5 + Math.random() * 10
      gsap.delayedCall(nextDelay, triggerLightning)
    }

    // Start first lightning after random delay (3-8 seconds)
    gsap.delayedCall(3 + Math.random() * 5, triggerLightning)
  }

  // Invisionnaire logo idle animation - gentle bobbing + particles
  if (invWrapperRef.value) {
    gsap.to(invWrapperRef.value, {
      y: -8,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })

    // Create floating particles - white squares bursting from center
    const particlesContainer = invWrapperRef.value.querySelector('.inv-particles')
    if (particlesContainer) {
      const particleCount = 8

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span')
        particle.className = 'inv-particle'
        particlesContainer.appendChild(particle)

        // Random size for each particle (4px to 10px)
        const size = 4 + Math.random() * 6
        particle.style.width = size + 'px'
        particle.style.height = size + 'px'

        // Animation function for this particle
        const animateParticle = () => {
          // Random angle for outward direction
          const angle = Math.random() * Math.PI * 2
          const distance = 40 + Math.random() * 50
          const endX = Math.cos(angle) * distance
          const endY = Math.sin(angle) * distance

          // Random lifetime (1.5 to 3.5 seconds)
          const duration = 1.5 + Math.random() * 2

          // Start from center
          gsap.set(particle, {
            x: 0,
            y: 0,
            scale: 0.5 + Math.random() * 1,
            opacity: 0
          })

          gsap.timeline({
            onComplete: () => {
              // Random delay before next burst (0.5 to 2 seconds)
              gsap.delayedCall(0.5 + Math.random() * 1.5, animateParticle)
            }
          })
            .to(particle, {
              opacity: 1,
              duration: 0.2,
              ease: 'power1.in'
            })
            .to(particle, {
              x: endX,
              y: endY,
              scale: 0.2,
              opacity: 0,
              duration: duration,
              ease: 'power2.out'
            }, '<0.1')
        }

        // Stagger the initial start
        gsap.delayedCall(i * 0.3, animateParticle)
      }
    }
  }
})

onUnmounted(() => clearTimeout(debounceTimer))
</script>

<template>
  <!-- Lightning effect layer (above GIF, below overlay) -->
  <div ref="lightningRef" class="lightning-layer"></div>
  <!-- Dark overlay -->
  <div class="dark-overlay"></div>

  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyber-card focus:border focus:border-gold focus:font-semibold focus:text-gold">
    Skip to main content
  </a>
  <div class="min-h-screen px-5 pt-10 pb-5 flex flex-col items-center max-md:px-4 max-sm:px-3">
    <!-- Header -->
    <header ref="headerRef" class="text-center mb-10 w-full flex flex-col items-center justify-center">
      <p ref="neonLabelRef" class="section-label mb-4">QR Generator</p>
      <h1 class="title-display text-2xl md:text-3xl lg:text-4xl text-gold m-0 mb-4 whitespace-nowrap text-center">
        NO LIMITS, ONLY QR CODES.
      </h1>
      <p class="header-subtitle font-display text-xs md:text-sm text-white m-0 whitespace-nowrap uppercase font-medium tracking-wider text-center">
        Generate QR codes instantly in your browser. 100% private, no uploads, completely free.
      </p>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="w-full max-w-6xl" aria-label="QR Code Generator">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <!-- Content Card -->
        <div ref="formCardRef" class="card-cipher has-marquee h-full flex flex-col">
          <div class="danger-marquee" aria-hidden="true"></div>
          <div class="card-cipher-header">
            <span class="indicator"></span>
            <span class="title">Input Module</span>
          </div>
          <div class="card-cipher-body flex-1">
            <!-- Type Selection -->
            <div class="mb-5">
              <div class="flex flex-wrap gap-2" role="group" aria-label="QR code type selection">
                <button
                  v-for="type in qrTypesGeneral"
                  :key="type.id"
                  @click="selectedType = type.id"
                  :aria-pressed="selectedType === type.id"
                  :class="['type-btn', selectedType === type.id ? 'active' : '']"
                >
                  <i :class="type.icon" aria-hidden="true"></i>
                  {{ type.label }}
                </button>
              </div>

              <div class="divider-cipher">
                <span>Social</span>
              </div>

              <div class="flex flex-wrap gap-2" role="group" aria-label="Social media QR code types">
                <button
                  v-for="type in qrTypesSocial"
                  :key="type.id"
                  @click="selectedType = type.id"
                  :title="type.label"
                  :aria-label="`Select ${type.label} QR code type`"
                  :aria-pressed="selectedType === type.id"
                  :class="['type-btn-icon', selectedType === type.id ? 'active' : '']"
                >
                  <i :class="type.icon" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <!-- Dynamic Forms -->
            <div class="space-y-4">
              <!-- URL Form -->
              <div v-if="selectedType === 'url'">
                <label for="input-url" class="label-cipher">URL</label>
                <input id="input-url" type="url" v-model="formData.url" placeholder="https://example.com" class="input-cipher" autocomplete="url" />
              </div>

              <!-- WiFi Form -->
              <div v-else-if="selectedType === 'wifi'" class="space-y-3">
                <div>
                  <label for="input-ssid" class="label-cipher">Network Name (SSID)</label>
                  <input id="input-ssid" type="text" v-model="formData.wifi.ssid" placeholder="MyWiFiNetwork" class="input-cipher" />
                </div>
                <div>
                  <label for="input-wifi-password" class="label-cipher">Password</label>
                  <input id="input-wifi-password" type="text" v-model="formData.wifi.password" placeholder="Enter password" class="input-cipher" autocomplete="off" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="input-security" class="label-cipher">Security</label>
                    <select id="input-security" v-model="formData.wifi.security" class="input-cipher">
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                  <div class="flex items-end pb-1">
                    <label class="checkbox-cipher">
                      <input id="input-hidden" type="checkbox" v-model="formData.wifi.hidden" />
                      Hidden Network
                    </label>
                  </div>
                </div>
              </div>

              <!-- vCard Form -->
              <div v-else-if="selectedType === 'vcard'" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="input-firstname" class="label-cipher">First Name</label>
                    <input id="input-firstname" type="text" v-model="formData.vcard.firstName" placeholder="John" class="input-cipher" autocomplete="given-name" />
                  </div>
                  <div>
                    <label for="input-lastname" class="label-cipher">Last Name</label>
                    <input id="input-lastname" type="text" v-model="formData.vcard.lastName" placeholder="Doe" class="input-cipher" autocomplete="family-name" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="input-phone" class="label-cipher">Phone</label>
                    <input id="input-phone" type="tel" v-model="formData.vcard.phone" placeholder="+1 234 567 8900" class="input-cipher" autocomplete="tel" />
                  </div>
                  <div>
                    <label for="input-email" class="label-cipher">Email</label>
                    <input id="input-email" type="email" v-model="formData.vcard.email" placeholder="john@example.com" class="input-cipher" autocomplete="email" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="input-org" class="label-cipher">Organization</label>
                    <input id="input-org" type="text" v-model="formData.vcard.organization" placeholder="Company Inc." class="input-cipher" autocomplete="organization" />
                  </div>
                  <div>
                    <label for="input-title" class="label-cipher">Title</label>
                    <input id="input-title" type="text" v-model="formData.vcard.title" placeholder="Software Engineer" class="input-cipher" autocomplete="organization-title" />
                  </div>
                </div>
                <div>
                  <label for="input-website" class="label-cipher">Website</label>
                  <input id="input-website" type="url" v-model="formData.vcard.website" placeholder="https://example.com" class="input-cipher" autocomplete="url" />
                </div>
              </div>

              <!-- Twitter Form -->
              <div v-else-if="selectedType === 'twitter'" class="space-y-3">
                <div>
                  <label for="input-twitter-user" class="label-cipher">Username (for profile link)</label>
                  <input id="input-twitter-user" type="text" v-model="formData.twitter.username" placeholder="@username" class="input-cipher" />
                </div>
                <div class="divider-cipher"><span>or</span></div>
                <div>
                  <label for="input-tweet" class="label-cipher">Tweet Text (for tweet intent)</label>
                  <textarea id="input-tweet" v-model="formData.twitter.tweet" rows="2" placeholder="Check out this awesome site!" class="input-cipher resize-none"></textarea>
                </div>
              </div>

              <!-- Facebook Form -->
              <div v-else-if="selectedType === 'facebook'" class="space-y-3">
                <div>
                  <label for="input-fb-url" class="label-cipher">Facebook URL</label>
                  <input id="input-fb-url" type="url" v-model="formData.facebook.url" placeholder="https://facebook.com/yourpage" class="input-cipher" autocomplete="url" />
                </div>
                <div class="divider-cipher"><span>or</span></div>
                <div>
                  <label for="input-fb-id" class="label-cipher">Page/Profile ID</label>
                  <input id="input-fb-id" type="text" v-model="formData.facebook.pageId" placeholder="yourpage" class="input-cipher" />
                </div>
              </div>

              <!-- Instagram Form -->
              <div v-else-if="selectedType === 'instagram'">
                <label for="input-instagram" class="label-cipher">Instagram Username or URL</label>
                <input id="input-instagram" type="text" v-model="formData.instagram" placeholder="@username or https://instagram.com/username" class="input-cipher" />
              </div>

              <!-- LinkedIn Form -->
              <div v-else-if="selectedType === 'linkedin'">
                <label for="input-linkedin" class="label-cipher">LinkedIn Username or URL</label>
                <input id="input-linkedin" type="text" v-model="formData.linkedin" placeholder="username or https://linkedin.com/in/username" class="input-cipher" />
              </div>

              <!-- TikTok Form -->
              <div v-else-if="selectedType === 'tiktok'">
                <label for="input-tiktok" class="label-cipher">TikTok Username or URL</label>
                <input id="input-tiktok" type="text" v-model="formData.tiktok" placeholder="@username or https://tiktok.com/@username" class="input-cipher" />
              </div>

              <!-- YouTube Form -->
              <div v-else-if="selectedType === 'youtube'">
                <label for="input-youtube" class="label-cipher">YouTube Channel or URL</label>
                <input id="input-youtube" type="text" v-model="formData.youtube" placeholder="@channel or https://youtube.com/@channel" class="input-cipher" />
              </div>

              <!-- Bluesky Form -->
              <div v-else-if="selectedType === 'bluesky'">
                <label for="input-bluesky" class="label-cipher">Bluesky Handle or URL</label>
                <input id="input-bluesky" type="text" v-model="formData.bluesky" placeholder="username.bsky.social" class="input-cipher" />
              </div>

              <!-- WhatsApp Form -->
              <div v-else-if="selectedType === 'whatsapp'">
                <label for="input-whatsapp" class="label-cipher">WhatsApp Phone Number</label>
                <input id="input-whatsapp" type="tel" v-model="formData.whatsapp" placeholder="+1 234 567 8900" class="input-cipher" autocomplete="tel" />
                <p class="helper-text">Include country code for international numbers</p>
              </div>

              <!-- Snapchat Form -->
              <div v-else-if="selectedType === 'snapchat'">
                <label for="input-snapchat" class="label-cipher">Snapchat Username or URL</label>
                <input id="input-snapchat" type="text" v-model="formData.snapchat" placeholder="username" class="input-cipher" />
              </div>

              <!-- App Stores Form -->
              <div v-else-if="selectedType === 'appstore'" class="space-y-3">
                <div>
                  <label for="input-ios-url" class="label-cipher"><i class="fa-brands fa-apple mr-1" aria-hidden="true"></i> App Store URL (iOS)</label>
                  <input id="input-ios-url" type="url" v-model="formData.appstore.iosUrl" placeholder="https://apps.apple.com/app/id123456" class="input-cipher" autocomplete="url" />
                </div>
                <div>
                  <label for="input-android-url" class="label-cipher"><i class="fa-brands fa-google-play mr-1" aria-hidden="true"></i> Play Store URL (Android)</label>
                  <input id="input-android-url" type="url" v-model="formData.appstore.androidUrl" placeholder="https://play.google.com/store/apps/details?id=com.app" class="input-cipher" autocomplete="url" />
                </div>
                <p class="helper-text">Note: QR will link to iOS URL if both are provided</p>
              </div>

              <!-- Image Form -->
              <div v-else-if="selectedType === 'image'">
                <label for="input-image" class="label-cipher">Image URL</label>
                <input id="input-image" type="url" v-model="formData.image" placeholder="https://example.com/image.png" class="input-cipher" autocomplete="url" />
                <p class="helper-text">Link to a hosted image file</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="h-full">
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
            @showHelp="showHelp = true"
          />
        </div>
      </div>
    </main>
  </div>

  <!-- Invisionnaire Logo - Fixed Bottom Right -->
  <!-- Wrapper handles positioning and bobbing; tooltip is sibling to logo so it won't flip -->
  <div
    ref="invWrapperRef"
    class="inv-logo-wrapper"
    @mouseenter="showInvTooltip"
    @mouseleave="hideInvTooltip"
  >
    <div class="inv-particles" aria-hidden="true"></div>
    <span ref="invTooltipRef" class="inv-tooltip">Go to website</span>
    <a
      ref="invLogoRef"
      href="https://invisionnaire.com"
      target="_blank"
      rel="noopener noreferrer"
      class="inv-logo-fixed"
      aria-label="Visit Invisionnaire"
    >
      <img src="/inv-logo-pixel.png" alt="Invisionnaire" />
    </a>
  </div>

  <!-- Help Modal -->
  <Teleport to="body">
    <div
      v-if="showHelp"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      @click="showHelp = false"
      @keydown.escape="showHelp = false"
    >
      <div class="card-cipher max-w-lg w-full max-h-[90vh] overflow-auto" @click.stop>
        <div class="card-cipher-header justify-between">
          <div class="flex items-center gap-2">
            <span class="indicator"></span>
            <span id="help-modal-title" class="title">How It Works</span>
          </div>
          <button
            @click="showHelp = false"
            class="text-lg text-text-secondary hover:text-gold bg-transparent border-none cursor-pointer transition-colors"
            aria-label="Close help dialog"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="p-6 space-y-5">
          <div class="flex gap-4">
            <span class="font-display text-gold text-2xl font-bold">01</span>
            <div>
              <p class="m-0 font-display text-gold uppercase tracking-wider text-sm mb-1">Select a Type</p>
              <p class="m-0 text-text-secondary text-sm">Choose from URL, vCard, WiFi, social profiles, and more.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <span class="font-display text-gold text-2xl font-bold">02</span>
            <div>
              <p class="m-0 font-display text-gold uppercase tracking-wider text-sm mb-1">Fill the Form</p>
              <p class="m-0 text-text-secondary text-sm">Enter the required information for your selected type.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <span class="font-display text-gold text-2xl font-bold">03</span>
            <div>
              <p class="m-0 font-display text-gold uppercase tracking-wider text-sm mb-1">Download</p>
              <p class="m-0 text-text-secondary text-sm">Customize colors and size, then download as PNG or SVG.</p>
            </div>
          </div>
          <div class="mt-6 border border-gold/30 p-4">
            <p class="m-0 font-display text-gold uppercase tracking-wider text-sm flex items-center gap-2">
              <i class="fa-solid fa-shield-halved"></i>
              100% Private
            </p>
            <p class="m-0 mt-2 text-sm text-text-secondary">
              Your data never leaves your device. Everything happens in your browser — no uploads, no servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

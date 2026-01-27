import { ref } from 'vue'
import QRCode from 'qrcode'

export function useQRCode() {
  const qrDataUrl = ref('')
  const qrSvg = ref('')
  const error = ref('')
  const isGenerating = ref(false)

  async function generateQR(data, options = {}) {
    if (!data || data.trim() === '') {
      qrDataUrl.value = ''
      qrSvg.value = ''
      return
    }

    isGenerating.value = true
    error.value = ''

    const defaultOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M',
      ...options
    }

    try {
      // Generate PNG data URL
      qrDataUrl.value = await QRCode.toDataURL(data, defaultOptions)

      // Generate SVG string
      qrSvg.value = await QRCode.toString(data, { ...defaultOptions, type: 'svg' })
    } catch (err) {
      error.value = err.message
      qrDataUrl.value = ''
      qrSvg.value = ''
    } finally {
      isGenerating.value = false
    }
  }

  function downloadPNG(filename = 'qrcode.png') {
    if (!qrDataUrl.value) return

    const link = document.createElement('a')
    link.download = filename
    link.href = qrDataUrl.value
    link.click()
  }

  function downloadSVG(filename = 'qrcode.svg') {
    if (!qrSvg.value) return

    const blob = new Blob([qrSvg.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    qrDataUrl,
    qrSvg,
    error,
    isGenerating,
    generateQR,
    downloadPNG,
    downloadSVG
  }
}

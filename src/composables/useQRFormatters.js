/**
 * QR Code Data Formatters
 * Generates properly formatted strings for different QR code types
 */

/**
 * Format WiFi configuration string
 * @param {Object} data - { ssid, password, security, hidden }
 * @returns {string} WiFi config string
 */
export function formatWifi(data) {
  const { ssid, password, security = 'WPA', hidden = false } = data
  if (!ssid) return ''

  const hiddenStr = hidden ? 'H:true;' : ''
  const securityStr = security === 'nopass' ? 'nopass' : security

  return `WIFI:T:${securityStr};S:${escapeWifiString(ssid)};P:${escapeWifiString(password || '')};${hiddenStr};`
}

/**
 * Escape special characters for WiFi QR strings
 */
function escapeWifiString(str) {
  return str.replace(/[\\;,:]/g, '\\$&')
}

/**
 * Format mailto URI
 * @param {Object} data - { to, subject, body }
 * @returns {string} mailto URI
 */
export function formatEmail(data) {
  const { to, subject, body } = data
  if (!to) return ''

  const params = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)

  return params.length > 0
    ? `mailto:${to}?${params.join('&')}`
    : `mailto:${to}`
}

/**
 * Format SMS URI
 * @param {Object} data - { phone, message }
 * @returns {string} sms URI
 */
export function formatSms(data) {
  const { phone, message } = data
  if (!phone) return ''

  const cleanPhone = phone.replace(/\s/g, '')
  return message
    ? `sms:${cleanPhone}?body=${encodeURIComponent(message)}`
    : `sms:${cleanPhone}`
}

/**
 * Format vCard 3.0
 * @param {Object} data - { firstName, lastName, phone, email, organization, title, website }
 * @returns {string} vCard format
 */
export function formatVCard(data) {
  const { firstName, lastName, phone, email, organization, title, website } = data
  if (!firstName && !lastName) return ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ]

  if (firstName || lastName) {
    lines.push(`N:${lastName || ''};${firstName || ''};;;`)
    lines.push(`FN:${[firstName, lastName].filter(Boolean).join(' ')}`)
  }

  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`)
  if (email) lines.push(`EMAIL:${email}`)
  if (organization) lines.push(`ORG:${organization}`)
  if (title) lines.push(`TITLE:${title}`)
  if (website) lines.push(`URL:${website}`)

  lines.push('END:VCARD')

  return lines.join('\n')
}

/**
 * Format Bitcoin URI (BIP21)
 * @param {Object} data - { address, amount, label, message }
 * @returns {string} bitcoin URI
 */
export function formatBitcoin(data) {
  const { address, amount, label, message } = data
  if (!address) return ''

  const params = []
  if (amount) params.push(`amount=${amount}`)
  if (label) params.push(`label=${encodeURIComponent(label)}`)
  if (message) params.push(`message=${encodeURIComponent(message)}`)

  return params.length > 0
    ? `bitcoin:${address}?${params.join('&')}`
    : `bitcoin:${address}`
}

/**
 * Format Twitter URL
 * @param {Object} data - { username, tweet }
 * @returns {string} Twitter URL
 */
export function formatTwitter(data) {
  const { username, tweet } = data

  if (tweet) {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
  }

  if (username) {
    const cleanUsername = username.replace('@', '')
    return `https://twitter.com/${cleanUsername}`
  }

  return ''
}

/**
 * Format Facebook URL
 * @param {Object} data - { url, pageId }
 * @returns {string} Facebook URL
 */
export function formatFacebook(data) {
  const { url, pageId } = data

  if (url) return url
  if (pageId) return `https://facebook.com/${pageId}`

  return ''
}

/**
 * Format Instagram URL
 * @param {string} username - Instagram username or URL
 * @returns {string} Instagram URL
 */
export function formatInstagram(username) {
  if (!username) return ''
  if (username.startsWith('http')) return username
  const clean = username.replace('@', '')
  return `https://instagram.com/${clean}`
}

/**
 * Format LinkedIn URL
 * @param {string} username - LinkedIn username/URL or company page
 * @returns {string} LinkedIn URL
 */
export function formatLinkedin(username) {
  if (!username) return ''
  if (username.startsWith('http')) return username
  return `https://linkedin.com/in/${username}`
}

/**
 * Format TikTok URL
 * @param {string} username - TikTok username
 * @returns {string} TikTok URL
 */
export function formatTiktok(username) {
  if (!username) return ''
  if (username.startsWith('http')) return username
  const clean = username.replace('@', '')
  return `https://tiktok.com/@${clean}`
}

/**
 * Format YouTube URL
 * @param {string} channel - YouTube channel URL or handle
 * @returns {string} YouTube URL
 */
export function formatYoutube(channel) {
  if (!channel) return ''
  if (channel.startsWith('http')) return channel
  const clean = channel.replace('@', '')
  return `https://youtube.com/@${clean}`
}

/**
 * Format Bluesky URL
 * @param {string} handle - Bluesky handle
 * @returns {string} Bluesky URL
 */
export function formatBluesky(handle) {
  if (!handle) return ''
  if (handle.startsWith('http')) return handle
  const clean = handle.replace('@', '')
  return `https://bsky.app/profile/${clean}`
}

/**
 * Format WhatsApp URL
 * @param {string} phone - Phone number
 * @returns {string} WhatsApp URL
 */
export function formatWhatsapp(phone) {
  if (!phone) return ''
  if (phone.startsWith('http')) return phone
  const clean = phone.replace(/[\s\-\(\)]/g, '').replace('+', '')
  return `https://wa.me/${clean}`
}

/**
 * Format Snapchat URL
 * @param {string} username - Snapchat username
 * @returns {string} Snapchat URL
 */
export function formatSnapchat(username) {
  if (!username) return ''
  if (username.startsWith('http')) return username
  const clean = username.replace('@', '')
  return `https://snapchat.com/add/${clean}`
}


/**
 * Format App Store URLs
 * @param {Object} data - { iosUrl, androidUrl }
 * @returns {string} Store URL (prefers iOS if both provided)
 */
export function formatAppStore(data) {
  const { iosUrl, androidUrl } = data
  return iosUrl || androidUrl || ''
}

/**
 * Format phone number for tel: URI
 * @param {string} phone
 * @returns {string} tel URI
 */
export function formatPhone(phone) {
  if (!phone) return ''
  return `tel:${phone.replace(/\s/g, '')}`
}

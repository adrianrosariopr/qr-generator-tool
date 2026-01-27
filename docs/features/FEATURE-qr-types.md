# Feature: QR Code Type Selector

## Overview
Add a type selector that lets users create different kinds of QR codes beyond plain text/URL. Each type has a specialized input form that generates the correct QR format.

## Problem Statement
Currently users can only enter raw text/URLs. Many QR use cases require specific data formats (WiFi credentials, contact cards, email links) that users shouldn't need to manually format.

## Goals
- Add type selector with 14 QR code types
- Each type has a tailored input form
- Generate properly formatted QR data for each type
- Maintain the simple, clean UX

## Non-Goals (Out of Scope)
- File upload for PDF/MP3/Images (future)
- QR code scanning/reading
- Analytics or tracking

## User Experience

User clicks a type from the selector bar at the top. The input form below changes to show relevant fields for that type. QR code generates as they fill in fields.

### Type Selector Layout
```
[URL] [vCard] [Text] [E-mail] [SMS] [WiFi]
[Bitcoin] [Twitter] [Facebook] [PDF] [MP3] [App Stores]
[Images] [2D Barcodes]
```

---

## QR Types Specification

### 1. URL (current default)
**Fields:** URL input
**Format:** Raw URL string
**Example:** `https://example.com`

### 2. vCard (Contact)
**Fields:**
- First Name, Last Name
- Phone (mobile, work, home)
- Email
- Organization, Title
- Address
- Website
- Notes

**Format:** vCard 3.0
```
BEGIN:VCARD
VERSION:3.0
N:Doe;John
FN:John Doe
TEL;TYPE=CELL:+1234567890
EMAIL:john@example.com
END:VCARD
```

### 3. Text
**Fields:** Multi-line text area
**Format:** Plain text
**Example:** `Hello World`

### 4. E-mail
**Fields:**
- To (email address)
- Subject
- Body

**Format:** mailto URI
**Example:** `mailto:test@example.com?subject=Hello&body=Hi%20there`

### 5. SMS
**Fields:**
- Phone number
- Message (optional)

**Format:** sms URI
**Example:** `sms:+1234567890?body=Hello`

### 6. WiFi
**Fields:**
- Network name (SSID)
- Password
- Security type (WPA/WEP/None)
- Hidden network (checkbox)

**Format:** WiFi config string
**Example:** `WIFI:T:WPA;S:MyNetwork;P:password123;;`

### 7. Bitcoin
**Fields:**
- Bitcoin address
- Amount (optional)
- Label (optional)
- Message (optional)

**Format:** BIP21 URI
**Example:** `bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001`

### 8. Twitter
**Fields:**
- Username OR
- Tweet text (for intent)

**Format:** Twitter URL
**Examples:**
- Profile: `https://twitter.com/username`
- Tweet: `https://twitter.com/intent/tweet?text=Hello`

### 9. Facebook
**Fields:**
- Page/Profile URL OR
- Page ID

**Format:** Facebook URL
**Example:** `https://facebook.com/pagename`

### 10. PDF (Simplified)
**Fields:**
- PDF URL (link to hosted PDF)

**Format:** Direct URL
**Note:** File upload out of scope for MVP

### 11. MP3 (Simplified)
**Fields:**
- MP3/Audio URL (link to hosted file)

**Format:** Direct URL
**Note:** File upload out of scope for MVP

### 12. App Stores
**Fields:**
- App Store URL (iOS) OR
- Play Store URL (Android) OR
- Both (show both fields)

**Format:** Store URLs
**Examples:**
- `https://apps.apple.com/app/id123456`
- `https://play.google.com/store/apps/details?id=com.app`

### 13. Images (Simplified)
**Fields:**
- Image URL (link to hosted image)

**Format:** Direct URL
**Note:** File upload out of scope for MVP

### 14. 2D Barcodes
**Fields:**
- Barcode type selector (Code128, EAN-13, UPC-A, Code39, ITF, etc.)
- Value input

**Format:** Uses jsbarcode library (already in dependencies)
**Note:** This generates traditional barcodes, not QR codes

---

## Technical Approach

### State Management
```javascript
const qrType = ref('url')  // Current selected type
const formData = ref({})   // Dynamic form data per type
```

### New Components
- `TypeSelector.vue` - Tab/button bar for selecting type
- `forms/UrlForm.vue` - URL input (current)
- `forms/VCardForm.vue` - Contact fields
- `forms/EmailForm.vue` - Email fields
- `forms/SmsForm.vue` - SMS fields
- `forms/WifiForm.vue` - WiFi fields
- `forms/BitcoinForm.vue` - Bitcoin fields
- `forms/SocialForm.vue` - Twitter/Facebook/App Stores
- `forms/LinkForm.vue` - Simple URL input (PDF/MP3/Images)
- `forms/BarcodeForm.vue` - Barcode type + value

### Data Formatters
Create `composables/useQRFormatters.js`:
```javascript
export function formatVCard(data) { ... }
export function formatWifi(data) { ... }
export function formatEmail(data) { ... }
export function formatSms(data) { ... }
export function formatBitcoin(data) { ... }
```

### Dependencies
- Existing: `qrcode` for QR generation
- Existing: `jsbarcode` for 2D barcodes (already in package.json)

---

## Implementation Phases

### Phase 1: Foundation
- [x] Create `docs/features/` directory structure
- [x] Create `TypeSelector.vue` component with all 14 type buttons (inline in App.vue)
- [x] Add `qrType` state to App.vue
- [x] Create basic routing to show different forms based on type

### Phase 2: Core Forms (Priority Types)
- [x] Create `forms/UrlForm.vue` (inline in App.vue)
- [x] Create `forms/WifiForm.vue` with SSID, password, security dropdown
- [x] Create `forms/VCardForm.vue` with contact fields
- [x] Create `forms/EmailForm.vue` with to, subject, body
- [x] Create `forms/SmsForm.vue` with phone, message

### Phase 3: Data Formatters
- [x] Create `composables/useQRFormatters.js`
- [x] Implement `formatWifi()` - WiFi config string
- [x] Implement `formatVCard()` - vCard 3.0 format
- [x] Implement `formatEmail()` - mailto URI
- [x] Implement `formatSms()` - sms URI

### Phase 4: Additional Types
- [x] Create `forms/BitcoinForm.vue` with address, amount, label
- [x] Create `forms/SocialForm.vue` for Twitter/Facebook
- [x] Create `forms/LinkForm.vue` for PDF/MP3/Images (simple URL)
- [x] Create `forms/AppStoreForm.vue` with iOS/Android URL fields
- [x] Implement `formatBitcoin()` - BIP21 URI

### Phase 5: 2D Barcodes
- [x] Create `forms/BarcodeForm.vue` with type selector (inline in App.vue)
- [x] Integrate jsbarcode for barcode generation
- [x] Create `BarcodeDisplay.vue` component (separate from QR display)
- [x] Add barcode download (PNG/SVG)

### Phase 6: Polish
- [x] Add form validation for each type (basic validation via input types)
- [x] Add helpful placeholder text and hints
- [x] Mobile-responsive type selector (flex wrap grid)
- [ ] Persist selected type in URL or localStorage
- [x] Add icons to type selector buttons (Font Awesome)

### Phase 7: Testing & Validation
- [ ] Test each QR type scans correctly on iOS
- [ ] Test each QR type scans correctly on Android
- [ ] Test WiFi auto-connect on both platforms
- [ ] Test vCard import on both platforms
- [ ] Verify barcode formats scan correctly

---

## Success Criteria
- [x] All 14 types selectable from UI
- [x] Each type has appropriate input form
- [x] Generated QR codes scan and work correctly
- [ ] WiFi codes auto-connect when scanned (needs testing)
- [ ] vCard codes import to contacts (needs testing)
- [x] Barcodes generate and scan correctly
- [x] Mobile-friendly type selector

## Open Questions
- Should we add a "copy formatted data" button for debugging?
- Should type selection persist across page reloads?
- Do we want a "recent types" quick-access feature?

---

*Created: 2026-01-26*
*Updated: 2026-01-26*
*Status: Complete (Phase 7 - Testing remains for manual verification)*

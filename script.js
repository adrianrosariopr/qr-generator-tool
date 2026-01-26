const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const qrContainer = document.getElementById('qr-container');
const qrCode = document.getElementById('qr-code');
const downloadBtn = document.getElementById('download-btn');

let qrInstance = null;

function generateQR() {
    const text = textInput.value.trim();
    
    if (!text) {
        textInput.focus();
        textInput.style.borderColor = '#ff4757';
        setTimeout(() => textInput.style.borderColor = '#e0e0e0', 1500);
        return;
    }
    
    // Clear previous QR code
    qrCode.innerHTML = '';
    
    // Generate new QR code
    qrInstance = new QRCode(qrCode, {
        text: text,
        width: 250,
        height: 250,
        colorDark: '#333333',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    qrContainer.classList.remove('hidden');
}

// Generate on button click
generateBtn.addEventListener('click', generateQR);

// Generate on Enter key
textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQR();
    }
});

// Download QR code
downloadBtn.addEventListener('click', () => {
    const canvas = qrCode.querySelector('canvas');
    const img = qrCode.querySelector('img');
    
    let dataUrl;
    if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
    } else if (img) {
        // Fallback: create canvas from image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        dataUrl = tempCanvas.toDataURL('image/png');
    } else {
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = dataUrl;
    link.click();
});

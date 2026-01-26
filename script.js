const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const qrContainer = document.getElementById('qr-container');
const qrCode = document.getElementById('qr-code');
const downloadBtn = document.getElementById('download-btn');

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
    QRCode.toCanvas(text, {
        width: 250,
        margin: 2,
        color: {
            dark: '#333333',
            light: '#ffffff'
        }
    }, (error, canvas) => {
        if (error) {
            console.error(error);
            return;
        }
        qrCode.appendChild(canvas);
        qrContainer.classList.remove('hidden');
    });
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
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

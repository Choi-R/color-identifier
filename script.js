/**
 * ChoiPixel - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadZone = document.getElementById('upload-zone');
    const imageInput = document.getElementById('image-input');
    const editorArea = document.getElementById('editor-area');
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const magnifier = document.getElementById('magnifier');
    const previewLocked = document.getElementById('preview-locked');
    const previewHover = document.getElementById('preview-hover');
    const hexInput = document.getElementById('hex-value');
    const rgbInput = document.getElementById('rgb-value');
    const resetBtn = document.getElementById('reset-btn');
    const toast = document.getElementById('toast');

    // State
    let isImageLoaded = false;
    let isLocked = false;

    let canvasRect = null;
    let scaleX = 1;
    let scaleY = 1;

    // --- Event Listeners ---

    // Upload Zone
    uploadZone.addEventListener('click', () => imageInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    imageInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Paste Support
    document.addEventListener('paste', handlePaste);

    // Canvas Interactions
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => {
        magnifier.classList.add('hidden');
    });
    canvas.addEventListener('click', toggleLock);

    // Copy Buttons
    document.getElementById('copy-hex').addEventListener('click', () => copyToClipboard(hexInput.value));
    document.getElementById('copy-rgb').addEventListener('click', () => copyToClipboard(rgbInput.value));

    // Reset
    resetBtn.addEventListener('click', resetApp);

    // Window Resize
    window.addEventListener('resize', () => {
        if (isImageLoaded) updateCanvasMetrics();
    });

    // --- Core Functions ---

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => loadImage(e.target.result);
                reader.readAsDataURL(file);
            } else {
                showToast('Please upload a valid image file', true);
            }
        }
    }

    function handlePaste(e) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => loadImage(event.target.result);
                reader.readAsDataURL(blob);
                return; // Only load the first image found
            }
        }
    }

    function loadImage(src) {
        const img = new Image();
        img.onload = () => {
            renderToCanvas(img);
            showEditor();
        };
        img.src = src;
    }

    function renderToCanvas(img) {
        // Reset state
        isLocked = false;
        magnifier.dataset.imgSrc = '';
        magnifier.style.backgroundImage = 'none';

        // Set canvas to actual image dimensions for precision
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Prepare magnifier background (optimization)
        magnifier.style.backgroundImage = `url(${canvas.toDataURL()})`;
        magnifier.style.backgroundRepeat = 'no-repeat';
        magnifier.dataset.imgSrc = 'set';

        isImageLoaded = true;
        // Update metrics after a brief delay to ensure layout rendering
        requestAnimationFrame(updateCanvasMetrics);
    }

    function updateCanvasMetrics() {
        canvasRect = canvas.getBoundingClientRect();
        scaleX = canvas.width / canvasRect.width;
        scaleY = canvas.height / canvasRect.height;
    }

    function showEditor() {
        uploadZone.classList.add('hidden'); // Or style it to be hidden
        uploadZone.style.display = 'none';
        editorArea.classList.remove('hidden');
        editorArea.style.display = 'grid'; // Ensure grid display
    }

    function resetApp() {
        isImageLoaded = false;
        isLocked = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Show Upload Zone
        uploadZone.classList.remove('hidden');
        uploadZone.style.display = ''; // Clear inline style

        // Hide Editor Area
        editorArea.classList.add('hidden');
        editorArea.style.display = 'none'; // Ensure it is hidden

        imageInput.value = ''; // Reset input
    }

    function handleMouseMove(e) {
        if (!isImageLoaded) return;

        // Recalculate metrics occasionally to be safe, or rely on resize event
        if (!canvasRect) updateCanvasMetrics();

        const x = (e.clientX - canvasRect.left) * scaleX;
        const y = (e.clientY - canvasRect.top) * scaleY;

        // Clamp coordinates
        const clampedX = Math.max(0, Math.min(x, canvas.width - 1));
        const clampedY = Math.max(0, Math.min(y, canvas.height - 1));

        // Get pixel data
        const pixel = ctx.getImageData(clampedX, clampedY, 1, 1).data;
        const [r, g, b, a] = pixel;

        // Update UI
        updateColorDisplay(r, g, b);
        updateMagnifier(e.clientX, e.clientY, clampedX, clampedY);
    }

    function updateColorDisplay(r, g, b) {
        const hex = rgbToHex(r, g, b);
        const rgb = `rgb(${r}, ${g}, ${b})`;

        // Always update Hover view
        previewHover.style.backgroundColor = rgb;

        // If NOT locked, update Locked view and values to mirror current selection
        if (!isLocked) {
            previewLocked.style.backgroundColor = rgb;
            hexInput.value = hex;
            rgbInput.value = rgb;
        }
    }

    function updateMagnifier(mouseX, mouseY, imageX, imageY) {
        magnifier.classList.remove('hidden');

        // Magnifier position (follow cursor)
        // Offset it slightly so it doesn't block the cursor
        const offset = 20;
        magnifier.style.left = `${mouseX + offset}px`;
        magnifier.style.top = `${mouseY - offset}px`;


        const zoomLevel = 4; // 4x zoom
        const bgWidth = canvasRect.width * zoomLevel;
        const bgHeight = canvasRect.height * zoomLevel;

        magnifier.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;

        // Calculate background position
        // We need to shift the background so that the point (imageX, imageY) is at the center of the magnifier.
        // Relative position of point on the displayed canvas:
        const relX = (mouseX - canvasRect.left);
        const relY = (mouseY - canvasRect.top);

        // The background position needs to be negative to shift the image.
        // pos_x = - (relX * zoomLevel - magnifierWidth/2)
        const bgPosX = -(relX * zoomLevel - magnifier.offsetWidth / 2);
        const bgPosY = -(relY * zoomLevel - magnifier.offsetHeight / 2);

        magnifier.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

        // Optional: Add a crosshair in CSS (done via border or pseudo element)
    }

    function resetMagnifier() {
        magnifier.dataset.imgSrc = '';
        magnifier.style.backgroundImage = 'none';
    }

    // --- Helpers ---

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${text}`);
        });
    }

    function toggleLock(e) {
        isLocked = !isLocked;
        if (isLocked) {
            // Force one last update to ensure we grabbed specific pixel if it was a click
            handleMouseMove(e);
            showToast("Color Selection Locked");
            previewLocked.style.borderColor = "#22c55e"; // Green border to show locked
        } else {
            showToast("Unlocked");
            previewLocked.style.borderColor = "var(--border-color)";
            handleMouseMove(e); // Update immediately to new pos
        }
    }

    function showToast(msg, isError = false) {
        toast.textContent = msg;
        toast.style.backgroundColor = isError ? '#ef4444' : '#22c55e';
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2000);
    }
});

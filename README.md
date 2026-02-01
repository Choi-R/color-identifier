# ChoiPixel - Premium Image Color Identifier 🎨

ChoiPixel is a sleek, high-performance web application that allows users to extract precise color data from any image. Built entirely with **Vanilla JavaScript, HTML5, and CSS3**, it demonstrates the power of modern web standards without the bloat of external libraries.

![Project Preview](https://via.placeholder.com/1200x600/0f172a/3b82f6?text=ChoiPixel+Preview)
*(Note: Replace with actual screenshot)*

## ✨ Key Features

- **Zero Dependencies**: Lightweight and fast, built using only native web technologies.
- **Smart Image Upload**: 
    - Drag & Drop support.
    - File browsing.
    - **Clipboard Paste (Ctrl+V)** support for instant workflow.
- **Precision Color Picking**:
    - **10x Magnifier Loupe**: Pixel-perfect selection with a crisp, pixelated zoom view.
    - **Dual Visual Preview**: View your 'Locked' selection alongside a real-time 'Live' hover preview.
    - **Lock Mode**: Click to freeze the color selection to easily copy values.
- **Color Formats**: Instant access to **HEX** and **RGB** values with one-click copying.
- **Premium UI/UX**:
    - Dark mode aesthetics with glassmorphism elements.
    - Smooth animations and transitions.
    - Fully responsive design for all devices.

## 🛠️ Technology Stack

- **Core**: HTML5, CSS3, ES6+ JavaScript
- **Rendering**: HTML5 Canvas API
- **Deployment**: Designed for Cloudflare Workers Assets (Static Site)

## 🚀 Getting Started

### Prerequisites
You need a modern web browser to run this application. No installation is required.

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/choi-pixel/pixelpick.git
   ```
2. Open `index.html` in your browser.
   
   *Or use a local server for the best experience:*
   ```bash
   npx serve .
   ```

### Deployment (Cloudflare)
This project is configured for Cloudflare Pages / Workers Assets.

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```
2. Deploy:
   ```bash
   wrangler deploy
   ```

## 🎮 How to Use

1. **Upload**: Drag an image onto the drop zone, or simply press `Ctrl+V` to paste an image from your clipboard.
2. **Explore**: Hover over the image. A magnifier will appear to help you pick the exact pixel.
3. **Lock**: Click anywhere on the image to **Lock** that color. The 'Selected' preview will freeze.
4. **Copy**: Click the copy icons next to the HEX or RGB values.
5. **Resume**: Click the image again to unlock, or click "Pick Another Image" to reset.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Built with ❤️ by Choi*

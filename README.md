# FrameSpeak - AI Video Frame Analysis Tool

English | [简体中文](./README.zh-CN.md)

FrameSpeak is a browser-based video analysis application that extracts frames from videos and uses local LLM services to generate bilingual (Chinese & English) descriptions for each frame. Perfect for creating high-quality prompts for AI image generation models like Stable Diffusion, Midjourney, and DALL-E.

## ✨ Features

- 📹 **Video Upload**: Drag and drop or click to upload video files (MP4, AVI, MOV, etc.)
- 🎬 **Frame Extraction**: Extract frames at customizable intervals (3, 5, or 10 seconds)
- 🤖 **AI Analysis**: Generate detailed image descriptions using local LLM services
- 🌏 **Bilingual Output**: Get descriptions in both English and Chinese
- 💾 **Local Storage**: All configurations and extracted frames are stored locally in the browser
- ⚡ **Batch Processing**: Analyze all frames at once or individually
- 🔌 **Multiple LLM Support**: Works with Ollama, OpenAI, LM Studio, and custom endpoints

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design
- **State Management**: Zustand
- **Storage**: IndexedDB (for images) + localStorage (for config)
- **HTTP Client**: Axios
- **Internationalization**: i18next

## 📋 Prerequisites

- Node.js 18+ and npm
- A local LLM service with vision capabilities:
  - **Ollama** with llava model (recommended)
  - **LM Studio** with a vision model
  - **OpenAI API** access
  - Any OpenAI-compatible API

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/1433744303/FrameSpeak.git
cd FrameSpeak

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run at `http://localhost:5173`

### Build and Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
bash deploy.sh
```

### Setting up Ollama (Recommended)

1. Install Ollama from https://ollama.ai
2. Pull the llava model:
```bash
ollama pull llava
```
3. The default configuration in FrameSpeak will work automatically

### Setting up LM Studio

1. Install LM Studio from https://lmstudio.ai
2. Download a vision-capable model (e.g., llava)
3. Start the local server in LM Studio
4. Configure FrameSpeak to use `http://localhost:1234/v1/chat/completions`

### Setting up OpenAI

1. Get your API key from https://platform.openai.com/api-keys
2. Configure FrameSpeak with your API key
3. Select `gpt-4-vision-preview` or compatible vision model

## 📖 Usage

1. **Configure LLM**
   - Click "LLM Config" button in the header
   - Select your provider (Ollama/OpenAI/LM Studio/Custom)
   - Enter endpoint URL and model name
   - Test connection and save

2. **Upload Video**
   - Drag and drop a video file or click to browse
   - Supported formats: MP4, AVI, MOV, etc.
   - Maximum size: 500MB

3. **Extract Frames**
   - Select frame extraction interval (3, 5, or 10 seconds)
   - Click "Start Extraction"
   - Wait for extraction to complete

4. **Analyze Frames**
   - Click "Batch Analyze All" to analyze all frames at once
   - Or click "Analyze Image" on individual frames
   - Descriptions will be generated in both English and Chinese

5. **Copy and Use**
   - Click the copy button next to each description
   - Use the prompts in your favorite AI image generation tool

## ⚙️ Configuration

### LLM Settings

- **Provider**: Ollama, OpenAI, LM Studio, or Custom
- **API Endpoint**: URL of your LLM service
- **Model Name**: The model to use (e.g., `llava`, `gpt-4-vision-preview`)
- **API Key**: For OpenAI or other authenticated services
- **Temperature**: Controls output randomness (0.0 - 1.0)
- **Max Tokens**: Maximum length of generated descriptions
- **Custom Prompt**: Optional, customize the analysis prompt template

### Default Endpoints

- **Ollama**: `http://localhost:11434/api/chat`
- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **LM Studio**: `http://localhost:1234/v1/chat/completions`

## 🎨 Generated Description Format

The generated descriptions are optimized for AI image generation models and include:

- **Main Subject Details**: Detailed characteristics of people, objects
- **Action & Pose**: Precise actions, gestures, expressions
- **Composition & Framing**: Camera angles, shot types, composition rules
- **Background & Setting**: Detailed scene descriptions
- **Lighting**: Light source type, direction, quality
- **Color Palette**: Dominant colors, color schemes, temperature
- **Atmosphere**: Overall feeling, mood, weather
- **Art Style**: Photography or artistic style tags
- **Technical Details**: Depth of field, textures, material properties

## 📁 Project Structure

```
FrameSpeak/
├── src/
│   ├── components/          # React components
│   │   ├── VideoUploader.tsx
│   │   ├── FrameExtractor.tsx
│   │   ├── FrameGallery.tsx
│   │   ├── FrameCard.tsx
│   │   └── LLMConfigModal.tsx
│   ├── services/            # Business logic
│   │   ├── videoService.ts  # Video processing
│   │   ├── llmService.ts    # LLM API calls
│   │   └── storageService.ts # IndexedDB/localStorage
│   ├── stores/              # Zustand state management
│   │   ├── videoStore.ts
│   │   └── configStore.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── App.tsx              # Main component
├── package.json
└── vite.config.ts
```

## 🏗️ Build and Deploy

```bash
# Build production version
npm run build

# Preview production build
npm run preview
```

Build output will be in the `dist` directory.

## 🔧 Troubleshooting

### Cannot Connect to LLM Service

- Ensure your LLM service is running
- Check the endpoint URL is correct
- Verify firewall settings
- For Ollama, confirm the model is downloaded: `ollama list`

### Poor Description Quality

- Try adjusting the temperature parameter
- Increase max tokens for more detailed descriptions
- Use custom prompts to guide output format
- Ensure you're using a vision-capable model (e.g., llava, gpt-4-vision)

### Browser Storage Full

- Clear old frames and analysis results
- Click "Clear Video" to free up storage
- Consider reducing extraction interval to extract fewer frames

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires support for:
- IndexedDB
- Canvas API
- HTML5 Video
- FileReader API

## ⚡ Performance

- Frames are extracted at maximum 1280x720 resolution to save storage
- JPEG compression quality set to 85% for quality/size balance
- Maximum 100 frames per video
- IndexedDB used for efficient large blob storage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [Ollama](https://ollama.ai) - Local LLM runtime
- [LM Studio](https://lmstudio.ai) - Desktop LLM application
- [Ant Design](https://ant.design) - UI component library
- [Vite](https://vitejs.dev) - Frontend build tool

## 📮 Feedback & Support

For questions or suggestions, please [open an issue](https://github.com/1433744303/FrameSpeak/issues).

---

Built with ❤️ and React

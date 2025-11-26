# FrameSpeak - AI Video Frame Analysis Tool

FrameSpeak is a browser-based video analysis application that extracts frames from videos and uses local LLM services to generate bilingual (Chinese & English) descriptions for each frame.

## Features

- **Video Upload**: Drag and drop or click to upload video files (MP4, AVI, MOV, etc.)
- **Frame Extraction**: Extract frames at customizable intervals (3, 5, or 10 seconds)
- **AI Analysis**: Generate detailed image descriptions using local LLM services
- **Bilingual Output**: Get descriptions in both English and Chinese
- **Local Storage**: All configurations and extracted frames are stored locally in the browser
- **Batch Processing**: Analyze all frames at once or individually
- **Multiple LLM Support**: Works with Ollama, OpenAI, LM Studio, and custom endpoints

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design
- **State Management**: Zustand
- **Storage**: IndexedDB (for images) + localStorage (for config)
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A local LLM service with vision capabilities:
  - **Ollama** with llava model (recommended)
  - **LM Studio** with a vision model
  - **OpenAI API** access
  - Any OpenAI-compatible API

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
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

## Usage

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

## Project Structure

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

## Configuration

### LLM Providers

#### Ollama (Default)
```javascript
{
  provider: 'ollama',
  endpoint: 'http://localhost:11434/api/chat',
  model: 'llava:latest',
  temperature: 0.7,
  maxTokens: 500
}
```

#### OpenAI
```javascript
{
  provider: 'openai',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4-vision-preview',
  apiKey: 'your-api-key',
  temperature: 0.7,
  maxTokens: 500
}
```

#### LM Studio
```javascript
{
  provider: 'lmstudio',
  endpoint: 'http://localhost:1234/v1/chat/completions',
  model: 'local-model',
  temperature: 0.7,
  maxTokens: 500
}
```

## Performance Optimization

- Frames are extracted at a maximum resolution of 1280x720 to save storage
- JPEG compression quality is set to 85% to balance quality and size
- Maximum of 100 frames can be extracted per video
- IndexedDB is used for storing large image blobs

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires support for:
- IndexedDB
- Canvas API
- HTML5 Video
- FileReader API

## Known Limitations

- Maximum video size: 500MB
- Maximum frames per video: 100
- Frames are stored in browser storage (subject to browser quota limits)
- CORS issues may occur with some LLM services (requires proper CORS configuration)

## Troubleshooting

### LLM Connection Issues
- Ensure your LLM service is running
- Check CORS configuration (Ollama: `OLLAMA_ORIGINS=* ollama serve`)
- Verify the endpoint URL is correct

### Frame Extraction Slow
- Reduce extraction interval
- Use shorter videos
- Close other resource-intensive applications

### Storage Full
- Clear old videos using the "Clear Video" button
- Use browser DevTools to check IndexedDB usage

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
# FrameSpeak

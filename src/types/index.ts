export interface LLMConfig {
  endpoint: string;
  model: string;
  apiKey?: string;
  temperature: number;
  maxTokens: number;
  provider: 'ollama' | 'openai' | 'lmstudio' | 'custom';
  customPrompt?: string;
}

export interface VideoFrame {
  id: string;
  timestamp: number;
  imageUrl: string;
  imageBlob?: Blob;
  description?: {
    zh: string;
    en: string;
  };
  analyzing?: boolean;
}

export interface VideoInfo {
  id: string;
  name: string;
  duration: number;
  size: number;
  frames: VideoFrame[];
  createdAt: number;
}

export interface ExtractionConfig {
  interval: 3 | 5 | 10;
  maxFrames?: number;
}

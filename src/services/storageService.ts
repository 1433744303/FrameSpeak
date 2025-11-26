import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { LLMConfig, VideoInfo } from '../types';

interface FrameSpeakDB extends DBSchema {
  videos: {
    key: string;
    value: VideoInfo;
    indexes: { 'by-date': number };
  };
  frames: {
    key: string;
    value: {
      id: string;
      videoId: string;
      timestamp: number;
      imageBlob: Blob;
      description?: {
        zh: string;
        en: string;
      };
    };
    indexes: { 'by-video': string };
  };
}

class StorageService {
  private db: IDBPDatabase<FrameSpeakDB> | null = null;
  private readonly DB_NAME = 'FrameSpeakDB';
  private readonly DB_VERSION = 1;

  async init() {
    if (this.db) return this.db;

    try {
      this.db = await openDB<FrameSpeakDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // 创建视频存储
          if (!db.objectStoreNames.contains('videos')) {
            const videoStore = db.createObjectStore('videos', { keyPath: 'id' });
            videoStore.createIndex('by-date', 'createdAt');
          }

          // 创建帧存储
          if (!db.objectStoreNames.contains('frames')) {
            const frameStore = db.createObjectStore('frames', { keyPath: 'id' });
            frameStore.createIndex('by-video', 'videoId');
          }
        },
      });

      return this.db;
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      throw new Error('数据库初始化失败，请检查浏览器存储权限和配额。');
    }
  }

  // LLM配置管理（使用localStorage）
  saveLLMConfig(config: LLMConfig): void {
    localStorage.setItem('llm_config', JSON.stringify(config));
  }

  getLLMConfig(): LLMConfig | null {
    const configStr = localStorage.getItem('llm_config');
    return configStr ? JSON.parse(configStr) : null;
  }

  getDefaultLLMConfig(): LLMConfig {
    return {
      endpoint: 'http://localhost:11434/api/chat',
      model: 'llava:latest',
      temperature: 0.7,
      maxTokens: 4096,
      provider: 'ollama',
    };
  }

  // 视频信息管理
  async saveVideoInfo(video: VideoInfo): Promise<void> {
    const db = await this.init();
    await db.put('videos', video);
  }

  async getVideoInfo(videoId: string): Promise<VideoInfo | undefined> {
    const db = await this.init();
    return db.get('videos', videoId);
  }

  async getAllVideos(): Promise<VideoInfo[]> {
    const db = await this.init();
    return db.getAllFromIndex('videos', 'by-date');
  }

  async deleteVideo(videoId: string): Promise<void> {
    const db = await this.init();
    await db.delete('videos', videoId);

    // 删除关联的帧
    const frames = await db.getAllFromIndex('frames', 'by-video', videoId);
    for (const frame of frames) {
      await db.delete('frames', frame.id);
    }
  }

  // 帧数据管理
  async saveFrame(frame: {
    id: string;
    videoId: string;
    timestamp: number;
    imageBlob: Blob;
    description?: { zh: string; en: string };
  }): Promise<void> {
    const db = await this.init();
    await db.put('frames', frame);
  }

  async getFrame(frameId: string) {
    const db = await this.init();
    return db.get('frames', frameId);
  }

  async getVideoFrames(videoId: string) {
    const db = await this.init();
    return db.getAllFromIndex('frames', 'by-video', videoId);
  }

  async updateFrameDescription(
    frameId: string,
    description: { zh: string; en: string }
  ): Promise<void> {
    const db = await this.init();
    const frame = await db.get('frames', frameId);
    if (frame) {
      frame.description = description;
      await db.put('frames', frame);
    }
  }

  // 清理所有数据
  async clearAll(): Promise<void> {
    const db = await this.init();
    await db.clear('videos');
    await db.clear('frames');
  }
}

export const storageService = new StorageService();

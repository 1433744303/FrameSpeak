import { create } from 'zustand';
import type { VideoInfo, VideoFrame, ExtractionConfig } from '../types';
import { VideoService } from '../services/videoService';
import { storageService } from '../services/storageService';

// 模块级变量存储video service实例，避免在store中存储非状态数据
let currentVideoService: VideoService | null = null;

interface VideoState {
  currentVideo: VideoInfo | null;
  frames: VideoFrame[];
  isExtracting: boolean;
  extractionProgress: number;

  loadVideo: (file: File) => Promise<void>;
  extractFrames: (config: ExtractionConfig) => Promise<void>;
  updateFrameDescription: (frameId: string, description: { zh: string; en: string }) => void;
  clearVideo: () => Promise<void>;
  setAnalyzing: (frameId: string, analyzing: boolean) => void;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  currentVideo: null,
  frames: [],
  isExtracting: false,
  extractionProgress: 0,

  loadVideo: async (file: File) => {
    // 创建新的video service实例
    currentVideoService = new VideoService();
    const videoInfo = await currentVideoService.loadVideo(file);

    const video: VideoInfo = {
      id: `video-${Date.now()}`,
      name: videoInfo.name,
      duration: videoInfo.duration,
      size: videoInfo.size,
      frames: [],
      createdAt: Date.now(),
    };

    await storageService.saveVideoInfo(video);
    set({ currentVideo: video, frames: [] });
  },

  extractFrames: async (config: ExtractionConfig) => {
    const { currentVideo } = get();
    if (!currentVideo) return;

    if (!currentVideoService) {
      throw new Error('Video service not initialized');
    }

    set({ isExtracting: true, extractionProgress: 0 });

    try {
      const frames = await currentVideoService.extractFrames(config, (progress) => {
        set({ extractionProgress: progress });
      });

      // 保存帧到IndexedDB
      for (const frame of frames) {
        if (frame.imageBlob) {
          await storageService.saveFrame({
            id: frame.id,
            videoId: currentVideo.id,
            timestamp: frame.timestamp,
            imageBlob: frame.imageBlob,
          });
        }
      }

      // 更新视频信息
      const updatedVideo = {
        ...currentVideo,
        frames: frames.map(f => ({
          id: f.id,
          timestamp: f.timestamp,
          imageUrl: f.imageUrl,
        })) as VideoFrame[],
      };
      await storageService.saveVideoInfo(updatedVideo);

      set({
        frames,
        currentVideo: updatedVideo,
        isExtracting: false,
        extractionProgress: 1,
      });
    } catch (error) {
      console.error('Frame extraction failed:', error);
      set({ isExtracting: false, extractionProgress: 0 });
      throw error;
    }
  },

  updateFrameDescription: (frameId: string, description: { zh: string; en: string }) => {
    set((state) => ({
      frames: state.frames.map((frame) =>
        frame.id === frameId ? { ...frame, description, analyzing: false } : frame
      ),
    }));

    // 更新IndexedDB
    storageService.updateFrameDescription(frameId, description);
  },

  setAnalyzing: (frameId: string, analyzing: boolean) => {
    set((state) => ({
      frames: state.frames.map((frame) =>
        frame.id === frameId ? { ...frame, analyzing } : frame
      ),
    }));
  },

  clearVideo: async () => {
    const { currentVideo, frames } = get();

    // 清理所有frame的imageUrl以防止内存泄漏
    frames.forEach(frame => {
      if (frame.imageUrl) {
        URL.revokeObjectURL(frame.imageUrl);
      }
    });

    // 从IndexedDB删除数据
    if (currentVideo) {
      try {
        await storageService.deleteVideo(currentVideo.id);
      } catch (error) {
        console.error('Failed to delete video from storage:', error);
      }
    }

    // 清理video service
    if (currentVideoService) {
      currentVideoService.cleanup();
      currentVideoService = null;
    }

    set({
      currentVideo: null,
      frames: [],
      isExtracting: false,
      extractionProgress: 0,
    });
  },
}));

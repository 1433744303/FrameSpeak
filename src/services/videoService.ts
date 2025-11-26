import type { VideoFrame, ExtractionConfig } from '../types';

export class VideoService {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * 加载视频文件
   */
  async loadVideo(file: File): Promise<{ duration: number; name: string; size: number }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          name: file.name,
          size: file.size,
        });
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };

      video.src = URL.createObjectURL(file);
      this.video = video;
    });
  }

  /**
   * 提取视频帧
   */
  async extractFrames(
    config: ExtractionConfig,
    onProgress?: (progress: number, frame: VideoFrame) => void
  ): Promise<VideoFrame[]> {
    if (!this.video) {
      throw new Error('Video not loaded');
    }

    const { duration } = this.video;
    const { interval, maxFrames = 100 } = config;
    const frames: VideoFrame[] = [];

    // 计算需要提取的时间点
    const timestamps: number[] = [];
    for (let time = 0; time < duration; time += interval) {
      if (timestamps.length >= maxFrames) break;
      timestamps.push(time);
    }

    // 设置canvas尺寸（限制为720p以节省空间）
    const maxWidth = 1280;
    const maxHeight = 720;
    const videoAspect = this.video.videoWidth / this.video.videoHeight;

    if (videoAspect > maxWidth / maxHeight) {
      this.canvas!.width = maxWidth;
      this.canvas!.height = maxWidth / videoAspect;
    } else {
      this.canvas!.height = maxHeight;
      this.canvas!.width = maxHeight * videoAspect;
    }

    // 逐个提取帧
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i];
      const frame = await this.captureFrame(timestamp);
      frames.push(frame);

      if (onProgress) {
        onProgress((i + 1) / timestamps.length, frame);
      }
    }

    return frames;
  }

  /**
   * 捕获指定时间点的帧
   */
  private async captureFrame(timestamp: number): Promise<VideoFrame> {
    return new Promise((resolve, reject) => {
      if (!this.video || !this.canvas || !this.ctx) {
        reject(new Error('Video or canvas not initialized'));
        return;
      }

      const onSeeked = async () => {
        try {
          // 绘制当前帧到canvas
          this.ctx!.drawImage(
            this.video!,
            0,
            0,
            this.canvas!.width,
            this.canvas!.height
          );

          // 转换为Blob
          const blob = await new Promise<Blob>((resolve, reject) => {
            this.canvas!.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
              },
              'image/jpeg',
              0.85
            );
          });

          // 创建本地URL用于预览
          const imageUrl = URL.createObjectURL(blob);

          const frame: VideoFrame = {
            id: `frame-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            timestamp,
            imageUrl,
            imageBlob: blob,
          };

          this.video!.removeEventListener('seeked', onSeeked);
          resolve(frame);
        } catch (error) {
          this.video!.removeEventListener('seeked', onSeeked);
          reject(error);
        }
      };

      this.video.addEventListener('seeked', onSeeked);
      this.video.currentTime = timestamp;
    });
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.video) {
      URL.revokeObjectURL(this.video.src);
      this.video = null;
    }
    this.canvas = null;
    this.ctx = null;
  }
}

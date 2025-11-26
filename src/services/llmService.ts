import axios from 'axios';
import type { LLMConfig } from '../types';

// 默认提示词常量，用于生成图片描述
const DEFAULT_ANALYSIS_PROMPT = `You are an expert at creating precise image generation prompts. Analyze this image and create a detailed description that can be used for AI image generation models (like Stable Diffusion, Midjourney, DALL-E).

Your description MUST include all of the following elements in detail:

1. **Main Subject(s)**: Describe every person, object, or character with specific details (age, gender, appearance, clothing, pose, expression, facial features, hair style, accessories, etc.)

2. **Action & Pose**: Exact actions, gestures, body language, hand positions, eye direction, and precise positioning

3. **Composition & Framing**: Camera angle (eye-level, low-angle, high-angle, bird's eye, worm's eye, etc.), shot type (extreme close-up, close-up, medium shot, full shot, wide shot, etc.), rule of thirds, symmetry

4. **Background & Setting**: Detailed environment description, specific location type, indoor/outdoor, architectural elements, props, objects in background, depth layers

5. **Lighting**: Type of lighting (natural sunlight, golden hour, blue hour, studio lighting, rim lighting, etc.), direction (front, side, back, top), quality (soft/hard), shadows, highlights, light color temperature

6. **Color Palette**: Dominant colors, secondary colors, color harmony, saturation level, contrast level, color temperature (warm/cool tones)

7. **Atmosphere & Mood**: Overall feeling, ambiance, emotional tone, weather conditions, time of day

8. **Art Style & Quality**: Photography style (portrait, documentary, fashion, etc.), art style (realistic, cinematic, artistic, etc.), rendering quality tags (photorealistic, highly detailed, 8k, sharp focus, etc.)

9. **Technical Details**: Depth of field (shallow/deep), bokeh, focus point, texture details (skin texture, fabric texture, etc.), material properties (glossy, matte, metallic, etc.)

CRITICAL RULES:
- Be EXTREMELY SPECIFIC and PRECISE - avoid vague or abstract terms
- Use professional photography and cinematography terminology
- NEVER mention: watermarks, subtitles, UI elements, logos, text overlays, time stamps, player controls
- Focus ONLY on visual elements that should be recreated in a generated image
- Write in a comma-separated style typical of image generation prompts
- Include quality modifiers like "highly detailed", "professional", "sharp focus"
- Specify exact quantities (e.g., "three people" not "some people")

Provide the description in both English and Chinese. The English version should be suitable as a direct prompt for image generation AI.

Format your response EXACTLY as follows:
EN: [Detailed, precise English description suitable for image generation, written in a prompt-style format]
ZH: [对应的详细中文描述]`;

export class LLMService {
  /**
   * 分析图片并生成中英文描述
   */
  async analyzeImage(
    imageBlob: Blob,
    config: LLMConfig
  ): Promise<{ zh: string; en: string }> {
    const base64Image = await this.blobToBase64(imageBlob);

    switch (config.provider) {
      case 'ollama':
        return this.analyzeWithOllama(base64Image, config);
      case 'openai':
        return this.analyzeWithOpenAI(base64Image, config);
      case 'lmstudio':
        return this.analyzeWithLMStudio(base64Image, config);
      default:
        return this.analyzeWithCustom(base64Image, config);
    }
  }

  /**
   * 使用Ollama分析图片
   */
  private async analyzeWithOllama(
    base64Image: string,
    config: LLMConfig
  ): Promise<{ zh: string; en: string }> {
    // 使用自定义提示词或默认提示词
    const prompt = config.customPrompt || DEFAULT_ANALYSIS_PROMPT;

    try {
      const response = await axios.post(
        config.endpoint,
        {
          model: config.model,
          messages: [
            {
              role: 'user',
              content: prompt,
              images: [base64Image],
            },
          ],
          stream: false,
          options: {
            temperature: config.temperature,
            num_predict: config.maxTokens,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60秒超时
        }
      );

      const content = response.data.message.content;
      return this.parseDescription(content);
    } catch (error) {
      console.error('Ollama API error:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('无法连接到 Ollama 服务，请确保 Ollama 正在运行');
        } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
          throw new Error('请求超时，请稍后重试');
        } else if (error.response) {
          throw new Error(`API 错误 (${error.response.status}): ${error.response.data?.error || error.message}`);
        } else if (error.request) {
          throw new Error('网络错误：无法连接到服务器');
        }
      }

      throw new Error(`Ollama 调用失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 使用OpenAI分析图片
   */
  private async analyzeWithOpenAI(
    base64Image: string,
    config: LLMConfig
  ): Promise<{ zh: string; en: string }> {
    // 使用自定义提示词或默认提示词
    const prompt = config.customPrompt || DEFAULT_ANALYSIS_PROMPT;

    try {
      const response = await axios.post(
        config.endpoint,
        {
          model: config.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: config.maxTokens,
          temperature: config.temperature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
          },
          timeout: 60000, // 60秒超时
        }
      );

      const content = response.data.choices[0].message.content;
      return this.parseDescription(content);
    } catch (error) {
      console.error('OpenAI API error:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('无法连接到 OpenAI 服务');
        } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
          throw new Error('请求超时，请稍后重试');
        } else if (error.response) {
          const status = error.response.status;
          if (status === 401) {
            throw new Error('API 密钥无效，请检查配置');
          } else if (status === 429) {
            throw new Error('请求过于频繁，请稍后重试');
          } else {
            throw new Error(`API 错误 (${status}): ${error.response.data?.error?.message || error.message}`);
          }
        } else if (error.request) {
          throw new Error('网络错误：无法连接到服务器');
        }
      }

      throw new Error(`OpenAI 调用失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 使用LM Studio分析图片
   */
  private async analyzeWithLMStudio(
    base64Image: string,
    config: LLMConfig
  ): Promise<{ zh: string; en: string }> {
    // LM Studio使用OpenAI兼容API
    return this.analyzeWithOpenAI(base64Image, config);
  }

  /**
   * 使用自定义API分析图片
   */
  private async analyzeWithCustom(
    base64Image: string,
    config: LLMConfig
  ): Promise<{ zh: string; en: string }> {
    // 默认尝试OpenAI格式
    return this.analyzeWithOpenAI(base64Image, config);
  }

  /**
   * 解析LLM返回的描述
   * 支持多种格式，提高容错性
   */
  private parseDescription(content: string): { zh: string; en: string } {
    // 尝试标准格式: EN: ... ZH: ...
    let enMatch = content.match(/EN:\s*(.+?)(?=\nZH:|$)/s);
    let zhMatch = content.match(/ZH:\s*(.+?)$/s);

    if (enMatch && zhMatch) {
      return {
        en: enMatch[1].trim(),
        zh: zhMatch[1].trim(),
      };
    }

    // 尝试替代格式: English: ... Chinese: ...
    enMatch = content.match(/English:\s*(.+?)(?=\nChinese:|\n中文:|$)/s);
    zhMatch = content.match(/(?:Chinese|中文):\s*(.+?)$/s);

    if (enMatch && zhMatch) {
      return {
        en: enMatch[1].trim(),
        zh: zhMatch[1].trim(),
      };
    }

    // 尝试查找 "EN:" 和 "ZH:" 标记（不区分大小写）
    enMatch = content.match(/en:\s*(.+?)(?=\nzh:|$)/is);
    zhMatch = content.match(/zh:\s*(.+?)$/is);

    if (enMatch && zhMatch) {
      return {
        en: enMatch[1].trim(),
        zh: zhMatch[1].trim(),
      };
    }

    // 如果以上都失败，尝试按段落分割
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length >= 2) {
      return {
        en: paragraphs[0].trim(),
        zh: paragraphs[1].trim(),
      };
    }

    // 最后的fallback：返回原始内容作为英文，中文提示解析失败
    return {
      en: content.trim(),
      zh: '无法解析中文描述。请检查LLM输出格式，确保包含 "EN:" 和 "ZH:" 标记。',
    };
  }

  /**
   * 将Blob转换为Base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // 移除data:image/jpeg;base64,前缀
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * 测试LLM配置是否有效
   * @throws 抛出详细的错误信息
   */
  async testConnection(config: LLMConfig): Promise<boolean> {
    try {
      if (config.provider === 'ollama') {
        // 测试Ollama连接 - 获取可用模型列表
        const baseUrl = config.endpoint.replace('/api/chat', '');
        const response = await axios.get(`${baseUrl}/api/tags`, {
          timeout: 10000,
        });

        if (response.status === 200) {
          return true;
        } else {
          throw new Error(`服务返回异常状态码: ${response.status}`);
        }
      } else if (config.provider === 'openai' || config.provider === 'lmstudio' || config.provider === 'custom') {
        // 对OpenAI兼容的API，尝试验证端点可达性
        // 使用HEAD或简化的请求避免消耗token
        const response = await axios.post(
          config.endpoint,
          {
            model: config.model,
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
            },
            timeout: 15000,
            validateStatus: (status) => status < 500, // 接受所有非5xx错误
          }
        );

        if (response.status === 200 || response.status === 201) {
          return true;
        } else if (response.status === 401) {
          throw new Error('API密钥无效或未提供，请检查配置');
        } else if (response.status === 403) {
          throw new Error('API访问被拒绝，请检查权限和配额');
        } else if (response.status === 404) {
          throw new Error('API端点不存在，请检查URL是否正确');
        } else if (response.status === 429) {
          throw new Error('请求过于频繁或配额已用完');
        } else {
          throw new Error(`服务返回错误: ${response.status} - ${response.data?.error?.message || '未知错误'}`);
        }
      }

      throw new Error('不支持的服务商类型');
    } catch (error) {
      console.error('Connection test failed:', error);

      // 处理Axios错误
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('无法连接到服务器，请确保服务正在运行');
        } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
          throw new Error('连接超时，请检查网络或服务器地址');
        } else if (error.code === 'ENOTFOUND') {
          throw new Error('无法解析域名，请检查URL是否正确');
        } else if (error.response) {
          // 服务器返回了错误响应
          const status = error.response.status;
          const errorData = error.response.data;

          if (status === 401) {
            throw new Error('API密钥无效，请检查配置');
          } else if (status === 403) {
            throw new Error('访问被拒绝，请检查API权限');
          } else if (status === 404) {
            throw new Error('API端点不存在，请检查URL');
          } else if (status === 429) {
            throw new Error('请求频率超限或配额用完');
          } else if (status >= 500) {
            throw new Error(`服务器错误(${status})，请稍后重试`);
          } else {
            throw new Error(errorData?.error?.message || `请求失败(${status})`);
          }
        } else if (error.request) {
          throw new Error('网络错误，请检查网络连接');
        }
      }

      // 如果不是Axios错误，直接抛出
      throw error;
    }
  }
}

export const llmService = new LLMService();

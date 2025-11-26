import { create } from 'zustand';
import type { LLMConfig } from '../types';
import { storageService } from '../services/storageService';

interface ConfigState {
  llmConfig: LLMConfig;
  setLLMConfig: (config: LLMConfig) => void;
  loadLLMConfig: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  llmConfig: storageService.getDefaultLLMConfig(),

  setLLMConfig: (config: LLMConfig) => {
    storageService.saveLLMConfig(config);
    set({ llmConfig: config });
  },

  loadLLMConfig: () => {
    const config = storageService.getLLMConfig();
    if (config) {
      set({ llmConfig: config });
    }
  },
}));

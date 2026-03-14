import { IMAGE_MODELS, VIDEO_MODELS, TEXT_MODELS, VOICES } from '../constants';

const BASE_URL = 'https://gen.pollinations.ai';

export interface ImageOptions {
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
  safe?: boolean;
  negative_prompt?: string;
  image?: string; // For img2img
}

export interface TextOptions {
  model?: string;
  system?: string;
  json?: boolean;
  temperature?: number;
}

export interface AudioOptions {
  voice?: string;
  model?: string; // e.g. elevenmusic
  duration?: number;
  instrumental?: boolean;
}

export interface VideoOptions {
  model?: string;
  duration?: number;
  aspectRatio?: '16:9' | '9:16';
  audio?: boolean;
}

export const pollinationsService = {
  getImageUrl: (prompt: string, options: ImageOptions = {}) => {
    const { 
      model = 'flux', 
      width = 1024, 
      height = 1024, 
      seed = -1, 
      safe = true, 
      negative_prompt,
      image 
    } = options;
    
    const params = new URLSearchParams({
      model,
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString(),
      safe: safe.toString(),
    });
    
    if (negative_prompt) params.append('negative_prompt', negative_prompt);
    if (image) params.append('image', image);
    
    return `${BASE_URL}/image/${encodeURIComponent(prompt)}?${params.toString()}`;
  },

  getText: async (prompt: string, options: TextOptions = {}) => {
    const { model = 'openai', system, json = false, temperature } = options;
    const params = new URLSearchParams({ model, json: json.toString() });
    
    if (system) params.append('system', system);
    if (temperature !== undefined) params.append('temperature', temperature.toString());
    
    const response = await fetch(`${BASE_URL}/text/${encodeURIComponent(prompt)}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to generate text');
    return response.text();
  },

  getAudioUrl: (text: string, options: AudioOptions = {}) => {
    const { voice = 'nova', model, duration, instrumental } = options;
    const params = new URLSearchParams({ voice });
    
    if (model) params.append('model', model);
    if (duration) params.append('duration', duration.toString());
    if (instrumental !== undefined) params.append('instrumental', instrumental.toString());
    
    return `${BASE_URL}/audio/${encodeURIComponent(text)}?${params.toString()}`;
  },

  getVideoUrl: (prompt: string, options: VideoOptions = {}) => {
    const { model = 'veo', duration = 4, aspectRatio, audio } = options;
    const params = new URLSearchParams({ model, duration: duration.toString() });
    
    if (aspectRatio) params.append('aspectRatio', aspectRatio);
    if (audio !== undefined) params.append('audio', audio.toString());
    
    return `${BASE_URL}/video/${encodeURIComponent(prompt)}?${params.toString()}`;
  }
};

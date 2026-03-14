export interface PollinationsModel {
  id: string;
  name: string;
  description: string;
  capabilities?: string[];
  isPaid?: boolean;
  isAlpha?: boolean;
}

export const IMAGE_MODELS: PollinationsModel[] = [
  { id: 'flux', name: 'Flux Schnell', description: 'High quality 1K images' },
  { id: 'flux-2-dev', name: 'FLUX.2 Dev', description: 'Advanced image-to-image', capabilities: ['vision'], isAlpha: true },
  { id: 'dirtberry-pro', name: 'Dirtberry Pro', description: 'High realism & complex scenes', isAlpha: true },
  { id: 'dirtberry', name: 'Dirtberry', description: 'Quick realistic generation', isAlpha: true },
  { id: 'zimage', name: 'Z-Image Turbo', description: 'Fast 500px generation' },
  { id: 'imagen-4', name: 'Imagen 4', description: 'Google photorealistic', isAlpha: true },
  { id: 'grok-imagine', name: 'Grok Imagine', description: 'xAI visual model', isAlpha: true },
  { id: 'klein', name: 'FLUX.2 Klein 4B', description: 'Fast precise editing', capabilities: ['vision'], isAlpha: true },
  { id: 'gptimage', name: 'GPT Image 1 Mini', description: 'Creative & artistic', capabilities: ['vision'] },
  { id: 'seedream5', name: 'Seedream 5.0 Lite', description: 'Lightweight & new', capabilities: ['vision'], isPaid: true },
  { id: 'nanobanana-2', name: 'NanoBanana 2', description: 'Gemini 3.1 Flash speed', capabilities: ['vision'], isPaid: true },
];

export const VIDEO_MODELS: PollinationsModel[] = [
  { id: 'grok-video', name: 'Grok Video', description: 'xAI video generation', capabilities: ['vision'], isAlpha: true },
  { id: 'ltx-2', name: 'LTX-2', description: 'High resolution video', isPaid: true },
  { id: 'wan', name: 'Wan 2.6', description: 'Video with audio support', capabilities: ['vision'], isPaid: true },
  { id: 'veo', name: 'Veo 3.1 Fast', description: 'Cinematic 3.1 speed', capabilities: ['vision'], isPaid: true },
  { id: 'seedance-pro', name: 'Seedance Pro-Fast', description: 'Superior quality', capabilities: ['vision'], isPaid: true },
];

export const TEXT_MODELS: PollinationsModel[] = [
  { id: 'openai', name: 'GPT-5 Mini', description: 'Smart & balanced', capabilities: ['vision'] },
  { id: 'openai-fast', name: 'GPT-5 Nano', description: 'Ultra fast', capabilities: ['vision'] },
  { id: 'claude-airforce', name: 'Claude Sonnet 4.6', description: 'Advanced reasoning', capabilities: ['vision'], isAlpha: true },
  { id: 'claude-fast', name: 'Claude Haiku 4.5', description: 'Fast & capable', capabilities: ['vision'] },
  { id: 'deepseek', name: 'DeepSeek V3.2', description: 'Powerful open source', capabilities: ['reasoning'] },
  { id: 'gemini', name: 'Gemini 3 Flash', description: 'Multimodal powerhouse', capabilities: ['vision', 'audio_in', 'search', 'code_exec'], isPaid: true },
  { id: 'mistral', name: 'Mistral Small 3.2', description: 'Concise & fast' },
  { id: 'step-3.5-flash', name: 'Step 3.5 Flash', description: 'Newest text model', isAlpha: true },
  { id: 'perplexity-fast', name: 'Perplexity Sonar', description: 'Real-time search', capabilities: ['search'] },
  { id: 'glm', name: 'GLM-5', description: 'Z.ai reasoning model', capabilities: ['reasoning'], isAlpha: true },
  { id: 'polly', name: 'Polly', description: 'Specialized coding agent', capabilities: ['vision', 'reasoning', 'search', 'code_exec'], isAlpha: true },
];

export const AUDIO_MODELS: PollinationsModel[] = [
  { id: 'qwen3-tts', name: 'Qwen3 TTS', description: 'Voice acting via system prompt', isAlpha: true },
  { id: 'elevenlabs', name: 'ElevenLabs v3', description: 'High quality TTS' },
  { id: 'elevenmusic', name: 'ElevenLabs Music', description: 'Music generation' },
  { id: 'suno', name: 'Suno v5', description: 'Advanced music gen', isAlpha: true },
  { id: 'whisper', name: 'Whisper Large V3', description: 'Speech-to-text', capabilities: ['audio_in'], isAlpha: true },
  { id: 'scribe', name: 'ElevenLabs Scribe v2', description: 'Advanced transcription', capabilities: ['audio_in'] },
];

export const VOICES = [
  'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'ash', 'ballad', 'coral', 'sage', 'verse', 'rachel', 'domi', 'bella', 'elli', 'charlotte', 'dorothy', 'sarah', 'emily', 'lily', 'matilda', 'adam', 'antoni', 'arnold', 'josh', 'sam', 'daniel', 'charlie', 'james', 'fin', 'callum', 'liam', 'george', 'brian', 'bill'
];

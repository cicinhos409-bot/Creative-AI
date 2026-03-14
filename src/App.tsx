import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Type as TextIcon, 
  Volume2 as AudioIcon, 
  Video as VideoIcon, 
  Sparkles, 
  Download, 
  Settings, 
  ChevronRight,
  Loader2,
  RefreshCw,
  Shield,
  ShieldOff,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pollinationsService } from './services/pollinationsService';
import { IMAGE_MODELS, VIDEO_MODELS, TEXT_MODELS, AUDIO_MODELS, VOICES, PollinationsModel } from './constants';

type Tab = 'image' | 'text' | 'audio' | 'video';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAudioModel, setSelectedAudioModel] = useState(AUDIO_MODELS[1].id); // elevenlabs
  const [selectedVoice, setSelectedVoice] = useState(VOICES[4]); // nova
  const [duration, setDuration] = useState(4);
  const [safe, setSafe] = useState(true);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [includeAudio, setIncludeAudio] = useState(false);

  useEffect(() => {
    // Set default models based on tab
    if (activeTab === 'image') setSelectedModel(IMAGE_MODELS[0].id);
    if (activeTab === 'text') setSelectedModel(TEXT_MODELS[0].id);
    if (activeTab === 'video') setSelectedModel(VIDEO_MODELS[0].id);
  }, [activeTab]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (activeTab === 'image') {
        const url = pollinationsService.getImageUrl(prompt, {
          model: selectedModel,
          safe,
          negative_prompt: negativePrompt
        });
        setResult({ type: 'image', url });
      } else if (activeTab === 'text') {
        const text = await pollinationsService.getText(prompt, {
          model: selectedModel,
          system: systemPrompt,
          temperature
        });
        setResult({ type: 'text', content: text });
      } else if (activeTab === 'audio') {
        const url = pollinationsService.getAudioUrl(prompt, {
          voice: selectedVoice,
          model: selectedAudioModel === 'elevenmusic' ? 'elevenmusic' : undefined,
          duration: selectedAudioModel === 'elevenmusic' ? duration : undefined
        });
        setResult({ type: 'audio', url });
      } else if (activeTab === 'video') {
        const url = pollinationsService.getVideoUrl(prompt, {
          model: selectedModel,
          duration,
          aspectRatio,
          audio: includeAudio
        });
        setResult({ type: 'video', url });
      }
    } catch (err) {
      setError('Ocorreu um erro ao gerar o conteúdo. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result || !result.url) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `ai-generation-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentModels = activeTab === 'image' ? IMAGE_MODELS : 
                        activeTab === 'text' ? TEXT_MODELS : 
                        activeTab === 'audio' ? AUDIO_MODELS : VIDEO_MODELS;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-20 md:w-64 bg-[#111] border-r border-white/5 flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="text-black w-6 h-6" />
          </div>
          <span className="hidden md:block font-bold text-xl tracking-tight">Creative AI</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2">
          <NavItem 
            icon={<ImageIcon />} 
            label="Imagens" 
            active={activeTab === 'image'} 
            onClick={() => setActiveTab('image')} 
          />
          <NavItem 
            icon={<TextIcon />} 
            label="Texto" 
            active={activeTab === 'text'} 
            onClick={() => setActiveTab('text')} 
          />
          <NavItem 
            icon={<AudioIcon />} 
            label="Áudio" 
            active={activeTab === 'audio'} 
            onClick={() => setActiveTab('audio')} 
          />
          <NavItem 
            icon={<VideoIcon />} 
            label="Vídeo" 
            active={activeTab === 'video'} 
            onClick={() => setActiveTab('video')} 
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${showAdvanced ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden md:block text-sm font-medium">Avançado</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pl-20 md:pl-64 min-h-screen flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
          <h1 className="text-lg font-medium text-white/90">
            {activeTab === 'image' && 'Gerador de Imagens'}
            {activeTab === 'text' && 'Gerador de Texto'}
            {activeTab === 'audio' && 'Estúdio de Áudio'}
            {activeTab === 'video' && 'Gerador de Vídeo'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Pollinations API 2026</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Input Section */}
          <section className="space-y-4">
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'image' ? "Descreva a imagem que você deseja criar..." :
                  activeTab === 'text' ? "Sobre o que você quer escrever?" :
                  activeTab === 'audio' ? "Digite o texto para voz ou descreva a música..." :
                  "Descreva a cena do vídeo..."
                }
                className="w-full bg-[#151515] border border-white/10 rounded-2xl p-6 min-h-[120px] text-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all resize-none placeholder:text-white/20"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Gerar
                </button>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Modelo</label>
                <select 
                  value={activeTab === 'audio' ? selectedAudioModel : selectedModel}
                  onChange={(e) => activeTab === 'audio' ? setSelectedAudioModel(e.target.value) : setSelectedModel(e.target.value)}
                  className="bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 transition-colors cursor-pointer min-w-[200px]"
                >
                  {currentModels.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.isPaid ? '💎' : ''} {m.isAlpha ? '⚠️' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'audio' && selectedAudioModel !== 'elevenmusic' && selectedAudioModel !== 'whisper' && selectedAudioModel !== 'scribe' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Voz</label>
                  <select 
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    {VOICES.map(v => (
                      <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'image' && (
                <div className="flex items-end gap-2">
                  <button 
                    onClick={() => setSafe(!safe)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${safe ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                  >
                    {safe ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                    {safe ? 'Filtro Seguro: ON' : 'Filtro Seguro: OFF'}
                  </button>
                </div>
              )}
            </div>

            {/* Advanced Settings Panel */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {activeTab === 'image' && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Prompt Negativo</label>
                          <input 
                            type="text" 
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="O que evitar na imagem..."
                            className="bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'text' && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Instrução do Sistema</label>
                          <input 
                            type="text" 
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="Ex: Você é um assistente sarcástico..."
                            className="bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Temperatura: {temperature}</label>
                          <input 
                            type="range" min="0" max="2" step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="accent-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                    {(activeTab === 'video' || selectedAudioModel === 'elevenmusic') && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Duração: {duration}s</label>
                          <input 
                            type="range" min="2" max="15"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="accent-emerald-500"
                          />
                        </div>
                        {activeTab === 'video' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Proporção</label>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setAspectRatio('16:9')}
                                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${aspectRatio === '16:9' ? 'bg-white/10 border-white/20' : 'border-white/5 text-white/40'}`}
                              >
                                16:9 (Horizontal)
                              </button>
                              <button 
                                onClick={() => setAspectRatio('9:16')}
                                className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${aspectRatio === '9:16' ? 'bg-white/10 border-white/20' : 'border-white/5 text-white/40'}`}
                              >
                                9:16 (Vertical)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Result Section */}
          <section className="min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse" />
                  </div>
                  <p className="text-white/40 font-medium animate-pulse">Processando sua solicitação...</p>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full flex flex-col items-center p-4"
                >
                  {result.type === 'image' && (
                    <div className="relative group max-w-full">
                      <img 
                        src={result.url} 
                        alt="AI Generated" 
                        className="max-h-[600px] rounded-2xl shadow-2xl border border-white/10 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={downloadResult}
                          className="bg-black/60 backdrop-blur-md hover:bg-black p-3 rounded-xl border border-white/10 transition-all"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {result.type === 'text' && (
                    <div className="w-full max-w-3xl bg-[#151515] p-8 rounded-2xl border border-white/10 shadow-xl">
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-white/80">{result.content}</p>
                      </div>
                    </div>
                  )}

                  {result.type === 'audio' && (
                    <div className="flex flex-col items-center gap-6 p-12 bg-[#151515] rounded-3xl border border-white/10 shadow-xl">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <AudioIcon className="w-10 h-10 text-emerald-500" />
                      </div>
                      <audio controls src={result.url} className="w-full max-w-md accent-emerald-500" />
                      <button 
                        onClick={downloadResult}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Baixar Áudio
                      </button>
                    </div>
                  )}

                  {result.type === 'video' && (
                    <div className="relative group w-full max-w-4xl">
                      <video 
                        controls 
                        src={result.url} 
                        className="w-full rounded-2xl shadow-2xl border border-white/10"
                      />
                      <div className="mt-4 flex justify-center">
                        <button 
                          onClick={downloadResult}
                          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Vídeo
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <RefreshCw className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-400 font-medium">{error}</p>
                  <button onClick={handleGenerate} className="text-sm text-white/40 hover:text-white underline underline-offset-4">Tentar novamente</button>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <Sparkles className="w-10 h-10 text-white/20" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium text-white/60">Pronto para criar?</h3>
                    <p className="text-sm text-white/30">Digite um comando acima e clique em gerar.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Model Info */}
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-4">
            <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Dica do Modelo Selecionado</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                {activeTab === 'image' && `O modelo ${selectedModel.toUpperCase()} é ideal para ${IMAGE_MODELS.find(m => m.id === selectedModel)?.description.toLowerCase()}.`}
                {activeTab === 'text' && `O modelo ${selectedModel.toUpperCase()} oferece ${TEXT_MODELS.find(m => m.id === selectedModel)?.description.toLowerCase()}.`}
                {activeTab === 'audio' && `O modelo ${selectedAudioModel.toUpperCase()} permite ${AUDIO_MODELS.find(m => m.id === selectedAudioModel)?.description.toLowerCase()}.`}
                {activeTab === 'video' && `O modelo ${selectedModel.toUpperCase()} gera ${VIDEO_MODELS.find(m => m.id === selectedModel)?.description.toLowerCase()}.`}
              </p>
            </div>
          </div>
        </div>

        <footer className="p-8 border-t border-white/5 text-center">
          <p className="text-xs text-white/20 font-medium uppercase tracking-widest">
            Pollinations AI Unified API v2026.3.14 • Google AI Studio
          </p>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl transition-all group
        ${active ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}
      `}
    >
      <div className={`${active ? 'text-black' : 'text-white/40 group-hover:text-white'} transition-colors`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <span className="hidden md:block text-sm font-semibold tracking-wide">{label}</span>
      {active && <ChevronRight className="hidden md:block ml-auto w-4 h-4" />}
    </button>
  );
}

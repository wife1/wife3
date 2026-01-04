import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// --- Icons ---
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
const RefreshCwIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

// --- Types ---
type Screen = 'landing' | 'create' | 'chat';

interface Character {
  name: string;
  age: number;
  personality: string;
  hairColor: string;
  hairStyle: string;
  skinTone: string;
  bodyType: string;
  relationship: string;
  avatarUrl: string | null;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

// --- Constants ---
const PERSONALITY_PRESETS = [
  "Playful & Witty",
  "Shy & Sweet",
  "Bold & Adventurous",
  "Intellectual & Calm",
  "Gothic & Mysterious",
  "Energetic & Cheerful"
];

const HAIR_COLORS = ["Black", "Brown", "Blonde", "Red", "Auburn", "Silver", "White", "Pink", "Blue", "Purple", "Green"];
const HAIR_STYLES = ["Long Straight", "Long Wavy", "Short Bob", "Pixie Cut", "Ponytail", "Messy Bun", "Braids", "Shoulder Length", "Bald", "Buzz Cut"];
const SKIN_TONES = ["Pale", "Fair", "Light", "Medium", "Tan", "Olive", "Brown", "Dark", "Ebony"];
const BODY_TYPES = ["Slim", "Athletic", "Curvy", "Muscular", "Average", "Petite", "Tall", "Plus Size"];

// --- Components ---

const App = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [character, setCharacter] = useState<Character>({
    name: '',
    age: 24,
    personality: '',
    hairColor: 'Brown',
    hairStyle: 'Long Wavy',
    skinTone: 'Fair',
    bodyType: 'Slim',
    relationship: 'Girlfriend',
    avatarUrl: null
  });

  const goToCreate = () => setScreen('create');
  const startChat = () => setScreen('chat');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-4xl h-full flex flex-col">
        {screen === 'landing' && <LandingScreen onStart={goToCreate} />}
        {screen === 'create' && <CreationScreen character={character} setCharacter={setCharacter} onFinish={startChat} />}
        {screen === 'chat' && <ChatScreen character={character} onBack={goToCreate} />}
      </div>
    </div>
  );
};

const LandingScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 animate-fade-in">
      <div className="mb-6 p-4 bg-purple-500/10 rounded-full border border-purple-500/20">
        <HeartIcon />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
        Create Your <span className="gradient-text">Dream Companion</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
        Design every detail of your perfect partner. From personality to appearance, bring your ideal relationship to life with advanced AI.
      </p>
      
      <button 
        onClick={onStart}
        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-100 text-slate-900 rounded-full font-semibold text-lg hover:bg-white transition-all hover:scale-105 active:scale-95"
      >
        Start Creating
        <ArrowRightIcon />
        <div className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-pulse"></div>
      </button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-500">
        <div className="glass-panel p-4 rounded-xl">
          <strong className="block text-slate-300 mb-1">Custom Personality</strong>
          Define how they think and feel.
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <strong className="block text-slate-300 mb-1">Visual Generation</strong>
          See your companion come to life.
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <strong className="block text-slate-300 mb-1">Deep Connection</strong>
          Engage in meaningful conversations.
        </div>
      </div>
    </div>
  );
};

const CreationScreen = ({ 
  character, 
  setCharacter, 
  onFinish 
}: { 
  character: Character, 
  setCharacter: React.Dispatch<React.SetStateAction<Character>>, 
  onFinish: () => void 
}) => {
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAvatar = async () => {
    setError(null);
    setIsGeneratingImg(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A high quality, photorealistic portrait of a ${character.age} year old person named ${character.name || 'character'}. ${character.hairColor} hair, ${character.hairStyle} style, ${character.skinTone} skin, ${character.bodyType} body. ${character.personality} vibe. Soft lighting, 8k resolution, detailed face.`;
      
      // Using gemini-2.5-flash-image as requested in guidelines for general image gen
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1', // Perfect for avatar
          }
        }
      });

      let imageUrl = null;
      if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
           if (part.inlineData) {
             imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
             break;
           }
        }
      }

      if (imageUrl) {
        setCharacter(prev => ({ ...prev, avatarUrl: imageUrl }));
      } else {
        setError("Could not generate image. Try again.");
      }

    } catch (e: any) {
      setError(e.message || "Failed to generate image.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const isFormValid = character.name && character.personality;

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-12 animate-fade-in max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
          <SparklesIcon />
        </div>
        <h2 className="text-2xl font-bold">Design Your Companion</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Name</label>
              <input 
                type="text" 
                value={character.name}
                onChange={(e) => setCharacter({...character, name: e.target.value})}
                placeholder="e.g. Luna"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Relationship</label>
              <select 
                value={character.relationship}
                onChange={(e) => setCharacter({...character, relationship: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors appearance-none"
              >
                <option>Girlfriend</option>
                <option>Boyfriend</option>
                <option>Best Friend</option>
                <option>Mentor</option>
                <option>Partner</option>
              </select>
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-3">
             <div className="flex justify-between text-sm font-medium text-slate-400">
               <label>Age</label>
               <span className="text-purple-400 font-bold">{character.age}</span>
             </div>
             <input 
               type="range" 
               min="18" 
               max="65" 
               value={character.age}
               onChange={(e) => setCharacter({...character, age: parseInt(e.target.value)})}
               className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-500"
             />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Personality</label>
            <div className="grid grid-cols-2 gap-2">
              {PERSONALITY_PRESETS.map(p => (
                <button
                  key={p}
                  onClick={() => setCharacter({...character, personality: p})}
                  className={`px-3 py-2 rounded-md text-sm text-left transition-all ${
                    character.personality === p 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={character.personality}
              onChange={(e) => setCharacter({...character, personality: e.target.value})}
              placeholder="Or type your own..."
              className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Appearance Selectors */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <label className="text-sm font-medium text-slate-300">Appearance Details</label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Hair Color</label>
                <select 
                  value={character.hairColor}
                  onChange={(e) => setCharacter({...character, hairColor: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none transition-colors"
                >
                  {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Hair Style</label>
                <select 
                  value={character.hairStyle}
                  onChange={(e) => setCharacter({...character, hairStyle: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none transition-colors"
                >
                  {HAIR_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Body Color (Skin)</label>
                <select 
                  value={character.skinTone}
                  onChange={(e) => setCharacter({...character, skinTone: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none transition-colors"
                >
                  {SKIN_TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500">Body Style</label>
                <select 
                  value={character.bodyType}
                  onChange={(e) => setCharacter({...character, bodyType: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none transition-colors"
                >
                  {BODY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Generate */}
        <div className="flex flex-col items-center justify-start space-y-6">
          <div className="relative group w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-2xl flex items-center justify-center">
            {character.avatarUrl ? (
              <img 
                src={character.avatarUrl} 
                alt="Character Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-500">
                   <SparklesIcon />
                </div>
                <p className="text-slate-400 text-sm">Avatar Preview</p>
              </div>
            )}
            
            {/* Generate Button Overlay (Always visible if no image, or on hover) */}
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity ${character.avatarUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
               <button
                 onClick={handleGenerateAvatar}
                 disabled={isGeneratingImg}
                 className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isGeneratingImg ? <LoaderIcon /> : <RefreshCwIcon />}
                 {character.avatarUrl ? 'Regenerate' : 'Generate Avatar'}
               </button>
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="w-full max-w-xs">
            <button
              onClick={onFinish}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isFormValid 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-900/50 text-white' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Start Relationship
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatScreen = ({ character, onBack }: { character: Character, onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Chat
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // System instruction to enforce persona
        const systemInstruction = `
          You are ${character.name}, a ${character.age}-year-old.
          You are the user's ${character.relationship}.
          Your personality is: ${character.personality}.
          Your appearance is: ${character.hairColor} hair, ${character.hairStyle} style, ${character.skinTone} skin, ${character.bodyType} body type.
          
          Act exactly like this persona. 
          If you are a girlfriend/boyfriend, be affectionate, caring, and romantic.
          If you are a friend, be supportive and casual.
          Do not break character. 
          Keep responses concise (1-3 sentences) unless asked for more deep conversation. 
          Use emojis occasionally if it fits the personality.
          The user is your partner/friend.
        `;

        const chat = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: systemInstruction,
          }
        });

        chatSessionRef.current = chat;

        // Initial Greeting from AI
        setIsTyping(true);
        const result = await chat.sendMessage({ 
          message: `(Internal: Start the conversation as ${character.name}, greeting me warmly based on our relationship as ${character.relationship}.)` 
        });
        setIsTyping(false);
        setMessages([{ role: 'model', content: result.text || "Hello!" }]);
      } catch (error) {
        console.error("Chat init failed", error);
        setMessages([{ role: 'model', content: "I'm having trouble connecting right now. (API Error)" }]);
      }
    };

    initChat();
  }, [character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', content: result.text || "..." }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', content: "I didn't quite catch that. Could you say it again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-40px)] md:m-5 bg-slate-900 md:rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      
      {/* Header */}
      <div className="h-16 bg-slate-800/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="relative">
             {character.avatarUrl ? (
               <img src={character.avatarUrl} className="w-10 h-10 rounded-full object-cover border-2 border-purple-500" />
             ) : (
               <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                 {character.name[0]}
               </div>
             )}
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white leading-tight">{character.name}</h3>
            <p className="text-xs text-purple-400">{character.relationship}</p>
          </div>
        </div>
        <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full border border-slate-700 transition-colors">
          Settings
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] md:max-w-[60%] px-5 py-3 rounded-2xl text-sm md:text-base shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1 items-center">
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800/50 backdrop-blur-md border-t border-white/5">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-6 py-3 focus:outline-none focus:border-purple-500 transition-colors text-slate-200 placeholder-slate-500"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

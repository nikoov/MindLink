/* ──────────────────  MindLinkVR.tsx  (voice-enabled) ────────────────── */
import { saveAs } from 'file-saver';
import { Brain, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

import AssessmentPanel from "./AssessmentPanel";
import ChatInterface from "./ChatInterface";
import EmotionalProgress from "./EmotionalProgress";
import Face3D from "./Face3D";
import VoiceControls from "./VoiceControls";

import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useVoiceRecognition } from "./hooks/useVoiceRecognition";

interface Message { id: string; sender: "therapist"|"patient"; content: string; timestamp: Date; sentiment?: number; }
interface AssessmentData { confidence: number; empathy: number; questionQuality: number; }
interface ChatApi    { reply: string; sentiment: number; }
interface AnalyzeApi { confidence: number; empathy: number; questionQuality: number; feedback: string; }

const API  = "http://localhost:5001";
const BLOOM_LEVELS = ["Remember","Understand","Apply","Analyze","Evaluate","Create"];

export default function MindLinkVR() {
  /* ---------- state ---------- */
  const [messages,setMessages]   = useState<Message[]>([{
    id:"seed",sender:"patient",
    content:"Hello, I'm glad we could meet today. I've been feeling overwhelmed.",
    timestamp:new Date(), sentiment:-0.3
  }]);
  const [currentMessage,setCurrentMessage] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError]         = useState<string|null>(null);

  const [bloomLevel,setBloomLevel] = useState("Apply");
  const [emotionalProgress,setEmotionalProgress] = useState<number[]>([-0.3]);
  const [patientEmotion,setPatientEmotion] = useState<"neutral"|"happy"|"sad"|"anxious">("neutral");

  const [assessment,setAssessment] = useState<AssessmentData>({confidence:50,empathy:50,questionQuality:50});
  const [currentHint,setCurrentHint] = useState("Start by establishing rapport and asking open-ended questions.");
  const [showHints,setShowHints]     = useState(true);

  /* voice */
  const [voiceEnabled,setVoiceEnabled] = useState(true);   // ← default ON
  const [elevenKey,setElevenKey]       = useState("");
  const [showApiKey,setShowApiKey]     = useState(false);

  const { isListening,startListening,stopListening } = useVoiceRecognition();
  const { isSpeaking,speakText }                     = useTextToSpeech();

  const [showRecap, setShowRecap] = useState(false);
  const [recapMessage, setRecapMessage] = useState('');
  const recapInterval = 5; // Show recap every 5 therapist messages

  const bloomThresholds = [60, 75, 90];
  const [bloomNotification, setBloomNotification] = useState('');

  /* derive patient emotion from sentiment */
  useEffect(() => {
    const s = emotionalProgress.length > 0 ? emotionalProgress[emotionalProgress.length - 1] : 0;
    setPatientEmotion(
      s > 0.3 ? 'happy' : s < -0.3 ? 'sad' : s < -0.1 ? 'anxious' : 'neutral'
    );
  }, [emotionalProgress]);

  // Track therapist messages and show recap
  useEffect(() => {
    const therapistMessages = messages.filter(m => m.sender === 'therapist').length;
    if (therapistMessages > 0 && therapistMessages % recapInterval === 0) {
      // Example recap content (could be more advanced)
      setRecapMessage('Quick Recap: What is one open-ended question you could ask next?');
      setShowRecap(true);
    } else {
      setShowRecap(false);
    }
  }, [messages]);

  // Auto-advance Bloom level when questionQuality improves
  useEffect(() => {
    const currentIndex = BLOOM_LEVELS.indexOf(bloomLevel);
    const nextIndex = currentIndex + 1;
    if (
      nextIndex < BLOOM_LEVELS.length &&
      assessment.questionQuality >= bloomThresholds[currentIndex]
    ) {
      setBloomLevel(BLOOM_LEVELS[nextIndex]);
      setBloomNotification(`Great job! You've advanced to the Bloom level: ${BLOOM_LEVELS[nextIndex]}`);
      setTimeout(() => setBloomNotification(''), 4000);
    }
  }, [assessment.questionQuality]);

  /* helper */
  const handleApiError = (e:any) => {
    console.error(e);
    setError(e?.message || "Network error"); setIsLoading(false);
  };

  /* ---------- send turn ---------- */
  const handleSendMessage = async () => {
    if (!currentMessage.trim()||isLoading) return;

    const therapistTurn:Message = {
      id:Date.now().toString(), sender:"therapist",
      content:currentMessage,  timestamp:new Date()
    };
    setMessages(p=>[...p,therapistTurn]);
    setCurrentMessage(""); setIsLoading(true); setError(null);

    try{
      /* 1) patient reply */
      const chat = await fetch(`${API}/chat`,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ text:therapistTurn.content,
                              bloom_level:bloomLevel.toLowerCase() })
      });
      if(!chat.ok) throw new Error(`chat ${chat.status}`);
      const {reply,sentiment}=await chat.json() as ChatApi;

      setMessages(p=>[
        ...p,
        {id:Date.now()+"-p",sender:"patient",content:reply,timestamp:new Date(),sentiment}
      ]);
      setEmotionalProgress(p=>[...p,sentiment]);
      if(voiceEnabled&&elevenKey) await speakText(reply,elevenKey);

      /* 2) supervisor analysis */
      const sup = await fetch(`${API}/analyze`,{
        method:"POST",headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          therapist_msg:therapistTurn.content,
          history:JSON.stringify(messages.slice(-4))
        })
      });
      if(!sup.ok) throw new Error(`analyze ${sup.status}`);
      const assess = await sup.json() as AnalyzeApi;

      setAssessment({
        confidence:assess.confidence,
        empathy:assess.empathy,
        questionQuality:assess.questionQuality
      });
      setCurrentHint(assess.feedback);

    }catch(e){handleApiError(e);}
    finally{setIsLoading(false);}
  };

  /* ---------- voice helpers ---------- */
  const startVoice = () => startListening((txt)=>setCurrentMessage(txt));
  const toggleVoiceEnabled = () => {
    setVoiceEnabled(p=>!p);
    setShowApiKey(!voiceEnabled);
  };

  /* Save session handler */
  const handleSaveSession = () => {
    const sessionData = {
      messages,
      assessment,
      emotionalProgress,
      bloomLevel,
      date: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    saveAs(blob, `mindlinkvr_session_${new Date().toISOString()}.json`);
  };

  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-blue-100 flex justify-center items-center">
      <div className="w-full max-w-5xl h-[90vh] flex bg-white/80 rounded-2xl shadow-xl overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg
                                flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white"/>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">MindLinkVR: CBT Coach Simulation</h1>
                  <p className="text-sm text-slate-600">Therapist Training Session</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <VoiceControls
                  isListening={isListening}
                  voiceEnabled={voiceEnabled}
                  onStartListening={startVoice}
                  onStopListening={stopListening}
                  onToggleVoice={toggleVoiceEnabled}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSaveSession}
                  className="px-3 py-1 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                  title="Save session as JSON"
                >
                  Save Session
                </button>
              </div>
            </div>

            {/* bloom buttons + hint toggle */}
            <div className="flex flex-wrap gap-2 mt-3">
              {BLOOM_LEVELS.map(l=>(
                <button key={l} onClick={()=>setBloomLevel(l)}
                  className={`px-2 py-1 rounded-full text-xs font-semibold border transition-colors
                    ${bloomLevel===l? "bg-blue-500 text-white border-blue-600"
                                     : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"}`}>
                  {l}
                </button>
              ))}
              <button onClick={()=>setShowHints(p=>!p)}
                className={`ml-auto p-2 rounded-lg transition-colors
                  ${showHints? "bg-blue-100 text-blue-600":"bg-slate-100 text-slate-600"}`}
                title="Toggle hints">
                <Lightbulb className="w-5 h-5"/>
              </button>
            </div>

            {showApiKey && voiceEnabled && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-xs font-medium text-blue-700 mb-1">
                  ElevenLabs API Key
                </label>
                <input type="password" value={elevenKey}
                  onChange={(e)=>setElevenKey(e.target.value)}
                  className="w-full px-2 py-1 border border-blue-300 rounded"/>
              </div>
            )}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
          {/* Chat log and input */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              {/* ChatInterface will render messages here */}
              <ChatInterface
                messages={messages}
                currentMessage={currentMessage}
                isLoading={isLoading}
                showHints={showHints}
                currentHint={currentHint}
                onMessageChange={setCurrentMessage}
                onSendMessage={handleSendMessage}
                onToggleHints={() => setShowHints(!showHints)}
              />
              {showRecap && (
                <div className="mx-6 my-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow">
                  <div className="font-semibold text-yellow-800 mb-2">Spaced Repetition Recap</div>
                  <div className="text-yellow-900">{recapMessage}</div>
                  <button
                    className="mt-2 px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                    onClick={() => setShowRecap(false)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right Panel */}
        <div className="w-96 bg-white/60 backdrop-blur-sm border-l border-slate-200 p-6 space-y-6 overflow-y-auto" style={{ maxHeight: '90vh' }}>
          <Face3D emotion={patientEmotion} isSpeaking={isSpeaking} />
          <AssessmentPanel assessment={assessment} />
          <EmotionalProgress emotionalProgress={emotionalProgress} />
          {/* Session Info */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600 space-y-1">
              <div>Bloom Level: <span className="font-medium">{bloomLevel}</span></div>
              <div>Messages: <span className="font-medium">{messages.length}</span></div>
              <div>Voice: <span className="font-medium">{voiceEnabled && elevenKey ? 'Enabled' : 'Disabled'}</span></div>
              <div>Listening: <span className="font-medium">{isListening ? 'Active' : 'Inactive'}</span></div>
            </div>
          </div>
        </div>
        {/* Bloom notification */}
        {bloomNotification && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce">
            {bloomNotification}
          </div>
        )}
      </div>
    </div>
  );
}

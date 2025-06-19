import { Mic, MicOff, Volume2 } from "lucide-react";

interface Props {
  isListening: boolean;
  voiceEnabled: boolean;
  disabled?: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleVoice: () => void;
}

const VoiceControls: React.FC<Props> = ({
  isListening,
  voiceEnabled,
  disabled,
  onStartListening,
  onStopListening,
  onToggleVoice,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* mic button */}
      <button
        type="button"
        disabled={disabled}
        onClick={isListening ? onStopListening : onStartListening}
        title={isListening ? "Stop voice input" : "Start voice input"}
        className={`p-2 rounded-full border transition-colors
          ${isListening ? "bg-red-500 text-white border-red-600" :
                          "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"}`}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* toggle TTS / ElevenLabs */}
      <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer select-none">
        <input
          type="checkbox"
          className="mr-1 accent-blue-600"
          checked={voiceEnabled}
          onChange={onToggleVoice}
        />
        TTS <Volume2 className="w-3 h-3 opacity-70" />
      </label>
    </div>
  );
};

export default VoiceControls;

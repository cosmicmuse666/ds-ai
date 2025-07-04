import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Trash2, Download, Volume2, Loader2 } from 'lucide-react';

interface VoiceNote {
  id: string;
  timestamp: Date;
  duration: number;
  audioBlob: Blob;
  transcription?: string;
  summary?: string;
  isProcessing?: boolean;
}

interface VoiceRecorderProps {
  onVoiceNoteAdded: (voiceNote: VoiceNote) => void;
  voiceNotes: VoiceNote[];
  onVoiceNoteDeleted: (id: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onVoiceNoteAdded, 
  voiceNotes, 
  onVoiceNoteDeleted 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setPermissionGranted(false);
      console.error('Microphone permission denied:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const voiceNote: VoiceNote = {
          id: Date.now().toString(),
          timestamp: new Date(),
          duration: recordingTime,
          audioBlob,
          isProcessing: true
        };
        
        onVoiceNoteAdded(voiceNote);
        
        // Simulate transcription and summarization
        setTimeout(() => {
          const updatedNote = {
            ...voiceNote,
            transcription: "This is a simulated transcription of your voice note. In a real implementation, this would use speech-to-text services like Web Speech API or cloud services.",
            summary: "Key concepts learned today include advanced algorithms, data structures, and problem-solving techniques.",
            isProcessing: false
          };
          onVoiceNoteAdded(updatedNote);
        }, 3000);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionGranted(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playAudio = (voiceNote: VoiceNote) => {
    if (playingId === voiceNote.id) {
      // Pause current audio
      const audio = audioRefs.current[voiceNote.id];
      if (audio) {
        audio.pause();
        setPlayingId(null);
      }
      return;
    }

    // Stop any currently playing audio
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    // Create and play new audio
    const audioUrl = URL.createObjectURL(voiceNote.audioBlob);
    const audio = new Audio(audioUrl);
    audioRefs.current[voiceNote.id] = audio;
    
    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.play();
    setPlayingId(voiceNote.id);
  };

  const downloadAudio = (voiceNote: VoiceNote) => {
    const audioUrl = URL.createObjectURL(voiceNote.audioBlob);
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `voice-note-${voiceNote.timestamp.toISOString().split('T')[0]}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(audioUrl);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (permissionGranted === false) {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-palette-coral to-palette-coral-light p-4 rounded-2xl w-fit mx-auto mb-4">
          <MicOff className="h-8 w-8 text-palette-white" />
        </div>
        <h3 className="text-lg font-bold text-palette-text-light mb-2">
          Microphone Access Required
        </h3>
        <p className="text-palette-text-light/70 mb-4">
          Please allow microphone access to record voice notes.
        </p>
        <button
          onClick={checkMicrophonePermission}
          className="btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Grant Permission
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="bg-gradient-to-br from-palette-purple/10 to-palette-coral/10 rounded-2xl p-6 border border-palette-purple/20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={permissionGranted === null}
              className={`relative p-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                isRecording
                  ? 'bg-gradient-to-r from-palette-coral to-palette-coral-light hover:from-palette-coral-light hover:to-palette-coral'
                  : 'bg-gradient-to-r from-palette-purple to-palette-purple-dark hover:from-palette-purple-dark hover:to-palette-purple'
              } ${permissionGranted === null ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                <Square className="h-8 w-8 text-palette-white" />
              ) : (
                <Mic className="h-8 w-8 text-palette-white" />
              )}
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-palette-coral animate-ping opacity-25"></div>
              )}
            </button>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-bold text-palette-text-light">
              {isRecording ? 'Recording...' : 'Ready to Record'}
            </p>
            {isRecording && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-palette-coral rounded-full animate-pulse"></div>
                <span className="text-2xl font-mono font-bold text-palette-coral">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}
            <p className="text-sm text-palette-text-light/70">
              {isRecording ? 'Click stop when finished' : 'Click to start recording your daily summary'}
            </p>
          </div>
        </div>
      </div>

      {/* Voice Notes List */}
      {voiceNotes.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-palette-text-light flex items-center">
            <Volume2 className="h-5 w-5 mr-2 text-palette-purple" />
            Your Voice Notes ({voiceNotes.length})
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {voiceNotes.map((note) => (
              <div
                key={note.id}
                className="glass-card-light backdrop-blur-sm rounded-2xl p-4 border border-palette-purple/20 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => playAudio(note)}
                      className="btn-secondary p-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      {playingId === note.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-palette-text-light">
                        {formatDate(note.timestamp)}
                      </p>
                      <p className="text-xs text-palette-text-light/70">
                        Duration: {formatTime(note.duration)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadAudio(note)}
                      className="p-2 rounded-xl text-palette-text-light/70 hover:text-palette-purple hover:bg-palette-purple/20 transition-all duration-200"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onVoiceNoteDeleted(note.id)}
                      className="p-2 rounded-xl text-palette-text-light/70 hover:text-palette-coral hover:bg-palette-coral/20 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {note.isProcessing ? (
                  <div className="flex items-center space-x-3 p-3 bg-palette-purple/20 rounded-xl border border-palette-purple/30">
                    <Loader2 className="h-4 w-4 text-palette-purple animate-spin" />
                    <span className="text-sm text-palette-purple font-medium">
                      Processing transcription and summary...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {note.transcription && (
                      <div className="p-3 glass-card-light rounded-xl">
                        <p className="text-xs font-semibold text-palette-text-light/70 mb-1">
                          TRANSCRIPTION
                        </p>
                        <p className="text-sm text-palette-text-light/90">
                          {note.transcription}
                        </p>
                      </div>
                    )}
                    
                    {note.summary && (
                      <div className="p-3 bg-gradient-to-r from-palette-purple/20 to-palette-yellow/20 rounded-xl border border-palette-purple/30">
                        <p className="text-xs font-semibold text-palette-purple mb-1">
                          AI SUMMARY
                        </p>
                        <p className="text-sm text-palette-text-light font-medium">
                          {note.summary}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
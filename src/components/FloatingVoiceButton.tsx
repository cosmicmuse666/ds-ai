import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, X, Volume2, Play, Pause, Loader2, Send } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

interface VoiceNote {
  id: string;
  timestamp: Date;
  duration: number;
  audioBlob: Blob;
  transcription?: string;
  summary?: string;
  isProcessing?: boolean;
}

const FloatingVoiceButton: React.FC = () => {
  const { selectedDate, currentView } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentNote, setCurrentNote] = useState<VoiceNote | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
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
        
        setCurrentNote(voiceNote);
        
        // Simulate transcription and summarization
        setTimeout(() => {
          const updatedNote = {
            ...voiceNote,
            transcription: "This is a simulated transcription of your voice note. In a real implementation, this would use speech-to-text services like Web Speech API or cloud services.",
            summary: "Key concepts learned: Advanced algorithms, data structures, and problem-solving techniques. Areas for improvement: Need more practice with dynamic programming.",
            isProcessing: false
          };
          setCurrentNote(updatedNote);
        }, 3000);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
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

  const playAudio = () => {
    if (!currentNote) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const audioUrl = URL.createObjectURL(currentNote.audioBlob);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.play();
    setIsPlaying(true);
  };

  const saveNote = () => {
    if (currentNote) {
      // In a real app, this would save to the selected date's notes
      console.log('Saving voice note:', currentNote);
      // Show success message or integrate with the notes system
      setCurrentNote(null);
      setIsOpen(false);
    }
  };

  const discardNote = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentNote(null);
    setIsPlaying(false);
  };

  const closePanel = () => {
    if (isRecording) {
      stopRecording();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsOpen(false);
    setCurrentNote(null);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't show the button on the daily view notes tab to avoid redundancy
  if (currentView === 'daily') {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-4 bg-gradient-to-r from-palette-purple to-palette-coral hover:from-palette-purple-dark hover:to-palette-coral-light text-palette-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        >
          <Mic className="h-6 w-6" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-palette-purple to-palette-coral opacity-0 group-hover:opacity-20 animate-ping"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-palette-dark text-palette-text-light text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Quick Voice Note
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-palette-dark"></div>
          </div>
        </button>
      </div>

      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closePanel}
          ></div>
          
          {/* Panel */}
          <div className="relative glass-card backdrop-blur-xl rounded-3xl shadow-2xl w-96 max-w-full animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-palette-purple/20">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-palette-purple to-palette-coral p-2 rounded-xl">
                  <Volume2 className="h-5 w-5 text-palette-white" />
                </div>
                <div>
                  <h3 className="font-bold text-palette-text-light">Quick Voice Note</h3>
                  <p className="text-sm text-palette-text-light/70">Capture your thoughts instantly</p>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="p-2 rounded-xl text-palette-text-light/70 hover:text-palette-text-light hover:bg-palette-purple/20 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {!currentNote ? (
                /* Recording Interface */
                <div className="text-center space-y-4">
                  {permissionGranted === false ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-palette-coral to-palette-coral-light p-3 rounded-2xl w-fit mx-auto">
                        <MicOff className="h-6 w-6 text-palette-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-palette-text-light mb-2">
                          Microphone Access Required
                        </p>
                        <p className="text-sm text-palette-text-light/70 mb-4">
                          Please allow microphone access to record voice notes.
                        </p>
                        <button
                          onClick={checkMicrophonePermission}
                          className="btn-primary px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                        >
                          Grant Permission
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                      
                      <div>
                        <p className="font-semibold text-palette-text-light">
                          {isRecording ? 'Recording...' : 'Ready to Record'}
                        </p>
                        {isRecording && (
                          <div className="flex items-center justify-center space-x-2 mt-2">
                            <div className="w-2 h-2 bg-palette-coral rounded-full animate-pulse"></div>
                            <span className="text-xl font-mono font-bold text-palette-coral">
                              {formatTime(recordingTime)}
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-palette-text-light/70 mt-1">
                          {isRecording ? 'Click stop when finished' : 'Tap to start recording'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Playback and Save Interface */
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-palette-yellow to-palette-yellow-bright p-3 rounded-2xl w-fit mx-auto mb-3">
                      <Volume2 className="h-6 w-6 text-palette-dark" />
                    </div>
                    <p className="font-semibold text-palette-text-light">
                      Recording Complete
                    </p>
                    <p className="text-sm text-palette-text-light/70">
                      Duration: {formatTime(currentNote.duration)}
                    </p>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={playAudio}
                      className="btn-secondary p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={discardNote}
                      className="p-3 rounded-xl text-palette-text-light/70 hover:text-palette-coral hover:bg-palette-coral/20 transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Processing/Results */}
                  {currentNote.isProcessing ? (
                    <div className="flex items-center justify-center space-x-3 p-4 bg-palette-purple/20 rounded-xl border border-palette-purple/30">
                      <Loader2 className="h-5 w-5 text-palette-purple animate-spin" />
                      <span className="text-sm text-palette-purple font-medium">
                        Processing transcription...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentNote.transcription && (
                        <div className="p-3 glass-card-light rounded-xl">
                          <p className="text-xs font-semibold text-palette-text-light/70 mb-1">
                            TRANSCRIPTION
                          </p>
                          <p className="text-sm text-palette-text-light/90">
                            {currentNote.transcription}
                          </p>
                        </div>
                      )}
                      
                      {currentNote.summary && (
                        <div className="p-3 bg-gradient-to-r from-palette-purple/20 to-palette-yellow/20 rounded-xl border border-palette-purple/30">
                          <p className="text-xs font-semibold text-palette-purple mb-1">
                            AI SUMMARY
                          </p>
                          <p className="text-sm text-palette-text-light font-medium">
                            {currentNote.summary}
                          </p>
                        </div>
                      )}

                      {/* Save Button */}
                      <button
                        onClick={saveNote}
                        className="w-full btn-secondary flex items-center justify-center space-x-2 p-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Send className="h-4 w-4" />
                        <span>Save Voice Note</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingVoiceButton;
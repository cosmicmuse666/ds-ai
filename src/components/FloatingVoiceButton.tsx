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
          className="group relative p-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        >
          <Mic className="h-6 w-6" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 animate-ping"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Quick Voice Note
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
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
          <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-96 max-w-full animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                  <Volume2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Quick Voice Note</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Capture your thoughts instantly</p>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
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
                      <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-2xl w-fit mx-auto">
                        <MicOff className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-2">
                          Microphone Access Required
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Please allow microphone access to record voice notes.
                        </p>
                        <button
                          onClick={checkMicrophonePermission}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
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
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                        } ${permissionGranted === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isRecording ? (
                          <Square className="h-8 w-8 text-white" />
                        ) : (
                          <Mic className="h-8 w-8 text-white" />
                        )}
                        {isRecording && (
                          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"></div>
                        )}
                      </button>
                      
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {isRecording ? 'Recording...' : 'Ready to Record'}
                        </p>
                        {isRecording && (
                          <div className="flex items-center justify-center space-x-2 mt-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xl font-mono font-bold text-red-600 dark:text-red-400">
                              {formatTime(recordingTime)}
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl w-fit mx-auto mb-3">
                      <Volume2 className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Recording Complete
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration: {formatTime(currentNote.duration)}
                    </p>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={playAudio}
                      className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={discardNote}
                      className="p-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Processing/Results */}
                  {currentNote.isProcessing ? (
                    <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Processing transcription...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentNote.transcription && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            TRANSCRIPTION
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {currentNote.transcription}
                          </p>
                        </div>
                      )}
                      
                      {currentNote.summary && (
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                            AI SUMMARY
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                            {currentNote.summary}
                          </p>
                        </div>
                      )}

                      {/* Save Button */}
                      <button
                        onClick={saveNote}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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
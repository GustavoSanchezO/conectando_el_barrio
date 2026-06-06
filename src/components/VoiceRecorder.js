'use client';

import { useState, useRef, useEffect } from 'react';

export default function VoiceRecorder({ onTranscript, onStop }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      // If still recording, restart (for continuous mode)
      if (recognitionRef.current?._shouldRestart) {
        try {
          recognition.start();
        } catch (e) {
          // ignore
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setInterimTranscript('');
    setIsRecording(true);
    recognitionRef.current._shouldRestart = true;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already started
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    setIsRecording(false);
    recognitionRef.current._shouldRestart = false;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // ignore
    }

    const finalTranscript = transcript + interimTranscript;
    setInterimTranscript('');
    if (finalTranscript.trim()) {
      setTranscript(finalTranscript);
      if (onStop) onStop(finalTranscript.trim());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const fullTranscript = transcript + interimTranscript;

  useEffect(() => {
    if (onTranscript && fullTranscript) {
      onTranscript(fullTranscript);
    }
  }, [fullTranscript, onTranscript]);

  if (!isSupported) {
    return (
      <div className="voice-recorder">
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h3>Navegador no compatible</h3>
          <p style={{ marginTop: '0.5rem' }}>
            Tu navegador no soporta reconocimiento de voz. Por favor usa{' '}
            <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-recorder">
      <button
        className={`mic-button ${isRecording ? 'recording' : ''}`}
        onClick={toggleRecording}
        aria-label={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
      >
        {isRecording ? 'Detener' : 'Grabar'}
      </button>

      <p className={`voice-status ${isRecording ? 'recording' : ''}`}>
        {isRecording
          ? 'Escuchando... Describe tu negocio'
          : fullTranscript
            ? 'Grabación completada. Puedes grabar de nuevo o continuar.'
            : 'Presiona el micrófono y describe tu negocio'}
      </p>

      {(fullTranscript || isRecording) && (
        <div className={`transcript-box ${isRecording ? 'active' : ''}`}>
          {fullTranscript || (
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Esperando que hables...
            </span>
          )}
        </div>
      )}
    </div>
  );
}

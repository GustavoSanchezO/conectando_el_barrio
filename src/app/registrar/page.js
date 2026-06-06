'use client';

import { useState } from 'react';
import VoiceRecorder from '@/components/VoiceRecorder';
import BusinessPreview from '@/components/BusinessPreview';
import { addNegocio } from '@/lib/store';
import Link from 'next/link';

export default function RegistrarPage() {
  const [step, setStep] = useState('record'); // record | analyzing | preview | success
  const [transcript, setTranscript] = useState('');
  const [businessData, setBusinessData] = useState(null);
  const [error, setError] = useState('');

  const handleVoiceStop = async (text) => {
    setTranscript(text);
    setStep('analyzing');
    setError('');

    try {
      const res = await fetch('/api/gemini/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcripcion: text }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setStep('record');
        return;
      }

      setBusinessData(data.datos);
      setStep('preview');
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setStep('record');
    }
  };

  const handleConfirm = async (data) => {
    try {
      const saved = addNegocio(data);
      setBusinessData(saved);
      setStep('success');
    } catch (err) {
      console.error('Error saving:', err);
      setError('Error al guardar. Intenta de nuevo.');
    }
  };

  const handleReset = () => {
    setStep('record');
    setTranscript('');
    setBusinessData(null);
    setError('');
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          Registra tu <span className="text-gradient">Negocio</span>
        </h1>
        <p>
          Describe tu negocio con tu voz y nuestra IA hará el resto. Sin formularios complicados.
        </p>
      </div>

      {/* Step indicators */}
      <div className="steps">
        <div className={`step ${step === 'record' ? 'active' : ['analyzing', 'preview', 'success'].includes(step) ? 'completed' : ''}`}>
          <div className="step-number">{['analyzing', 'preview', 'success'].includes(step) ? '✓' : '1'}</div>
          <span className="step-label">Hablar</span>
        </div>
        <div className={`step-connector ${['preview', 'success'].includes(step) ? 'completed' : ''}`}></div>
        <div className={`step ${step === 'analyzing' ? 'active' : ['preview', 'success'].includes(step) ? 'completed' : ''}`}>
          <div className="step-number">{['preview', 'success'].includes(step) ? '✓' : '2'}</div>
          <span className="step-label">Analizar</span>
        </div>
        <div className={`step-connector ${step === 'success' ? 'completed' : ''}`}></div>
        <div className={`step ${step === 'preview' ? 'active' : step === 'success' ? 'completed' : ''}`}>
          <div className="step-number">{step === 'success' ? '✓' : '3'}</div>
          <span className="step-label">Confirmar</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="card"
          style={{
            maxWidth: '600px',
            margin: '0 auto var(--space-lg)',
            borderColor: 'var(--danger)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--danger)' }}>⚠️ {error}</p>
        </div>
      )}

      {/* Step: Record */}
      {step === 'record' && (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <VoiceRecorder onStop={handleVoiceStop} />
          <div
            style={{
              textAlign: 'center',
              marginTop: 'var(--space-lg)',
              padding: '0 var(--space-lg)',
            }}
          >
            <p className="text-small" style={{ color: 'var(--text-muted)' }}>
              💡 <strong>Tip:</strong> Menciona el nombre de tu negocio, qué vendes, tu dirección
              y tu horario. La IA se encargará de organizar todo.
            </p>
          </div>
        </div>
      )}

      {/* Step: Analyzing */}
      {step === 'analyzing' && (
        <div
          className="card"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center',
            padding: 'var(--space-3xl)',
          }}
        >
          <div className="loading-spinner" style={{ margin: '0 auto var(--space-lg)' }}></div>
          <h3>Analizando con IA...</h3>
          <p style={{ marginTop: 'var(--space-sm)' }}>
            Gemini está extrayendo la información de tu negocio
          </p>
          <div
            style={{
              marginTop: 'var(--space-lg)',
              padding: 'var(--space-md)',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
            }}
          >
            &ldquo;{transcript.substring(0, 150)}
            {transcript.length > 150 ? '...' : ''}&rdquo;
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && businessData && (
        <BusinessPreview
          datos={businessData}
          onConfirm={handleConfirm}
          onCancel={handleReset}
        />
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>¡Negocio Registrado!</h2>
            <p>
              <strong>{businessData?.nombre}</strong> ya aparece en el mapa de Durango.
              Los visitantes podrán encontrarte fácilmente.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-md)',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Link href="/explorar" className="btn btn-primary">
                🗺️ Ver en el Mapa
              </Link>
              <button className="btn btn-outline" onClick={handleReset}>
                🎤 Registrar Otro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

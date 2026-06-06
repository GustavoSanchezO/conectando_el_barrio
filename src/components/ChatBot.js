'use client';

import { useState, useRef, useEffect } from 'react';
import { getNegocios } from '@/lib/store';

export default function ChatBot({ onRecommendations, onClose, userLocation }) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        '¡Hola! Soy tu guía virtual de Durango. ¿Qué te gustaría descubrir hoy? Puedo recomendarte lugares para comer, artesanías, cafés, o crear una ruta personalizada para ti.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const texto = input.trim();
    if (!texto || loading) return;

    const userMsg = { role: 'user', content: texto };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const negocios = getNegocios();
      const historial = messages.map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: texto,
          historial,
          negocios,
          userLocation,
        }),
      });

      const data = await res.json();

      const botMsg = {
        role: 'bot',
        content: data.mensaje,
        negociosRecomendados: data.negociosRecomendados,
        mostrarRuta: data.mostrarRuta,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Notify parent about recommendations
      if (
        onRecommendations &&
        data.negociosRecomendados &&
        data.negociosRecomendados.length > 0
      ) {
        onRecommendations(data.negociosRecomendados, data.mostrarRuta);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: '¡Ups! Tuve un problema. ¿Podrías intentar de nuevo?',
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    '¿Dónde puedo comer comida típica?',
    '¿Qué artesanías puedo comprar?',
    'Arma una ruta turística para hoy',
  ];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">G</div>
          <div>
            <h4>Barrio Guide</h4>
            <p>En línea</p>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-icon"
          onClick={onClose}
          style={{ fontSize: '1.2rem' }}
        >
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className={`chat-bubble ${msg.role === 'bot' ? 'bot' : 'user'}`}>
              {msg.content}
            </div>
            {msg.negociosRecomendados && msg.negociosRecomendados.length > 0 && (
              <div className="chat-recommendations" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {msg.negociosRecomendados.map((id) => {
                  const negocios = getNegocios();
                  const n = negocios.find((neg) => neg.id === id);
                  if (!n) return null;
                  return (
                    <div key={id} className="chat-recommendation">
                      <strong>{n.nombre}</strong> — {n.categoria}
                    </div>
                  );
                })}
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ width: '100%', marginTop: '4px' }}
                  onClick={() => onRecommendations && onRecommendations(msg.negociosRecomendados, true)}
                >
                  🗺️ Mostrar ruta
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble bot typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        {/* Quick questions (show only at start) */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                className="chat-recommendation"
                onClick={() => {
                  setInput(q);
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregunta sobre Durango..."
          disabled={loading}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

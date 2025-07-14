import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { celebId } = useParams();

  const [messages, setMessages] = useState([
    { from: 'ai', text: `You are chatting with celeb #${celebId}` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + ' ' + transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    setMessages((msgs) => [...msgs, { from: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/chat/${celebId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((msgs) => [...msgs, { from: 'ai', text: data.reply }]);
      } else if (data.error) {
        setMessages((msgs) => [...msgs, { from: 'ai', text: `Error: ${data.error}` }]);
      } else {
        setMessages((msgs) => [...msgs, { from: 'ai', text: 'No response from AI.' }]);
      }
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: 'ai', text: 'Failed to fetch response.' }]);
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.from === 'ai') {
      const utterance = new SpeechSynthesisUtterance(lastMsg.text);
      utterance.lang = 'en-IN';
      utterance.pitch = 1;
      utterance.rate = 1;

      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) =>
        v.name.includes('Google') || v.name.includes('English')
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-4 py-6">
      <div className="w-full max-w-xl bg-zinc-900 bg-opacity-80 p-4 rounded-lg border border-white/10">
        <div className="h-96 overflow-y-auto p-2 border-b border-white/10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 text-sm ${
                msg.from === 'user' ? 'text-right text-blue-300' : 'text-left text-green-400'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 items-start mt-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or speak your message..."
            className="w-full p-2 rounded-md bg-zinc-800 text-white resize-none"
            disabled={loading}
          />
          <button
            onClick={startListening}
            disabled={loading || listening}
            className={`px-3 py-2 rounded-md text-white font-bold transition ${
              listening ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title="Speak"
          >
            🎤
          </button>
        </div>

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;

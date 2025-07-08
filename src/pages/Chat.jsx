import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { celebId } = useParams(); // ✅ Use correct param
  const [messages, setMessages] = useState([
    { from: 'ai', text: `You are chatting with celeb #${celebId}` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-xl bg-zinc-900 p-4 rounded-lg border border-white/10">
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
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full p-2 mt-2 rounded-md bg-zinc-800 text-white resize-none"
          disabled={loading}
        />
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

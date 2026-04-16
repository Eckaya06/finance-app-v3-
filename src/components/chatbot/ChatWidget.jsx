import { useState } from 'react';
import { useChat } from '../../context/ChatContext'; // Context'i import ettik
import './ChatWidget.css';

const ChatWidget = () => {
  // Artık verileri lokalden değil, Context'ten (merkezden) çekiyoruz
  const { isOpen, toggleChat, messages, addMessage } = useChat();
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Kullanıcı mesajını merkeze ekle
    addMessage('user', input);
    setInput('');

    // Sahte API yanıtı
    setTimeout(() => {
      addMessage('bot', 'We are currently in the UI testing phase. I will answer with your real data soon!');
    }, 1000);
  };

  return (
    <div className="chat-widget-container">
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-header">
            <h4>🤖 AI Assistant</h4>
            <button onClick={toggleChat} className="close-btn">✖</button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <form className="chat-footer" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <button className="chat-fab" onClick={toggleChat}>
          💬 AI Assistant
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
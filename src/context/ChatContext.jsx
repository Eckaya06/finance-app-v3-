import { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your smart AI Finance Assistant. You can ask me about your expenses or budgets.' }
  ]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Uygulamanın herhangi bir yerinden bota mesaj göndermemizi sağlayacak sihirli fonksiyon
  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
    
    // Eğer bot kendi kendine (sistem uyarısı olarak) mesaj atıyorsa, pencereyi otomatik aç!
    if (sender === 'bot' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
import { useChat } from "../../context/ChatContext";
import { AIAssistantFAB } from "./AIAssistantFAB";
import ChatWidget from "./ChatWidget"; 

const AIChatSystem = () => {
  // ✅ DÜZELTME: isChatOpen yerine isOpen kullanıldı
  const { isOpen } = useChat();

  return (
    <>
      {/* Chat kapalıyken butonu göster */}
      {!isOpen && <AIAssistantFAB />}

      {/* Chat açıkken pencereyi göster */}
      {isOpen && <ChatWidget />}
    </>
  );
};

export default AIChatSystem;
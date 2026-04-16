import React, { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion"; 
import { useChat } from "../../context/ChatContext";

export const AIAssistantFAB = () => {
  const [isHovered, setIsHovered] = useState(false);
  // ✅ DÜZELTME: isChatOpen yerine isOpen kullanıldı
  const { isOpen, toggleChat, unreadCount } = useChat();

  // Chat açıkken butonu gizle
  if (isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isHovered && unreadCount > 0 && (
          <Motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-4 pointer-events-none"
          >
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-white text-xs font-semibold uppercase">
                  AI Alert: {unreadCount} new insight{unreadCount > 1 ? 's' : ''}
                </span>
              </div>
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900/80 backdrop-blur-xl border-r border-b border-white/20 rotate-45" />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <Motion.button
        onClick={toggleChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-16 h-16 rounded-[24px] bg-[#1e293b] text-white shadow-2xl cursor-pointer overflow-hidden border border-white/10"
      >
        <MessageSquareText size={26} strokeWidth={2.25} />

        <AnimatePresence>
          {unreadCount > 0 && (
            <Motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-4 right-4 z-20">
              <div className="flex items-center justify-center w-5 h-5 bg-[#ff3b30] rounded-full border-[2px] border-[#1e293b]">
                <span className="text-[10px] font-black text-white">{unreadCount}</span>
              </div>
              <Motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute inset-0 bg-[#ff3b30] rounded-full -z-10" />
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.button>
    </div>
  );
};
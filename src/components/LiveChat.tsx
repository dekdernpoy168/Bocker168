import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, User, ChevronDown, QrCode, MessageSquareText, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; time: string }[]>([
    { text: 'สวัสดีครับ Bocker168 ยินดีให้บริการครับ\n\n✅ ติดต่อสอบถาม : แอดไลน์ ID : @so168 (ต้องมี @ ด้านหน้าเท่านั้น)\n🚀 สมัครสมาชิก : https://inlnk.co/registerbocker168', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = {
      text: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');

    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: 'แอดมินกำลังตรวจสอบข้อมูลให้ครับ\n\n✅ ติดต่อสอบถาม : แอดไลน์ ID : @so168 (ต้องมี @ ด้านหน้าเท่านั้น)\n🚀 สมัครสมาชิก : https://inlnk.co/registerbocker168',
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-[320px] md:w-[360px] mb-4 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-red-700 rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">แอดมิน Bocker168</h3>
                  <p className="text-red-100 text-xs">ตอบกลับทันที</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-zinc-950 flex flex-col gap-4">
              <div className="text-center text-xs text-zinc-600 my-2">วันนี้</div>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.isUser 
                        ? 'bg-red-600 text-white rounded-tr-sm' 
                        : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {showQR && (
                <div className="p-4 bg-white rounded-lg mx-auto">
                  <img src="https://img1.pic.in.th/images/QR-code-registerbocker168.png" alt="QR Code" className="w-48 h-48" referrerPolicy="no-referrer" />
                  <p className="text-center text-zinc-800 text-xs mt-2">สแกนเพื่อสมัครสมาชิก</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-zinc-800 border-t border-zinc-700 flex gap-2">
              <button onClick={() => window.open('https://line.me/R/ti/p/@so168', '_blank')} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                <MessageSquareText className="w-3 h-3" />
                Line
              </button>
              <button onClick={() => window.open('https://inlnk.co/registerbocker168', '_blank')} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                <UserPlus className="w-3 h-3" />
                สมัคร
              </button>
              <button onClick={() => setShowQR(!showQR)} className="flex-1 bg-zinc-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                <QrCode className="w-3 h-3" />
                QR
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-zinc-900 border-t border-zinc-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="พิมพ์ข้อความ..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-full px-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-lg shadow-red-900/40 flex items-center justify-center relative z-50"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread Badge */}
        {!isOpen && hasUnread && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 border-2 border-zinc-900 rounded-full animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketService from '../services/socketService';

const ChatPopup = () => {
  const dispatch = useDispatch();
  const { userRole, studentName, chatMessages, socketConnected } = useSelector((state) => state.poll);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !socketConnected) {
      return;
    }

    const role = userRole === 'teacher' ? 'teacher' : 'student';
    socketService.sendChatMessage(message.trim(), role);
    setMessage('');
  };

  const unreadCount = chatMessages.filter(msg => !msg.read).length;

  return (
    <>
      <button
        className="btn btn-outline relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        💬 Chat
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-end pointer-events-none">
          <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={() => setIsOpen(false)} />
          <div className="relative w-full md:w-[400px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-2rem)] m-4 flex flex-col pointer-events-auto z-[1001] card animate-slide-up md:rounded-xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-xl font-semibold text-slate-900 m-0">Chat</h3>
              <button
                className="bg-transparent border-none text-2xl text-slate-600 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-xl transition-colors duration-200 hover:bg-slate-100"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isOwnMessage = 
                    (userRole === 'teacher' && msg.role === 'teacher') ||
                    (userRole === 'student' && msg.senderName === studentName);

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 animate-fade-in ${
                        isOwnMessage ? 'items-end' : ''
                      }`}
                    >
                      <div className={`flex gap-2 items-center text-xs ${
                        isOwnMessage ? 'flex-row-reverse' : ''
                      }`}>
                        <span className="font-semibold text-slate-600">
                          {msg.senderName}
                        </span>
                        <span className="text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className={`px-4 py-2 rounded-xl max-w-[80%] break-words ${
                        isOwnMessage 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="flex gap-2 pt-4 border-t border-slate-200" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="input flex-1"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!socketConnected}
              />
              <button
                type="submit"
                className="btn btn-primary flex-shrink-0"
                disabled={!message.trim() || !socketConnected}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;



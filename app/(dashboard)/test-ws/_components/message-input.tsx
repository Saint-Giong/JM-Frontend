import { useState } from 'react';

interface MessageInputProps {
  isConnected: boolean;
  onSendMessage: (message: string) => void;
}

export function MessageInput({ isConnected, onSendMessage }: MessageInputProps) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-800 mb-2">Send Custom Message</h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isConnected}
          className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!isConnected || !inputMessage.trim()}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

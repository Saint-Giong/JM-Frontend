import { useState } from 'react';

interface MessageInputProps {
  isConnected: boolean;
  onSendMessage: (message: string) => void;
}

export function MessageInput({
  isConnected,
  onSendMessage,
}: MessageInputProps) {
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
      <h2 className="mb-2 font-semibold text-gray-800 text-sm">
        Send Custom Message
      </h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isConnected}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!isConnected || !inputMessage.trim()}
          className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

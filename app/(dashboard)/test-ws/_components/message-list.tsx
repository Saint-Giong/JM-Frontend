import { Message } from '../use-websocket-test';

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: MessageItemProps) {
  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'sent':
        return 'bg-blue-100 border-blue-300';
      case 'received':
        return 'bg-green-100 border-green-300';
      case 'notification':
        return 'bg-yellow-100 border-yellow-300';
      case 'system':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getBadgeColor = (type: Message['type']) => {
    switch (type) {
      case 'sent':
        return 'bg-blue-200 text-blue-800';
      case 'received':
        return 'bg-green-200 text-green-800';
      case 'notification':
        return 'bg-yellow-200 text-yellow-800';
      case 'system':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`p-3 border-l-4 ${getMessageColor(message.type)}`}>
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${getBadgeColor(message.type)}`}
        >
          {message.type}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm text-gray-900 break-words">{message.content}</p>
      {message.data && (
        <details className="text-xs mt-1">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            Raw Data
          </summary>
          <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
            {JSON.stringify(message.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Messages ({messages.length})
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto border border-gray-200 rounded">
        {messages.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No messages yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

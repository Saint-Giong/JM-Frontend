import type { Message } from '@/hooks';

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
    <div className={`border-l-4 p-3 ${getMessageColor(message.type)}`}>
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`rounded px-2 py-0.5 font-semibold text-xs uppercase ${getBadgeColor(message.type)}`}
        >
          {message.type}
        </span>
        <span className="text-gray-500 text-xs">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="break-words text-gray-900 text-sm">{message.content}</p>
      {message.data && (
        <details className="mt-1 text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            Raw Data
          </summary>
          <pre className="mt-1 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
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
    <div className="flex flex-col overflow-hidden rounded-lg bg-white p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-sm">
          Messages ({messages.length})
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto rounded border border-gray-200">
        {messages.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
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

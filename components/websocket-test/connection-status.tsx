interface ConnectionStatusProps {
  isConnected: boolean;
  socketId: string;
}

export function ConnectionStatus({ isConnected, socketId }: ConnectionStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WebSocket Test</h1>
          <p className="text-sm text-gray-600">Send and receive messages</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-semibold">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {socketId && (
            <span className="text-xs text-gray-500">
              ID: <code className="bg-gray-100 px-2 py-0.5 rounded">{socketId.slice(0, 8)}...</code>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

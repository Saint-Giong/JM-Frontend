interface ConnectionStatusProps {
  isConnected: boolean;
  socketId: string;
}

export function ConnectionStatus({
  isConnected,
  socketId,
}: ConnectionStatusProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">WebSocket Test</h1>
          <p className="text-gray-600 text-sm">Send and receive messages</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="font-semibold text-sm">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {socketId && (
            <span className="text-gray-500 text-xs">
              ID:{' '}
              <code className="rounded bg-gray-100 px-2 py-0.5">
                {socketId.slice(0, 8)}...
              </code>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

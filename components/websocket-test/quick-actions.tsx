interface QuickActionsProps {
  isConnected: boolean;
  onTriggerNotification: () => void;
  onClearMessages: () => void;
}

export function QuickActions({
  isConnected,
  onTriggerNotification,
  onClearMessages,
}: QuickActionsProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        Quick Actions
      </h2>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onTriggerNotification}
          disabled={!isConnected}
          className="px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Trigger Test Notification
        </button>
        <button
          type="button"
          onClick={onClearMessages}
          className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Messages
        </button>
      </div>
    </div>
  );
}

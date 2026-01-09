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
      <h2 className="mb-2 font-semibold text-gray-800 text-sm">
        Quick Actions
      </h2>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onTriggerNotification}
          disabled={!isConnected}
          className="rounded bg-yellow-500 px-3 py-2 text-sm text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Trigger Test Notification
        </button>
        <button
          type="button"
          onClick={onClearMessages}
          className="rounded bg-red-500 px-3 py-2 text-sm text-white transition-colors hover:bg-red-600"
        >
          Clear Messages
        </button>
      </div>
    </div>
  );
}

export function Instructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
      <p className="font-semibold text-blue-900 mb-1">How to Use:</p>
      <ol className="list-decimal list-inside space-y-0.5 text-blue-800">
        <li>
          Start server:{' '}
          <code className="bg-blue-100 px-1 rounded">bun dev:mock-ws</code>
        </li>
        <li>Use Quick Actions or send custom messages</li>
        <li>Watch messages appear in real-time</li>
      </ol>
    </div>
  );
}

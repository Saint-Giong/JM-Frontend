export function Instructions() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50 p-3 text-xs">
      <p className="mb-1 font-semibold text-blue-900">How to Use:</p>
      <ol className="list-inside list-decimal space-y-0.5 text-blue-800">
        <li>
          Start server:{' '}
          <code className="rounded bg-blue-100 px-1">bun dev:mock-ws</code>
        </li>
        <li>Use Quick Actions or send custom messages</li>
        <li>Watch messages appear in real-time</li>
      </ol>
    </div>
  );
}

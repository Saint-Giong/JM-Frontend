'use client';

import { Button, ScrollArea } from '@saint-giong/bamboo-ui';
import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

interface JsonViewerProps {
  data: unknown;
  maxHeight?: string;
}

interface TokenSpan {
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation';
  content: string;
}

export function JsonViewer({ data, maxHeight = '400px' }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse JSON into tokens for syntax highlighting
  const tokens = useMemo(() => {
    const result: TokenSpan[] = [];
    const regex =
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],])/g;

    let lastIndex = 0;
    const matches = jsonString.matchAll(regex);

    for (const match of matches) {
      // Add whitespace/newlines between tokens
      if (match.index !== undefined && match.index > lastIndex) {
        result.push({
          type: 'punctuation',
          content: jsonString.slice(lastIndex, match.index),
        });
      }

      const value = match[0];
      let type: TokenSpan['type'] = 'punctuation';

      if (/^"/.test(value)) {
        if (/:$/.test(value)) {
          type = 'key';
        } else {
          type = 'string';
        }
      } else if (/true|false/.test(value)) {
        type = 'boolean';
      } else if (/null/.test(value)) {
        type = 'null';
      } else if (/^-?\d/.test(value)) {
        type = 'number';
      }

      result.push({ type, content: value });
      lastIndex = (match.index ?? 0) + value.length;
    }

    // Add any remaining content
    if (lastIndex < jsonString.length) {
      result.push({
        type: 'punctuation',
        content: jsonString.slice(lastIndex),
      });
    }

    return result;
  }, [jsonString]);

  const getTokenClassName = (type: TokenSpan['type']): string => {
    const classes: Record<TokenSpan['type'], string> = {
      key: 'text-blue-600 dark:text-blue-400',
      string: 'text-emerald-600 dark:text-emerald-400',
      number: 'text-amber-600 dark:text-amber-400',
      boolean: 'text-purple-600 dark:text-purple-400',
      null: 'text-rose-600 dark:text-rose-400',
      punctuation: 'text-foreground/70',
    };
    return classes[type];
  };

  return (
    <div className="relative rounded-md border bg-muted/30">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <ScrollArea style={{ maxHeight }} className="p-4">
        <pre className="whitespace-pre font-mono text-xs leading-relaxed">
          <code>
            {tokens.map((token, i) => (
              <span key={i} className={getTokenClassName(token.type)}>
                {token.content}
              </span>
            ))}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
}

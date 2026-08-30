import React from 'react';

interface FormattedTextProps {
  text?: string | null;
  className?: string;
  asInline?: boolean;
}

export function renderInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match bold (**text**), inline code (`text`), italic (*text* or _text_)
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-charcoal">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-dew-drop border border-charcoal/25 font-mono text-[0.88em] text-burnt-sienna font-bold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (
      ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) &&
      part.length >= 2
    ) {
      return (
        <em key={index} className="italic text-cocoa-ink">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = '',
  asInline = false,
}) => {
  if (!text) return null;

  if (asInline) {
    return <span className={className}>{renderInlineMarkdown(text)}</span>;
  }

  // Split into paragraphs by double newlines or multiple newlines
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInlineMarkdown(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

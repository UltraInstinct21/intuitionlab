import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const TrieVisualizer: React.FC = () => {
  interface TrieNode { id: number; char: string; children: Record<string, number>; isEnd: boolean; }
  const initialNodes: TrieNode[] = [
    { id: 0, char: '*', children: { a: 1, b: 4, c: 7 }, isEnd: false },
    { id: 1, char: 'a', children: { p: 2, n: 3 }, isEnd: false },
    { id: 2, char: 'p', children: {}, isEnd: true },
    { id: 3, char: 'n', children: {}, isEnd: true },
    { id: 4, char: 'b', children: { a: 5 }, isEnd: false },
    { id: 5, char: 'a', children: { d: 6 }, isEnd: false },
    { id: 6, char: 'd', children: {}, isEnd: true },
    { id: 7, char: 'c', children: { a: 8 }, isEnd: false },
    { id: 8, char: 'a', children: { t: 9 }, isEnd: false },
    { id: 9, char: 't', children: {}, isEnd: true },
  ];

  const [inputWord, setInputWord] = useState('bad');
  const [searchResult, setSearchResult] = useState<'found' | 'not_found' | null>(null);
  const [highlightPath, setHighlightPath] = useState<number[]>([]);
  const [mode, setMode] = useState<'view' | 'search'>('view');

  const search = () => {
    let current = 0;
    const path = [0];
    for (const ch of inputWord) {
      const node = initialNodes[current];
      if (!(ch in node.children)) { setHighlightPath(path); setSearchResult('not_found'); setMode('search'); return; }
      current = node.children[ch];
      path.push(current);
    }
    setHighlightPath(path);
    setSearchResult(initialNodes[current].isEnd ? 'found' : 'not_found');
    setMode('search');
  };

  const reset = () => { setHighlightPath([]); setSearchResult(null); setMode('view'); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2 flex-wrap">
          <input type="text" value={inputWord} onChange={e => setInputWord(e.target.value.toLowerCase())}
            placeholder="search word..."
            className="w-32 h-8 px-3 text-xs font-mono rounded-lg border border-outline bg-surface text-charcoal placeholder:text-on-surface-variant" />
          <Button size="sm" variant="primary" onClick={search} disabled={!inputWord} className="text-xs h-8 px-3">search</Button>
          <Button size="sm" variant="ghost" onClick={reset} className="h-8"><RotateCcw className="w-4 h-4" /></Button>
        </div>
        {mode === 'search' && (
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-pill ${searchResult === 'found' ? 'bg-sprout-sticker text-white' : 'bg-[#ba1a1a] text-white'}`}>
            {searchResult === 'found' ? `"${inputWord}" found` : `"${inputWord}" not found`}
          </span>
        )}
      </div>

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4 overflow-x-auto">
        <div className="flex items-center gap-6">
          {[0, 1, 4, 7].map(id => {
            const node = initialNodes[id];
            const isHighlighted = highlightPath.includes(id);
            return (
              <div key={id} className="flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                  {Object.entries(node.children).map(([ch, childId]) => {
                    const childIsHighlighted = highlightPath.includes(childId) && highlightPath.indexOf(childId) === highlightPath.indexOf(id) + 1;
                    return (
                      <React.Fragment key={ch}>
                        <div className="w-10 h-10 flex items-center justify-center font-mono font-bold text-sm rounded-full border-2 shadow-xs bg-surface-container text-on-surface-variant">{ch}</div>
                        <div className="flex items-center px-0.5">
                          <div className={`w-3 h-0.5 ${childIsHighlighted ? 'bg-sprout-sticker' : 'bg-charcoal'}`} />
                          <span className="text-xs">→</span>
                        </div>
                        <div className={`w-10 h-10 flex items-center justify-center font-mono font-bold text-sm rounded-full border-2 ${
                          childIsHighlighted ? 'border-sprout-sticker bg-[#22c55e]/15 shadow-sm' : 'border-charcoal bg-surface'
                        }`}>{initialNodes[childId].char}{initialNodes[childId].isEnd ? ' *' : ''}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <StepCard stepNumber={highlightPath.length} totalSteps={inputWord.length + 1}
        title={`Trie prefix search: "${inputWord}"`}
        whatHappens={mode === 'search' ? (searchResult === 'found' ? `Word "${inputWord}" exists in trie.` : `Prefix not found at char '${inputWord[highlightPath.length - 1] || inputWord[0]}'.`) : 'Insert words: app, an, bad, cat.'}
        whyRationale="Trie allows O(L) prefix search. Each node represents a character. Mark isEnd for complete words."
        variableStates={{ word: inputWord, path_traversed: highlightPath.map(id => initialNodes[id].char).join(' → ') || 'none' }}
        codeSnippet="node = root\nfor char in word:\n    if char not in node.children:\n        return False\n    node = node.children[char]\nreturn node.is_end"
        timeSpaceImpact="Time: O(L) search/insert | Space: O(N × L) total"
      />
    </div>
  );
};
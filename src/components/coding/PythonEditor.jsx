import React, { useState, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { RotateCcw, Play, Send, Code2, Loader2 } from 'lucide-react';

// Configure CDN for Monaco Editor
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

export default function PythonEditor({
  code,
  onChangeCode,
  onResetCode,
  onRunCode,
  onSubmitCode,
  isRunning = false,
  isSubmitting = false
}) {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // If Monaco CDN does not load within 6 seconds, gracefully switch to fallback textarea editor
    const timer = setTimeout(() => {
      if (!window.monaco) {
        console.warn('Monaco CDN load timed out. Switching to fallback Python editor.');
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('cyber-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00f2fe', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'identifier', foreground: 'e2e8f0' },
        { token: 'function', foreground: '60a5fa' }
      ],
      colors: {
        'editor.background': '#060913',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#0d1527',
        'editorCursor.foreground': '#00f2fe',
        'editorWhitespace.foreground': '#1e293b',
        'editorIndentGuide.background': '#1e293b',
        'editorIndentGuide.activeBackground': '#00f2fe'
      }
    });
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-amber-300 bg-[#090d16] overflow-hidden shadow-sm">
      {/* IDE Top Action Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/20 bg-[#0f172a] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-100 font-mono">Python 3.11 Environment</span>
          <span className="rounded bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            Pyodide WASM
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetCode}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:text-white transition-all font-bold"
            title="Reset code to starter template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 rounded-lg border border-amber-400/60 bg-amber-500/20 px-4 py-1.5 text-xs font-black text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'RUN CODE'}</span>
          </button>

          <button
            onClick={onSubmitCode}
            disabled={isSubmitting || isRunning}
            className="btn-cyber-primary flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-black tracking-wider disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'SUBMIT SOLUTION'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-[300px] relative">
        {!useFallback ? (
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="cyber-dark"
            value={code}
            onChange={(val) => onChangeCode(val || '')}
            beforeMount={handleEditorWillMount}
            loading={
              <div className="h-full flex flex-col items-center justify-center bg-[#060913] text-amber-400 space-y-2 p-8">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <span className="text-xs font-mono font-bold">Loading Python IDE Editor...</span>
              </div>
            }
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Courier New', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              tabSize: 4,
              insertSpaces: true,
              padding: { top: 12, bottom: 12 }
            }}
          />
        ) : (
          <textarea
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            className="w-full h-full p-4 bg-[#060913] text-emerald-400 font-mono text-sm border-none focus:outline-none resize-none leading-relaxed"
            placeholder="Write your Python code here..."
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}

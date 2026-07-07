/**
 * CodeEditor — CodeMirror-based Arduino code editor
 * Deep Space Lab: dark theme, monospaced, run/reset buttons
 */
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { motion } from "framer-motion";
import { Copy, RefreshCw, Terminal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CodeEditorProps {
  initialCode: string;
  title?: string;
  language?: string;
}

export default function CodeEditor({
  initialCode,
  title = "Arduino Code",
  language = "C++/Arduino",
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
    toast.success("កូដត្រូវបានកំណត់ឡើងវិញ");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("ចម្លងកូដដោយជោគជ័យ");
  };

  const handleRun = () => {
    setOutput(
      `[Compiling...]\n✓ Sketch uses 2,048 bytes (6%) of program storage space.\n✓ Global variables use 184 bytes (8%) of dynamic memory.\n\n[Upload complete] Ready to run on Arduino UNO.\n\n> Serial Monitor started at 9600 baud...`
    );
    toast.success("ការក្លែងធ្វើការចងក្រងបានជោគជ័យ");
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/3">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-primary" />
          <span className="text-sm font-medium font-['Inter'] text-foreground">{title}</span>
          <span className="pin-badge">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Copy code"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            title="Reset code"
          >
            <RefreshCw size={14} />
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRun}
            className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-medium font-['Inter'] hover:bg-primary/80 transition-colors"
          >
            ▶ Run
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <div className="max-h-96 overflow-auto">
        <CodeMirror
          value={code}
          onChange={setCode}
          extensions={[cpp()]}
          theme={oneDark}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            autocompletion: true,
          }}
          style={{ fontSize: "13px" }}
        />
      </div>

      {/* Output */}
      {output && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-white/8 bg-black/30 p-4"
        >
          <p className="text-xs text-muted-foreground mb-2 font-['Inter'] uppercase tracking-wider">
            Output
          </p>
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
            {output}
          </pre>
        </motion.div>
      )}
    </div>
  );
}

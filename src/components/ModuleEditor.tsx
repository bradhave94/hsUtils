import React, { useRef, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import { Editor as MonacoEditor } from '@monaco-editor/react';

interface ModuleEditorProps {
    moduleJson: string;
    fieldsJson: string;
}

export default function ModuleEditor({ moduleJson, fieldsJson }: ModuleEditorProps) {
    const [currentFile, setCurrentFile] = React.useState<'module' | 'fields'>('module');
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const moduleModelRef = useRef<editor.ITextModel | null>(null);
    const fieldsModelRef = useRef<editor.ITextModel | null>(null);

    const editorOptions: editor.IStandaloneEditorConstructionOptions = {
        minimap: { enabled: true },
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on' as const,
        wrappingIndent: 'indent',
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        folding: true,
        foldingStrategy: 'indentation',
        scrollBeyondLastLine: false,
        bracketPairColorization: { enabled: true },
        detectIndentation: true,
        insertSpaces: true,
        autoIndent: 'advanced',
        tabCompletion: 'on',
        multiCursorModifier: 'alt',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always'
    };

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
        editorRef.current = editor;

        // Create models for each file
        moduleModelRef.current = monaco.editor.createModel(
            moduleJson,
            'json',
            monaco.Uri.parse('file:///module.json')
        );
        fieldsModelRef.current = monaco.editor.createModel(
            fieldsJson,
            'json',
            monaco.Uri.parse('file:///fields.json')
        );

        // Set initial model
        editor.setModel(moduleModelRef.current);

        // Handle model changes
        moduleModelRef.current.onDidChangeContent(() => {
            const input = document.getElementById('moduleJson') as HTMLInputElement;
            if (input) {
                input.value = moduleModelRef.current?.getValue() || '';
            }
        });

        fieldsModelRef.current.onDidChangeContent(() => {
            const input = document.getElementById('fieldsJson') as HTMLInputElement;
            if (input) {
                input.value = fieldsModelRef.current?.getValue() || '';
            }
        });

        // Add command to switch between files
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Tab, () => {
            const newFile = currentFile === 'module' ? 'fields' : 'module';
            switchFile(newFile);
        });
    };

    const switchFile = (file: 'module' | 'fields') => {
        if (!editorRef.current) return;
        
        setCurrentFile(file);
        if (file === 'module' && moduleModelRef.current) {
            editorRef.current.setModel(moduleModelRef.current);
        } else if (file === 'fields' && fieldsModelRef.current) {
            editorRef.current.setModel(fieldsModelRef.current);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="editor-tabs flex bg-[#252526] border-b border-[#1E1E1E]">
                <button 
                    type="button"
                    className={`px-3 py-2 text-sm flex items-center gap-2 ${
                        currentFile === 'module' 
                            ? 'bg-[#1E1E1E] text-white border-t-2 border-t-blue-500' 
                            : 'text-[#969696] hover:bg-[#2D2D2D]'
                    } transition-colors duration-150 ease-in-out`}
                    onClick={() => switchFile('module')}
                >
                    <span className="codicon codicon-json">{ }</span>
                    module.json
                </button>
                <button 
                    type="button"
                    className={`px-3 py-2 text-sm flex items-center gap-2 ${
                        currentFile === 'fields' 
                            ? 'bg-[#1E1E1E] text-white border-t-2 border-t-blue-500' 
                            : 'text-[#969696] hover:bg-[#2D2D2D]'
                    } transition-colors duration-150 ease-in-out`}
                    onClick={() => switchFile('fields')}
                >
                    <span className="codicon codicon-json">{ }</span>
                    fields.json
                </button>
            </div>
            <MonacoEditor
                height="70vh"
                theme="vs-dark"
                options={editorOptions}
                onMount={handleEditorDidMount}
                loading={<div className="text-white p-4">Loading editor...</div>}
            />
        </div>
    );
}

// Add this CSS either globally or in your component
const styles = `
    .editor-tabs {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", system-ui, Ubuntu, "Droid Sans", sans-serif;
    }

    .editor-tabs button {
        position: relative;
        border: none;
        outline: none;
        user-select: none;
    }

    .editor-tabs button::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 1px;
        background: transparent;
        transition: background-color 0.2s ease;
    }

    .editor-tabs button:hover::after {
        background: #424242;
    }

    .editor-tabs button[class*="border-t-blue-500"]::after {
        background: #1E1E1E;
    }

    .codicon {
        font-family: codicon;
        font-size: 16px;
        color: #75BEFF;
    }

    /* Add some spacing between tabs */
    .editor-tabs button + button {
        margin-left: 1px;
    }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
} 
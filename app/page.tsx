'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCode, 
  Search, 
  Bot, 
  Terminal, 
  Settings, 
  Undo2, 
  Redo2, 
  Save, 
  Wand2, 
  FileJson, 
  Download, 
  FileDown, 
  Smartphone, 
  Play, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  Plus, 
  Upload, 
  Menu, 
  X, 
  Copy, 
  Edit3, 
  Trash2,
  MoreVertical,
  Monitor,
  Tablet,
  RefreshCw,
  Maximize2,
  CheckCircle2,
  History,
  Wifi,
  BatteryFull,
  SignalHigh,
  GripVertical
} from 'lucide-react';
import { saveProject, loadProject, ProjectData, ProjectFile } from '@/lib/storage';
import * as Tooltip from '@radix-ui/react-tooltip';
import { 
  Panel as ResizablePanel, 
  Group as ResizablePanelGroup, 
  Separator as ResizableHandle 
} from 'react-resizable-panels';

// Monaco CDN
const MONACO_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs';

export default function JubaEditorPro() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const [code, setCode] = useState<ProjectData>({
    id: 'default',
    files: [
      { 
        id: '1', 
        name: 'index.html', 
        language: 'html', 
        content: '<!-- Welcome to JUBA Editor Pro -->\n<div class="juba-container">\n  <h1>SYStem:// Booting...</h1>\n  <p>Your workspace is ready.</p>\n  <div class="pulse"></div>\n</div>' 
      },
      { 
        id: '2', 
        name: 'styles.css', 
        language: 'css', 
        content: 'body {\n  background: #0A0F2C;\n  color: #00E8FF;\n  font-family: "Space Grotesk", sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.juba-container {\n  text-align: center;\n  padding: 2rem;\n  border: 1px solid rgba(0, 232, 255, 0.2);\n  backdrop-filter: blur(10px);\n}\n\n.pulse {\n  width: 20px;\n  height: 20px;\n  background: #64FFDA;\n  border-radius: 50%;\n  margin: 1rem auto;\n  animation: pulse 1.5s infinite;\n}\n\n@keyframes pulse {\n  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(100, 255, 218, 0.7); }\n  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(100, 255, 218, 0); }\n  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(100, 255, 218, 0); }\n}' 
      },
      { 
        id: '3', 
        name: 'main.js', 
        language: 'javascript', 
        content: '// JUBA Pro Logic\nconsole.log("Sys:// System Online.");' 
      },
    ],
    activeFileId: '1',
    updatedAt: 0
  });

  const [activeSidebarTab, setActiveSidebarTab] = useState<'explorer' | 'search' | 'ai'>('explorer');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJsEnabled, setIsJsEnabled] = useState(true);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, fileId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const [logs, setLogs] = useState<string[]>([
    '[نظام] تم تهيئة طبقة تخزين IndexedDB.',
    '[نظام] تم تحميل محرك Monaco الإصدار 0.45 بنجاح.',
    '[جوبا] تم تطبيق هوية v6.0 على مكونات واجهة المستخدم.'
  ]);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString('ar-EG')}] ${msg}`]);
  }, []);

  const activeFile = (code?.files || []).find(f => f.id === code?.activeFileId) || code?.files?.[0] || { id: '0', name: 'unknown', language: 'html', content: '' };
  const [aiInput, setAiInput] = useState('');
  const [aiLogs, setAiLogs] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

  // Gen PWA Logic
  const genPWA = useCallback(() => {
    addLog('نظام: جاري إنشاء أصول PWA...');
    
    setCode(prev => {
      const hasManifest = prev.files.some(f => f.name === 'manifest.json');
      const hasSW = prev.files.some(f => f.name === 'sw.js');
      
      let newFiles = [...prev.files];
      
      if (!hasManifest) {
        newFiles.push({
          id: Date.now().toString() + '-m',
          name: 'manifest.json',
          language: 'json' as any,
          content: JSON.stringify({
            name: "JUBA Project",
            short_name: "JUBA",
            start_url: "/",
            display: "standalone",
            background_color: "#0d0f14",
            theme_color: "#00e5ff",
            icons: [{ src: "https://picsum.photos/192", sizes: "192x192", type: "image/png" }]
          }, null, 2)
        });
      }
      
      if (!hasSW) {
        newFiles.push({
          id: Date.now().toString() + '-sw',
          name: 'sw.js',
          language: 'javascript',
          content: `const CACHE = 'juba-pwa-v1';\nself.addEventListener('install', e => {\n  console.log('SW Installed');\n});`
        });
      }
      
      return { ...prev, files: newFiles, updatedAt: Date.now() };
    });
    
    addLog('✅ تم إضافة ملفات manifest.json و sw.js للمشروع.');
  }, [addLog]);

  const handleAiSend = useCallback(() => {
    if (!aiInput.trim()) return;
    
    const userMsg = aiInput.trim();
    setAiLogs(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    
    addLog(`[جوبا] جاري معالجة الطلب: ${userMsg.slice(0, 20)}...`);
    
    setTimeout(() => {
      let aiResponse = "أنا أفهم طلبك. جاري تحليل الكود...";
      if (userMsg.includes('زر')) aiResponse = "يمكنك إضافة زر باستخدام <button> في HTML وتنسيقه في CSS.";
      if (userMsg.includes('خطأ')) aiResponse = "تحقق من الكونسول في الطرفية أسفل المحرر لرؤية تفاصيل الخطأ.";
      
      setAiLogs(prev => [...prev, { role: 'ai', text: aiResponse }]);
      addLog(`[جوبا] تم توليد الرد.`);
    }, 1000);
  }, [aiInput, addLog]);

  const setActiveFileId = (id: string) => {
    setCode(prev => ({ ...prev, activeFileId: id }));
  };

  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [monacoError, setMonacoError] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const monacoRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Load Prettier
  useEffect(() => {
    const scripts = [
      { src: 'https://unpkg.com/prettier@3.0.3/standalone.js', cross: 'anonymous' },
      { src: 'https://unpkg.com/prettier@3.0.3/plugins/html.js', cross: 'anonymous' },
      { src: 'https://unpkg.com/prettier@3.0.3/plugins/css.js', cross: 'anonymous' },
      { src: 'https://unpkg.com/prettier@3.0.3/plugins/babel.js', cross: 'anonymous' },
      { src: 'https://unpkg.com/prettier@3.0.3/plugins/estree.js', cross: 'anonymous' }
    ];
    scripts.forEach(({ src, cross }) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement('script');
        s.src = src;
        if (cross) s.setAttribute('crossorigin', cross);
        document.body.appendChild(s);
      }
    });
  }, []);

  const handleUndo = useCallback(() => {
    editor?.trigger('undo', 'undo', null);
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor?.trigger('redo', 'redo', null);
  }, [editor]);

  const handleFormat = useCallback(async () => {
    if (!editor) return;
    const prettier = (window as any).prettier;
    const plugins = (window as any).prettierPlugins;

    if (prettier && plugins) {
      const currentCode = editor.getValue();
      const lang = activeFile.language;
      let parser = 'babel';
      if (lang === 'html') parser = 'html';
      if (lang === 'css') parser = 'css';

      try {
        const formatted = await prettier.format(currentCode, {
          parser,
          plugins: Object.values(plugins),
          semi: true,
          singleQuote: true
        });
        editor.setValue(formatted);
        addLog('✨ تم تنسيق الكود باستخدام Prettier.');
        return;
      } catch (e) {
        console.error(e);
      }
    }

    editor.getAction('editor.action.formatDocument')?.run();
    addLog('تنبيه: تم استخدام المنسق الافتراضي.');
  }, [editor, activeFile.language, addLog]);

  const handleTerminalCmd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.trim().toLowerCase();
      addLog(`$ ${terminalInput}`);
      setTerminalInput('');
      
      if (cmd === 'clear') {
        setLogs([]);
      } else if (cmd === 'ls') {
        addLog(code.files.map(f => f.name).join('  '));
      } else if (cmd === 'help') {
        addLog('الأوامر المتاحة: clear, ls, help, run, import');
      } else if (cmd === 'import') {
        document.getElementById('file-import')?.click();
        addLog('جاري طلب الوصول إلى ملفات النظام...');
      } else if (cmd === 'run') {
        runCode();
      } else {
        addLog(`خطأ: الأمر "${cmd}" غير موجود.`);
      }
    }
  };

  // Initialize JUBA Signature
  useEffect(() => {
    console.log(
      '%c JUBA v6.0 %c Sys:// IDE Online %c',
      'background: #00E8FF; color: #0A0F2C; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
      'background: #1D2A5E; color: #FFFFFF; padding: 4px 8px; border-radius: 0 4px 4px 0;',
      ''
    );

    // Initial Load
    const loadSaved = async () => {
      const saved = await loadProject('default');
      if (saved) setCode(saved);
      else setCode(prev => ({ ...prev, updatedAt: Date.now() }));
    };
    loadSaved();
  }, []);

  // Emergency Save
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProject({ ...code, updatedAt: Date.now() });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [code]);

  // Load Monaco
  useEffect(() => {
    const loadMonaco = async () => {
      const timeout = setTimeout(() => {
        if (!monacoRef.current) setMonacoError(true);
      }, 5000);

      try {
        if ((window as any).monaco) {
          setMonacoLoaded(true);
          clearTimeout(timeout);
          return;
        }

        const scriptExists = document.querySelector(`script[src="${MONACO_CDN}/loader.js"]`);
        if (scriptExists) return;

        const script = document.createElement('script');
        script.src = `${MONACO_CDN}/loader.js`;
        script.onload = () => {
          const loader = (window as any).require;
          loader.config({ paths: { vs: MONACO_CDN } });
          loader(['vs/editor/editor.main'], () => {
            setMonacoLoaded(true);
            clearTimeout(timeout);
          });
        };
        document.body.appendChild(script);
      } catch (err) {
        setMonacoError(true);
      }
    };

    loadMonaco();
  }, []);

  // Init Editor
  useEffect(() => {
    if (monacoLoaded && containerRef.current && !editor) {
      const monaco = (window as any).monaco;
      const ed = monaco.editor.create(containerRef.current, {
        value: activeFile.content,
        language: activeFile.language,
        theme: 'vs-dark',
        automaticLayout: true,
        fontFamily: 'JetBrains Mono',
        fontSize: 14,
        minimap: { enabled: false },
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        colors: {
          'editor.background': '#0A0F2C',
        }
      });

      ed.onDidChangeModelContent(() => {
        const newValue = ed.getValue();
        setCode(prev => ({
          ...prev,
          files: (prev.files || []).map(f => f.id === prev.activeFileId ? { ...f, content: newValue } : f),
          updatedAt: Date.now()
        }));
      });

      setEditor(ed);
    }
  }, [monacoLoaded, editor, activeFile.content, activeFile.language]);

  const insertTemplate = useCallback((type: string) => {
    const templates: Record<string, string> = {
      'html5': '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <title>مشروع جديد</title>\n</head>\n<body>\n  <h1>مرحباً بك</h1>\n</body>\n</html>',
      'react': "import React, { useState } from 'react';\n\nexport default function App() {\n  const [val, setVal] = useState(0);\n  return (\n    <div>\n       <h1>Count: {val}</h1>\n       <button onClick={() => setVal(v => v + 1)}>+</button>\n    </div>\n  );\n}",
      'css-reset': '* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: sans-serif; }',
      'pwa': '// Service Worker\nconst CACHE = "v1";\nself.addEventListener("install", e => {\n  console.log("PWA Installed");\n});'
    };

    if (templates[type]) {
      setCode(prev => ({
        ...prev,
        files: prev.files.map(f => f.id === prev.activeFileId ? { ...f, content: templates[type] } : f),
        updatedAt: Date.now()
      }));
      addLog(`تم إدراج قالب: ${type}`);
    }
  }, [addLog]);

  // Handle Tab Switch & External Changes
  useEffect(() => {
    if (editor) {
      const monaco = (window as any).monaco;
      const model = editor.getModel();
      if (model) {
        const currentLang = model.getLanguageId();
        const targetLang = activeFile.language;
        if (currentLang !== targetLang) {
          monaco.editor.setModelLanguage(model, targetLang);
        }
        
        const currentValue = editor.getValue();
        if (activeFile.content !== currentValue) {
          editor.setValue(activeFile.content);
        }
      }
    }
  }, [editor, activeFile.content, activeFile.language]);

  // Run Code (Secure Sandbox)
  const runCode = useCallback(() => {
    if (!previewRef.current) return;
    addLog('نظام: جاري حقن المصدر في بيئة الاختبار...');

    const htmlFiles = (code.files || []).filter(f => f.name.endsWith('.html'));
    const activeFileIsHtml = activeFile.name.endsWith('.html');
    
    // Pick the entry point: active file if it's HTML, otherwise index.html, otherwise the first HTML, otherwise first file
    const htmlFile = activeFileIsHtml ? activeFile : 
                    (htmlFiles.find(f => f.name === 'index.html') || htmlFiles[0] || code.files[0] || { content: '' });

    const cssFiles = (code.files || []).filter(f => f.name.endsWith('.css')).map(f => f.content).join('\n');
    const jsFilesList = (code.files || []).filter(f => f.name.endsWith('.js') || f.language === 'javascript');
    const jsFilesContent = jsFilesList.map(f => f.content).join('\n').replace(/<\/script>/g, '<\\/script>');

    // Process HTML to add crossorigin to external scripts to help catch errors
    const processedHtml = htmlFile.content.replace(/<script\s+([^>]*?)src\s*=\s*(["']?)(https?:\/\/[^"'\s>]+)\2([^>]*)>/gi, (match, before, quote, src, after) => {
      const allAttrs = (before + ' ' + after).toLowerCase();
      if (!allAttrs.includes('crossorigin')) {
        return `<script ${before} src=${quote}${src}${quote} crossorigin="anonymous" ${after}>`;
      }
      return match;
    });

    const fullCode = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style id="juba-styles">${cssFiles}</style>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <script id="juba-bridge">
            // JUBA Bridge
            (function() {
              window.JUBA = {
                log: (msg, type = 'log') => {
                  window.parent.postMessage({ type: 'juba-log', message: msg, lvl: type }, '*');
                },
                toast: (msg) => {
                  window.parent.postMessage({ type: 'juba-toast', message: msg }, '*');
                }
              };

              // Capture unhandled promise rejections
              window.addEventListener('unhandledrejection', function(event) {
                const reason = event.reason;
                const message = reason?.stack || reason?.message || String(reason);
                window.JUBA.log('Unhandled Promise Rejection: ' + message, 'error');
              });

              // Catch script loading errors (CORS or 404)
              window.addEventListener('error', function(event) {
                if (event.target && event.target.tagName === 'SCRIPT') {
                  const src = event.target.src;
                  window.JUBA.log('فشل في تحميل السكربت الخارجي: ' + src + '. تأكد من صحة الرابط ودعم CORS.', 'error');
                }
              }, true);

              // Sync Console
              const originalLog = console.log;
              const originalError = console.error;
              
              const safeStringify = (obj) => {
                if (obj === undefined) return 'undefined';
                if (obj === null) return 'null';
                try {
                  return JSON.stringify(obj, (key, value) => 
                    typeof value === 'bigint' ? value.toString() : value
                  );
                } catch (e) {
                  return '[Circular or Unserializable Object]';
                }
              };

              console.log = (...args) => {
                originalLog(...args);
                const message = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');
                window.parent.postMessage({ type: 'juba-log', message: message, lvl: 'log' }, '*');
              };

              console.error = (...args) => {
                originalError(...args);
                const message = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');
                window.parent.postMessage({ type: 'juba-log', message: message, lvl: 'error' }, '*');
              };

              window.onerror = (msg, url, line, col, error) => {
                const message = String(msg).toLowerCase();
                if (message.includes('script error')) {
                  window.JUBA.log('External Script Error: تم حجب تفاصيل الخطأ بواسطة المتصفح (CORS). لقد حاولنا إضافة crossorigin="anonymous"، ولكن يبدو أن الخادم الخارجي لا يرسل ترويسات CORS الصحيحة. تحقق من كونسول المتصفح (F12) لمزيد من التفاصيل.', 'error');
                  return false;
                }
                const errorMessage = error?.stack || (msg + ' (at ' + line + ':' + col + ')');
                window.JUBA.log('Error: ' + errorMessage, 'error');
                return false;
              };
            })();
          </script>
        </head>
        <body>
          ${processedHtml}
          ${(isJsEnabled && jsFilesContent) ? `
          <script id="juba-user-scripts">
            (function() {
              try {
                ${jsFilesContent}
              } catch (err) {
                window.JUBA.log("Runtime Error: " + (err.stack || err.message), 'error');
              }
            })();
          </script>` : ''}
        </body>
      </html>
    `;

    const blob = new Blob([fullCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Cleanup previous URL if any
    const iframe = previewRef.current;
    if (iframe) {
      const oldUrl = iframe.src;
      iframe.src = url;
      if (oldUrl.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(oldUrl), 100);
      }
    }
  }, [code, addLog, isJsEnabled, isFullscreenPreview, activeFile]);

  useEffect(() => {
    const timer = setTimeout(runCode, 1000);
    return () => clearTimeout(timer);
  }, [code.files, runCode, isJsEnabled, isFullscreenPreview]);

  // Handle Bridge Messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'juba-log') {
        addLog(`[معاينة] ${e.data.message}`);
      }
      if (e.data?.type === 'juba-toast') {
        addLog(`[تنبيه] ${e.data.message}`);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addLog]);

  // Manual Save with feedback
  const handleSave = useCallback(async () => {
    await saveProject(code);
    setShowSaved(true);
    addLog('نظام: تم مزامنة الحالة مع IndexedDB.');
    setTimeout(() => setShowSaved(false), 2000);
  }, [code, addLog]);

  // Download Current File
  const downloadFile = useCallback((file: ProjectFile) => {
    addLog(`نظام: جاري تحميل الملف ${file.name}...`);
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [addLog]);

  // Download Project as Bundle
  const downloadProject = useCallback(() => {
    addLog('نظام: جاري تهيئة حزمة التصدير...');
    const htmlFile = (code.files || []).find(f => f.name.endsWith('.html')) || code.files?.[0] || { content: '' };
    const cssFiles = (code.files || []).filter(f => f.name.endsWith('.css')).map(f => f.content).join('\n');
    const jsFiles = (code.files || []).filter(f => f.name.endsWith('.js') || f.language === 'javascript').map(f => f.content).join('\n');

    const fullCode = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>تصدير JUBA - ${new Date().toLocaleDateString('ar-EG')}</title>
          <style>${cssFiles}</style>
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          ${htmlFile.content}
          <script>${jsFiles}</script>
        </body>
      </html>
    `;
    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `juba_project_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, addLog]);

  // Add New File
  const addFile = useCallback(() => {
    let name = prompt('أدخل اسم الملف (مثلاً: about.html):');
    if (!name) return;

    // Ensure unique name
    let finalName = name;
    let counter = 1;
    while (code.files.some(f => f.name === finalName)) {
      const parts = name.split('.');
      if (parts.length > 1) {
        const ext = parts.pop();
        finalName = `${parts.join('.')}_${counter}.${ext}`;
      } else {
        finalName = `${name}_${counter}`;
      }
      counter++;
    }

    const extension = finalName.split('.').pop()?.toLowerCase();
    let language: 'html' | 'css' | 'javascript' = 'html';
    if (extension === 'css') language = 'css';
    if (extension === 'js') language = 'javascript';

    const newFile = {
      id: Date.now().toString(),
      name: finalName,
      language,
      content: language === 'html' ? '<!-- New Page -->' : ''
    };

    setCode(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: newFile.id,
      updatedAt: Date.now()
    }));
    addLog(`تم إنشاء ملف جديد: ${finalName}`);
  }, [code.files, addLog]);

  // Delete File
  const deleteFile = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (code.files.length <= 1) {
      addLog('تنبيه: لا يمكن حذف آخر ملف في المشروع.');
      return;
    }
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;

    setCode(prev => {
      const newFiles = (prev.files || []).filter(f => f.id !== id);
      const newActiveId = prev.activeFileId === id ? newFiles?.[0]?.id : prev.activeFileId;
      return { ...prev, files: newFiles, activeFileId: newActiveId, updatedAt: Date.now() };
    });
    addLog('تم حذف الملف بنجاح.');
  }, [code.files.length, addLog]);

  // Rename File
  const renameFile = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const file = code.files.find(f => f.id === id);
    if (!file) return;
    const newName = prompt('أدخل الاسم الجديد:', file.name);
    if (!newName || newName === file.name) return;

    if (code.files.some(f => f.name === newName)) {
      alert('خطأ: يوجد ملف آخر بهذا الاسم.');
      return;
    }

    setCode(prev => ({
      ...prev,
      files: prev.files.map(f => f.id === id ? { ...f, name: newName } : f),
      updatedAt: Date.now()
    }));
    addLog(`تم تغيير اسم الملف من ${file.name} إلى ${newName}`);
  }, [code.files, addLog]);

  // Duplicate File
  const duplicateFile = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const file = code.files.find(f => f.id === id);
    if (!file) return;
    
    const parts = file.name.split('.');
    const extension = parts.pop();
    const baseName = parts.join('.');
    
    let newName = `${baseName}_نسخة.${extension}`;
    let counter = 1;
    while (code.files.some(f => f.name === newName)) {
      newName = `${baseName}_نسخة_${counter}.${extension}`;
      counter++;
    }

    const newFile = {
      ...file,
      id: Date.now().toString(),
      name: newName
    };

    setCode(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: newFile.id,
      updatedAt: Date.now()
    }));
    addLog(`تم تكرار الملف: ${newName}`);
  }, [code.files, addLog]);

  // Search Results
  const searchResults = searchQuery.trim() ? code.files.flatMap(file => {
    const lines = file.content.split('\n');
    return lines.map((line, index) => {
      if (line.toLowerCase().includes(searchQuery.toLowerCase())) {
        return { file, line: line.trim(), lineNumber: index + 1 };
      }
      return null;
    }).filter(Boolean);
  }) : [];

  // Import Files from Device
  const importFiles = useCallback(async (files: File[]) => {
    addLog(`جاري استيراد ${files.length} ملفات...`);
    
    const newFiles: ProjectFile[] = [];
    
    for (const file of files) {
      try {
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });

        const extension = file.name.split('.').pop()?.toLowerCase();
        let language: 'html' | 'css' | 'javascript' = 'html';
        if (extension === 'css') language = 'css';
        if (extension === 'js') language = 'javascript';

        newFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          language,
          content
        });
      } catch (err) {
        addLog(`فشل استيراد ${file.name}`);
      }
    }

    if (newFiles.length > 0) {
      setCode(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles],
        activeFileId: newFiles[newFiles.length - 1].id,
        updatedAt: Date.now()
      }));
      addLog(`تم استيراد ${newFiles.length} ملفات بنجاح.`);
    }
  }, [addLog]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0d0f14] text-[#cdd6e0]">
      <Tooltip.Provider delayDuration={400}>
        {/* Top Header */}
      <header className="flex h-10 items-center justify-between border-b border-[#2a2e36] px-3 bg-[#16191e] z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#00e5ff] font-mono font-bold text-xs">⚡ JUBA</span>
            <div className="h-4 w-[1px] bg-[#2a2e36] mx-1" />
          </div>
          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
            <HeaderButton onClick={handleUndo} icon={<Undo2 size={14} />} title="تراجع" />
            <HeaderButton onClick={handleRedo} icon={<Redo2 size={14} />} title="إعادة" />
            <div className="w-2" />
            <HeaderAction onClick={handleSave} icon={<Save size={14} />} label="حفظ" active={showSaved} />
            <HeaderAction onClick={handleFormat} icon={<Wand2 size={14} />} label="تنسيق" />
            <HeaderAction onClick={() => {
              const res = prompt('قالب: (html5, react, css-reset, pwa)');
              if (res) insertTemplate(res);
            }} icon={<FileJson size={14} />} label="قالب" />
            <HeaderAction onClick={() => downloadFile(activeFile)} icon={<Download size={14} />} label="تحميل" />
            <HeaderAction onClick={downloadProject} icon={<FileDown size={14} />} label="تصدير" />
            <HeaderAction onClick={genPWA} icon={<Smartphone size={14} />} label="PWA" />
            <HeaderAction onClick={runCode} icon={<Play size={14} />} label="تشغيل" primary />
            <HeaderAction onClick={() => setShowPreview(!showPreview)} icon={showPreview ? <EyeOff size={14} /> : <Eye size={14} />} label={showPreview ? "إخفاء المعاينة" : "إظهار المعاينة"} />
            <HeaderAction onClick={() => setActiveSidebarTab('ai')} icon={<Bot size={14} />} label="AI" ai />
          </nav>
        </div>
        
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-1.5 text-[#00e5ff]"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 bg-[#1e2228] border border-[#2a2e36] rounded text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
              <span className="opacity-70">نظام : جاهز</span>
            </div>
            <button 
              onClick={() => document.getElementById('file-import')?.click()}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#00e5ff] text-black text-[11px] font-bold rounded hover:brightness-110 transition-all active:scale-95"
            >
              <Upload size={16} />
              <span>نشر المشروع</span>
            </button>
          </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-10 inset-x-0 bg-[#16191e] border-b border-[#2a2e36] p-4 grid grid-cols-2 gap-2 z-[40] sm:hidden"
          >
            <HeaderAction onClick={handleSave} icon={<Save size={14} />} label="حفظ" />
            <HeaderAction onClick={handleFormat} icon={<Wand2 size={14} />} label="تنسيق" />
            <HeaderAction onClick={() => { setIsMobileMenuOpen(false); document.getElementById('file-import')?.click(); }} icon={<Upload size={14} />} label="استيراد" />
            <HeaderAction onClick={() => { setIsMobileMenuOpen(false); downloadProject(); }} icon={<FileDown size={14} />} label="تصدير" />
            <HeaderAction onClick={() => { setIsMobileMenuOpen(false); genPWA(); }} icon={<Smartphone size={14} />} label="PWA" />
            <HeaderAction onClick={() => { setIsMobileMenuOpen(false); runCode(); }} icon={<Play size={14} />} label="تشغيل" primary />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Module 1: Tool Sidebar (Fixed Width) */}
        <aside className="w-12 flex flex-col items-center border-l border-[#2a2e36] bg-[#16191e] py-2 z-30">
          <SidebarIcon 
            icon={<FileCode size={20} />} 
            active={activeSidebarTab === 'explorer'} 
            onClick={() => { setActiveSidebarTab('explorer'); setSidebarCollapsed(false); }} 
            label="المستكشف" 
          />
          <SidebarIcon 
            icon={<Search size={20} />} 
            active={activeSidebarTab === 'search'} 
            onClick={() => { setActiveSidebarTab('search'); setSidebarCollapsed(false); }} 
            label="البحث" 
          />
          <SidebarIcon 
            icon={<Bot size={20} />} 
            active={activeSidebarTab === 'ai'} 
            onClick={() => { setActiveSidebarTab('ai'); setSidebarCollapsed(false); }} 
            label="مساعد AI" 
          />
          <div className="mt-auto space-y-1">
            <SidebarIcon icon={<Terminal size={20} />} active={false} onClick={() => {}} label="الطرفية" />
            <SidebarIcon icon={<Settings size={20} />} active={false} onClick={() => {}} label="الإعدادات" />
          </div>
        </aside>

        <ResizablePanelGroup orientation="horizontal">
          {/* Module 2: Side Panel (Resizable) */}
          {!sidebarCollapsed && (
            <ResizablePanel 
              defaultSize={20} 
              minSize={10} 
              maxSize={40}
              className="flex flex-col bg-[#0d0f14] border-l border-[#2a2e36] shrink-0 relative z-20"
            >
              {activeSidebarTab === 'explorer' && (
                <>
                  <div className="p-2 px-3 text-[10px] uppercase font-bold text-[#7a8490] border-b border-[#2a2e36] flex justify-between items-center bg-[#16191e]/50">
                    <span>المستكشف</span>
                    <div className="flex gap-1">
                      <JubaTooltip content="استيراد من الجهاز">
                        <button onClick={() => document.getElementById('file-import')?.click()} className="hover:text-[#00e5ff] p-1"><Upload size={14} /></button>
                      </JubaTooltip>
                      <JubaTooltip content="ملف جديد">
                        <button onClick={addFile} className="hover:text-[#00e5ff] p-1"><Plus size={14} /></button>
                      </JubaTooltip>
                      <JubaTooltip content="طي القائمة">
                        <button onClick={() => setSidebarCollapsed(true)} className="hover:text-[#00e5ff] p-1"><ChevronRight size={14} /></button>
                      </JubaTooltip>
                    </div>
                  </div>
                  <div className="flex-1 py-1 overflow-y-auto flex flex-col no-scrollbar">
                    <div className="px-4 py-1 text-[9px] text-[#7a8490] uppercase tracking-tighter opacity-50 font-mono">JUBA-WORKSPACE</div>
                    {code.files.map(file => (
                      <ExplorerItem 
                        key={file.id}
                        label={file.name} 
                        active={code.activeFileId === file.id} 
                        onClick={() => setActiveFileId(file.id)}
                        icon={fileIcon(file)}
                        onDelete={(e) => deleteFile(file.id, e)}
                        onRename={(e) => renameFile(file.id, e)}
                        onDuplicate={(e) => duplicateFile(file.id, e)}
                        onDownload={(e) => { e.stopPropagation(); downloadFile(file); }}
                        onContextMenu={(e) => handleContextMenu(e, file.id)}
                      />
                    ))}
                  </div>
                </>
              )}

              {contextMenu && (
                <div 
                  className="fixed bg-[#16191e] border border-[#2a2e36] rounded-lg shadow-2xl py-1 z-[100] min-w-[140px]"
                  style={{ top: contextMenu.y, left: contextMenu.x }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div onClick={() => { setActiveFileId(contextMenu.fileId); setContextMenu(null); }} className="px-3 py-2 text-[11px] hover:bg-white/5 cursor-pointer flex items-center gap-2">
                    <Play size={14} /> فتح الملف
                  </div>
                  <div onClick={(e) => { renameFile(contextMenu.fileId, e as any); setContextMenu(null); }} className="px-3 py-2 text-[11px] hover:bg-white/5 cursor-pointer flex items-center gap-2">
                    <Edit3 size={14} /> إعادة تسمية
                  </div>
                  <div onClick={(e) => { duplicateFile(contextMenu.fileId, e as any); setContextMenu(null); }} className="px-3 py-2 text-[11px] hover:bg-white/5 cursor-pointer flex items-center gap-2">
                    <Copy size={14} /> تكرار
                  </div>
                  <div className="h-[1px] bg-[#2a2e36] my-1" />
                  <div onClick={(e) => { deleteFile(contextMenu.fileId, e as any); setContextMenu(null); }} className="px-3 py-2 text-[11px] hover:bg-red-400/10 text-red-400 cursor-pointer flex items-center gap-2">
                    <Trash2 size={14} /> حذف
                  </div>
                </div>
              )}

              {activeSidebarTab === 'search' && (
                <div className="flex flex-col h-full bg-[#0d0f14]">
                  <div className="p-2 px-3 text-[10px] uppercase font-bold text-[#7a8490] border-b border-[#2a2e36] bg-[#16191e]/50">البحث</div>
                  <div className="p-3">
                    <input 
                      type="text" 
                      placeholder="ابحث في الملفات..."
                      className="w-full bg-[#16191e] border border-[#2a2e36] rounded px-3 py-2 text-xs focus:border-[#00e5ff] outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="mt-4 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
                      {searchResults.length === 0 && searchQuery && (
                        <div className="text-center py-10 opacity-30 text-xs">لا توجد نتائج</div>
                      )}
                      {searchResults.map((result, idx) => (
                        <div 
                          key={idx}
                          onClick={() => { setActiveFileId(result!.file.id); }}
                          className="p-2 border border-transparent hover:border-[#2a2e36] hover:bg-white/5 rounded cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-[#00e5ff] font-mono mb-1">
                            <FileCode size={12} />
                            {result!.file.name}
                          </div>
                          <div className="text-[11px] font-mono opacity-60 truncate">
                            <span className="text-[#7a8490] mr-1">{result!.lineNumber}:</span>
                            {result!.line}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSidebarTab === 'ai' && (
                <div className="flex flex-col h-full bg-[#0d0f14]">
                  <div className="p-2 px-3 text-[10px] uppercase font-bold text-[#7a8490] border-b border-[#2a2e36] bg-[#16191e]/50 flex justify-between items-center">
                    <span>مساعد JUBA AI</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
                      <span className="text-[8px] text-[#a78bfa]">ONLINE</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-4 font-arabic no-scrollbar">
                    <div className="p-3 bg-[#1e2228] border border-[#2a2e36] rounded-lg text-xs leading-relaxed">
                      <p className="text-[#a78bfa] font-bold mb-1">JUBA v11</p>
                      أنا مساعدك الذكي. يمكنني مساعدتك في كتابة الكود وتصحيح الأخطاء.
                    </div>
                    {aiLogs.map((msg, i) => (
                      <div key={i} className={`p-2 rounded text-[11px] ${msg.role === 'user' ? 'bg-[#2a2e36] border-r border-[#00e5ff]/30 text-right' : 'bg-[#a78bfa]/10 border-r border-[#a78bfa]/30'}`}>
                        <p className="opacity-50 text-[9px] mb-1">{msg.role === 'user' ? 'أنت' : 'JUBA AI'}</p>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#2a2e36] bg-[#16191e]">
                    <textarea 
                      placeholder="اسأل عن الكود..."
                      className="w-full bg-[#0d0f14] border border-[#2a2e36] rounded p-2 text-xs h-20 focus:border-[#a78bfa] outline-none resize-none"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAiSend();
                        }
                      }}
                    />
                    <button 
                      onClick={handleAiSend}
                      className="w-full mt-2 bg-[#a78bfa] text-black text-[11px] font-bold py-2 rounded hover:brightness-110 active:scale-95 transition-all"
                    >
                      إرسال الطلب
                    </button>
                  </div>
                </div>
              )}
            </ResizablePanel>
          )}
          {!sidebarCollapsed && (
            <ResizableHandle className="w-1 bg-[#2a2e36] hover:bg-[#00e5ff] transition-colors" />
          )}

          <ResizablePanel defaultSize={sidebarCollapsed ? 100 : 80} minSize={20}>
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize={showPreview ? 60 : 100} minSize={20}>
                {/* Editor Container */}
                <div className="flex-1 h-full flex flex-col min-w-0 bg-[#0d0f14]">
                  {/* Tabs */}
                  <div className="flex h-9 border-b border-[#2a2e36] bg-[#16191e] overflow-x-auto no-scrollbar">
                  {code.files.map(file => (
                    <TabItem 
                      key={file.id}
                      label={file.name} 
                      active={code.activeFileId === file.id} 
                      onClick={() => setActiveFileId(file.id)}
                      icon={fileIcon(file)} 
                      onClose={(e) => deleteFile(file.id, e)}
                    />
                  ))}
                </div>
                
                {/* Editor Area */}
                <div className="flex-1 relative">
                  {!monacoLoaded && !monacoError && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0f14]">
                      <div className="h-10 w-10 border-2 border-t-[#00e5ff] border-transparent rounded-full animate-spin mb-4" />
                      <p className="font-mono text-[10px] text-[#7a8490] uppercase tracking-widest animate-pulse">نواة المحرر : قيد التشغيل</p>
                    </div>
                  )}
                  <div ref={containerRef} className="h-full w-full" />
                </div>

                {/* Terminal Panel */}
                <div className="h-44 border-t border-[#2a2e36] bg-[#0a0f18] flex flex-col">
                  <div className="flex border-b border-[#2a2e36] px-3 h-8 items-center gap-4 text-[9px] font-bold text-[#7a8490] uppercase tracking-wider">
                    <span className="text-[#00e5ff] border-b border-[#00e5ff] h-full flex items-center px-1">TERMINAL</span>
                    <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">OUTPUT</span>
                    <button onClick={() => setLogs([])} className="ml-auto opacity-40 hover:opacity-100"><Trash2 size={12} /></button>
                  </div>
                  <div className="flex-1 p-3 font-mono text-[11px] overflow-y-auto space-y-1 no-scrollbar bg-black/20">
                    {logs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="opacity-30">{isMounted ? idxToTime(i) : '--:--:--'}</span>
                        <span className={getLogColor(log)}>{log}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2 opacity-80 group">
                      <span className="text-[#00e5ff]">$</span>
                      <input 
                        type="text" 
                        className="flex-1 bg-transparent border-none outline-none text-[#7a8490] focus:text-white"
                        placeholder="اكتب أمرا... (ls, clear, help)"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={handleTerminalCmd}
                      />
                    </div>
                    <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
                  </div>
                </div>
                </div>
              </ResizablePanel>

              {showPreview && (
                <ResizableHandle className="w-1 bg-[#2a2e36] hover:bg-[#00e5ff] transition-colors" />
              )}
              {showPreview && (
                <ResizablePanel defaultSize={40} minSize={20}>
                  {/* Module 5: Preview Sidebar */}
                    <aside 
                      className="h-full flex flex-col bg-[#0d0f14] shrink-0"
                    >
                      <div className="h-9 p-3 text-[10px] uppercase font-bold text-[#7a8490] border-b border-[#2a2e36] flex justify-between items-center bg-[#16191e]/50">
                        <div className="flex items-center gap-2">
                          <span>المعاينة الحية</span>
                          <span className="text-[8px] bg-[#00e5ff]/10 text-[#00e5ff] px-1.5 py-0.5 rounded border border-[#00e5ff]/20">
                            {activeFile.name.endsWith('.html') ? activeFile.name : 'index.html'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <JubaTooltip content={isJsEnabled ? "تعطيل الجافاسكربت" : "تفعيل الجافاسكربت"}>
                            <button 
                              onClick={() => setIsJsEnabled(!isJsEnabled)} 
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${isJsEnabled ? 'text-[#00e5ff] hover:bg-[#00e5ff]/10' : 'text-[#7a8490] hover:bg-white/5'}`}
                            >
                              <Smartphone size={14} className={isJsEnabled ? 'text-[#00e5ff]' : 'text-[#7a8490]'} />
                            </button>
                          </JubaTooltip>
                          <JubaTooltip content="ملء الشاشة">
                            <button 
                              onClick={() => setIsFullscreenPreview(true)} 
                              className="hover:text-[#00e5ff] transition-colors"
                            >
                              <Maximize2 size={16} />
                            </button>
                          </JubaTooltip>
                          <JubaTooltip content="تحديث">
                            <button onClick={runCode} className="hover:text-[#00e5ff] transition-colors">
                              <RefreshCw size={16} />
                            </button>
                          </JubaTooltip>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                          <span className="text-[#00e5ff] text-[9px] font-mono">60FPS</span>
                        </div>
                      </div>
                              
                      <div className="flex-1 flex flex-col bg-[#16191e]">
                        <div className="flex-1 overflow-hidden relative group">
                          {!isFullscreenPreview && (
                            <iframe 
                              ref={previewRef}
                              title="JUBA Preview"
                              className="h-full w-full border-none bg-white opacity-95 group-hover:opacity-100 transition-opacity"
                              sandbox={isJsEnabled ? "allow-scripts allow-same-origin allow-forms allow-modals allow-downloads" : "allow-same-origin allow-forms allow-modals allow-downloads"}
                            />
                          )}
                          <div className="absolute inset-0 pointer-events-none border-4 border-transparent group-hover:border-[#00e5ff]/10 transition-all" />
                        </div>
                      </div>
                    </aside>
                  </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* Fullscreen Preview Overlay */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 z-[100] bg-[#0d0f14] flex flex-col">
          <div className="h-14 border-b border-[#2a2e36] bg-[#16191e] px-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#e1e4e8] leading-none mb-0.5">معاينة ملء الشاشة</span>
                <span className="text-[10px] text-[#7a8490] font-mono leading-none">JUBA v11.4 • Live Dev Environment</span>
              </div>
            </div>

            {/* Device Switcher */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-[#0d0f14] rounded-lg p-1 border border-[#2a2e36]">
              <JubaTooltip content="سطح المكتب">
                <button 
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-[#2a2e36] text-[#00e5ff]' : 'text-[#7a8490] hover:text-[#e1e4e8]'}`}
                >
                  <Monitor size={18} />
                  <span className="text-[10px] font-bold">سطح المكتب</span>
                </button>
              </JubaTooltip>
              <JubaTooltip content="تابلت">
                <button 
                  onClick={() => setPreviewDevice('tablet')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${previewDevice === 'tablet' ? 'bg-[#2a2e36] text-[#00e5ff]' : 'text-[#7a8490] hover:text-[#e1e4e8]'}`}
                >
                  <Tablet size={18} />
                  <span className="text-[10px] font-bold">تابلت</span>
                </button>
              </JubaTooltip>
              <JubaTooltip content="جوال">
                <button 
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-[#2a2e36] text-[#00e5ff]' : 'text-[#7a8490] hover:text-[#e1e4e8]'}`}
                >
                  <Smartphone size={18} />
                  <span className="text-[10px] font-bold">جوال</span>
                </button>
              </JubaTooltip>
            </div>

            <div className="flex items-center gap-2">
              <JubaTooltip content={isJsEnabled ? "تعطيل JS" : "تفعيل JS"}>
                <button 
                  onClick={() => setIsJsEnabled(!isJsEnabled)} 
                  className={`flex items-center justify-center w-9 h-9 rounded-lg border border-[#2a2e36] transition-all hover:border-[#00e5ff]/50 ${isJsEnabled ? 'text-[#00e5ff] bg-[#00e5ff]/5' : 'text-[#7a8490]'}`}
                >
                  <Smartphone size={20} />
                </button>
              </JubaTooltip>
              <JubaTooltip content="تحديث المعاينة">
                <button 
                  onClick={runCode} 
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#2a2e36] text-[#e1e4e8] transition-all hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/5 active:scale-95"
                >
                  <RefreshCw size={20} />
                </button>
              </JubaTooltip>
              <div className="w-px h-6 bg-[#2a2e36] mx-1" />
              <button 
                onClick={() => setIsFullscreenPreview(false)} 
                className="flex items-center gap-2 pl-2 pr-4 h-9 rounded-lg bg-[#f85149] text-white transition-all hover:bg-[#da3633] active:scale-95 shadow-lg shadow-[#f85149]/20"
              >
                <X size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">إغلاق</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#0d0f14] relative overflow-hidden flex justify-center p-4">
            <motion.div 
              initial={false}
              animate={{ 
                width: previewDevice === 'mobile' ? 375 : previewDevice === 'tablet' ? 768 : '100%',
                height: previewDevice === 'mobile' ? 667 : previewDevice === 'tablet' ? 1024 : '100%',
                maxHeight: '100%'
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`bg-white shadow-2xl relative overflow-hidden flex flex-col ${previewDevice !== 'desktop' ? 'rounded-[32px] border-[12px] border-[#16191e]' : ''}`}
            >
              {/* Device Status Bar Mockup if not desktop */}
              {previewDevice !== 'desktop' && (
                <div className="h-6 flex items-center justify-between px-6 bg-white shrink-0 pointer-events-none">
                  <span className="text-[10px] font-bold text-black">9:41</span>
                  <div className="flex items-center gap-1 text-black">
                    <SignalHigh size={12} />
                    <Wifi size={12} />
                    <BatteryFull size={12} />
                  </div>
                </div>
              )}
              
              <iframe 
                ref={previewRef}
                title="JUBA Fullscreen Preview"
                className="flex-1 w-full border-none"
                sandbox={isJsEnabled ? "allow-scripts allow-same-origin allow-forms allow-modals allow-downloads" : "allow-same-origin allow-forms allow-modals allow-downloads"}
              />

              {/* Home Indicator if mobile/tablet */}
              {previewDevice !== 'desktop' && (
                <div className="h-4 flex justify-center items-center bg-white shrink-0 pointer-events-none">
                  <div className="w-20 h-1 rounded-full bg-black/10" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer Status Bar */}
      <footer className="h-6 border-t border-[#2a2e36] bg-[#16191e] text-[#7a8490] flex items-center px-3 justify-between text-[10px] font-mono shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#00e5ff]">
            <CheckCircle2 size={12} />
            <span>UTF-8</span>
          </div>
          <div className="h-3 w-[1px] bg-[#2a2e36]" />
          <span>{activeFile.language.toUpperCase()}</span>
          <span>SPACES: 2</span>
        </div>
        <div className="flex items-center gap-4 uppercase">
          <div className="flex items-center gap-1">
             <History size={12} />
             <span>{(isMounted && code.updatedAt) ? new Date(code.updatedAt).toLocaleTimeString('ar-EG') : '--:--'}</span>
          </div>
          <span className="opacity-50">JUBA-IDB-SYNC</span>
          <span className="text-[#00e5ff]">SYSTEM_OK</span>
        </div>
      </footer>

      {/* Secret File Import */}
      <input 
        id="file-import" 
        type="file" 
        multiple 
        className="hidden" 
        onChange={(e) => {
          const files = e.target.files;
          if (files) importFiles(Array.from(files));
          e.target.value = '';
        }}
      />
      </Tooltip.Provider>
    </div>
  );
}

function JubaTooltip({ children, content, side = 'bottom' }: { children: React.ReactNode, content: string, side?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-[#1e2228] border border-[#2a2e36] text-[#cdd6e0] text-[10px] px-2 py-1 rounded shadow-xl z-[100] animate-in fade-in zoom-in duration-200"
          sideOffset={5}
          side={side}
        >
          {content}
          <Tooltip.Arrow className="fill-[#2a2e36]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function SidebarIcon({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <div className="sidebar-icon-container relative flex flex-col items-center py-1 w-full">
      <JubaTooltip content={label} side="left">
        <button 
          onClick={onClick}
          className={`flex h-10 w-10 items-center justify-center transition-all relative z-10 cursor-pointer rounded-lg ${
            active 
            ? 'text-[#00e5ff] bg-[#00e5ff]/10' 
            : 'text-[#7a8490] hover:text-[#cdd6e0] hover:bg-white/5'
          }`}
        >
          {icon}
        </button>
      </JubaTooltip>
    </div>
  );
}

function ExplorerItem({ label, active, onClick, icon, isFolder, isDim, onDelete, onRename, onDuplicate, onDownload, onContextMenu }: { label: string, active?: boolean, onClick?: () => void, icon?: React.ReactNode, isFolder?: boolean, isDim?: boolean, onDelete?: (e: React.MouseEvent) => void, onRename?: (e: React.MouseEvent) => void, onDuplicate?: (e: React.MouseEvent) => void, onDownload?: (e: React.MouseEvent) => void, onContextMenu?: (e: React.MouseEvent) => void }) {
  return (
    <div 
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group px-3 py-1.5 text-[11px] flex items-center gap-2 cursor-pointer transition-colors border-l-2 ${
        active 
        ? 'bg-[#00e5ff]/5 text-[#cdd6e0] border-[#00e5ff]' 
        : isDim ? 'text-[#7a8490]/50 border-transparent' : 'text-[#7a8490] hover:bg-white/5 hover:text-[#cdd6e0] border-transparent'
      } ${isFolder ? 'font-bold' : ''}`}
    >
      <span className="w-4 flex justify-center opacity-70 group-hover:opacity-100">
        {icon}
      </span>
      <span className="truncate flex-1 font-mono">{label}</span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onDownload && <ExplorerActionButton label="تحميل" onClick={onDownload} icon={<Download size={14} />} />}
        {onDuplicate && <ExplorerActionButton label="تكرار" onClick={onDuplicate} icon={<Copy size={14} />} />}
        {onRename && <ExplorerActionButton label="تسمية" onClick={onRename} icon={<Edit3 size={14} />} />}
        {onDelete && <ExplorerActionButton label="حذف" onClick={onDelete} icon={<Trash2 size={14} />} danger />}
      </div>
    </div>
  );
}

function ExplorerActionButton({ onClick, icon, danger, label }: { onClick: (e: React.MouseEvent) => void, icon: React.ReactNode, danger?: boolean, label: string }) {
  return (
    <JubaTooltip content={label}>
      <button 
        onClick={onClick} 
        className={`p-1 rounded hover:bg-white/10 transition-colors ${danger ? 'hover:text-red-400' : 'hover:text-[#00e5ff]'}`}
      >
        {icon}
      </button>
    </JubaTooltip>
  );
}

function TabItem({ label, active, onClick, icon, onClose }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode, onClose?: (e: React.MouseEvent) => void }) {
  return (
    <div 
      onClick={onClick}
      className={`group h-full px-4 flex items-center gap-3 cursor-pointer text-[11px] border-l border-[#2a2e36] transition-all shrink-0 min-w-[100px] max-w-[180px] ${
        active 
        ? 'bg-[#0d0f14] border-t-2 border-t-[#00e5ff] text-[#00e5ff]' 
        : 'bg-[#16191e] text-[#7a8490] hover:bg-[#1e2228] hover:text-[#cdd6e0]'
      }`}
    >
      <span className="opacity-60 group-hover:opacity-100">{icon}</span>
      <span className="truncate flex-1 font-mono">{label}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity ml-1">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function HeaderButton({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title?: string }) {
  const button = (
    <button 
      onClick={onClick}
      className="p-1.5 text-[#7a8490] hover:text-[#00e5ff] hover:bg-[#00e5ff]/5 rounded transition-all active:scale-90"
    >
      {icon}
    </button>
  );

  if (title) {
    return <JubaTooltip content={title}>{button}</JubaTooltip>;
  }

  return button;
}

function HeaderAction({ onClick, icon, label, primary, active, ai }: { onClick: () => void, icon: React.ReactNode, label: string, primary?: boolean, active?: boolean, ai?: boolean }) {
  return (
    <JubaTooltip content={label}>
      <button 
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded transition-all border shrink-0 ${
          primary 
          ? 'bg-[#00e5ff] text-black border-[#00e5ff] hover:brightness-110' 
          : ai
          ? 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/30 hover:bg-[#a78bfa]/20'
          : active 
          ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]' 
          : 'bg-transparent text-[#7a8490] border-transparent hover:bg-white/5 hover:text-[#cdd6e0]'
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
    </JubaTooltip>
  );
}

// Utility Helpers
const fileIcon = (file: ProjectFile) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html': return <FileCode size={16} className="text-orange-400" />;
    case 'css': return <FileCode size={16} className="text-blue-400" />;
    case 'js':
    case 'javascript': return <FileCode size={16} className="text-yellow-400" />;
    case 'json': return <FileJson size={16} className="text-purple-400" />;
    default: return <FileCode size={16} className="text-[#7a8490]" />;
  }
};

const getLogColor = (log: string) => {
  if (log.includes('[نظام]')) return 'text-[#00e5ff]';
  if (log.includes('[جوبا]')) return 'text-[#a78bfa]';
  if (log.includes('فشل')) return 'text-[#f47474]';
  return 'text-[#7a8490]';
};

const idxToTime = (idx: number) => {
  return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};


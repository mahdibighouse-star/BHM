import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Loader2, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../layout/Sidebar';
import { storage, db } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url: string;
  directive: string;
  timestamp: any;
}

export function AgentMemory() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [directive, setDirective] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'memory_files'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const files: UploadedFile[] = [];
      snapshot.forEach((doc) => {
        files.push({ id: doc.id, ...doc.data() } as UploadedFile);
      });
      setUploadedFiles(files);
    }, (error) => {
      console.error('Error fetching files:', error);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setIsProcessing(true);
    setReceipt(null);
    setProgress(0);

    const storageRef = ref(storage, `agent_memory/${user.uid}/${Date.now()}_${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error('Upload failed:', error);
        setIsProcessing(false);
        setReceipt(JSON.stringify({ error: error.message }, null, 2));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          await addDoc(collection(db, 'memory_files'), {
            userId: user.uid,
            name: selectedFile.name,
            size: selectedFile.size,
            url: downloadURL,
            directive: directive || 'Unspecified',
            timestamp: serverTimestamp()
          });

          setIsProcessing(false);
          setSelectedFile(null);
          setDirective('');
          setProgress(0);
          setReceipt(JSON.stringify({
            "bhm_routing_status": "SUCCESS",
            "file_name": selectedFile.name,
            "url": downloadURL,
            "directive_applied": directive || 'None',
            "storage_tier": "PERMANENT"
          }, null, 2));

        } catch (error: any) {
          console.error("Firestore error:", error);
          setIsProcessing(false);
          setReceipt(JSON.stringify({ error: error.message }, null, 2));
        }
      }
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b border-border-100 pb-4">
        <div className="w-10 h-10 bg-panel3 border border-border-100 rounded flex items-center justify-center z-10">
          <Server className="w-5 h-5 text-cmd" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-t-100 uppercase tracking-wider">AI MEMORY & DOCUMENT ROUTER</h1>
          <p className="text-xs text-t-300 uppercase tracking-widest mt-1">Upload assets and assign routing directives for AI parsing.</p>
        </div>
      </div>

      <div className="bg-panel2 border border-border-100 rounded-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={cn(
              "relative border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center transition-colors px-12",
              isDragging ? "border-cmd bg-cmd/5" : "border-border-300 hover:border-cmd/50 hover:bg-panel3",
              selectedFile ? "bg-panel3 border-border-300" : "bg-panel"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-cmd mb-2" />
                <span className="text-sm font-bold text-t-100">{selectedFile.name}</span>
                <span className="text-xs text-t-300">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <UploadCloud className="w-10 h-10 text-t-300 mb-2" />
                <span className="text-sm font-bold text-t-100 uppercase tracking-widest">Drag & Drop Document</span>
                <span className="text-xs text-t-300">or click to browse local files</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-t-300 font-bold block">
                Routing Directive Shorthand
              </label>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  type="button" 
                  onClick={() => setDirective('Use: Tech Brief. Scope: Team Shared. Target: Coordinator')}
                  className="px-3 py-1.5 rounded-full border border-border-200 bg-panel text-[10px] font-mono hover:border-cmd hover:text-cmd transition-colors text-t-200 uppercase tracking-wider"
                >
                  [Brief -&gt; Dev Shared]
                </button>
                <button 
                  type="button"
                  onClick={() => setDirective('Use: Quote Review. Scope: Restricted. Target: Sales Guard')}
                  className="px-3 py-1.5 rounded-full border border-border-200 bg-panel text-[10px] font-mono hover:border-cmd hover:text-cmd transition-colors text-t-200 uppercase tracking-wider"
                >
                  [Quote -&gt; Private]
                </button>
                <button 
                  type="button"
                  onClick={() => setDirective('Use: Brand Asset. Scope: Client Shared. Target: Onboarder')}
                  className="px-3 py-1.5 rounded-full border border-border-200 bg-panel text-[10px] font-mono hover:border-cmd hover:text-cmd transition-colors text-t-200 uppercase tracking-wider"
                >
                  [Asset -&gt; Client Vault]
                </button>
              </div>
            </div>
            
            <input
              type="text"
              value={directive}
              onChange={(e) => setDirective(e.target.value)}
              placeholder="Enter routing shorthand (e.g., Project: Auto Conduite. Use: Tech Brief. Scope: Team Shared)"
              className="w-full bg-panel border border-border-200 rounded px-4 py-3 text-sm text-t-100 placeholder:text-t-300 focus:outline-none focus:border-cmd transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isProcessing}
            className="w-full bg-cmd hover:bg-cmd/90 disabled:opacity-50 disabled:hover:bg-cmd text-void font-bold uppercase tracking-widest py-3 px-6 rounded transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {progress > 0 && progress < 100 ? `Uploading ${Math.round(progress)}%...` : 'Processing...'}
              </>
            ) : (
              'Route Document'
            )}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {receipt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-panel2 border border-border-100 rounded-md p-6"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-border-100 pb-3">
              <span className="w-2 h-2 rounded-full bg-status-ok animate-pulse" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-t-100 font-bold">Routing Receipt</h3>
            </div>
            
            <div className="bg-panel rounded border border-border-200 p-4 overflow-x-auto">
              <pre className="text-cmd font-mono text-sm leading-relaxed">
                {receipt}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-panel2 border border-border-100 rounded-md p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-t-100 font-bold border-b border-border-100 pb-3 mb-4">
          RECENT MEMORY VECTORS
        </h3>
        <div className="space-y-3">
          {uploadedFiles.length === 0 ? (
            <p className="text-xs text-t-300 font-mono italic">No memory vectors found.</p>
          ) : (
            uploadedFiles.map(file => (
              <div key={file.id} className="bg-panel border border-border-100 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:border-border-300 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-t-300 px-2 py-1 bg-panel3 rounded">
                    {file.timestamp ? new Date(file.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </span>
                  <a href={file.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-t-100 hover:underline group-hover:text-cmd transition-colors">
                    {file.name}
                  </a>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-t-300 font-mono text-[10px]">Directive: <span className="text-t-100 truncate max-w-[150px] inline-block align-bottom">{file.directive}</span></span>
                  <span className="text-status-ok font-mono text-[10px] px-2 py-1 bg-status-ok/10 rounded flex items-center gap-1">
                    Synced to Vault
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

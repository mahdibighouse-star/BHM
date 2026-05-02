import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { FileText, Trash2, Edit2, Play, BookTemplate } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PromptTemplate {
  id: string;
  userId: string;
  title: string;
  description?: string;
  template: string;
  createdAt: any;
}

export function PromptTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'prompt_templates'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PromptTemplate[];
      
      templatesData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setTemplates(templatesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'prompt_templates', auth);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await deleteDoc(doc(db, 'prompt_templates', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `prompt_templates/${id}`, auth);
    }
  };

  const handleCopy = (template: string) => {
    navigator.clipboard.writeText(template);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center">
        <div className="text-t-100 text-xs font-mono animate-pulse">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-border-100 pb-4">
        <div className="w-10 h-10 bg-panel3 border border-border-100 rounded flex items-center justify-center z-10">
          <BookTemplate className="w-5 h-5 text-cmd" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-t-100 uppercase tracking-wider">Prompt Templates</h1>
          <p className="text-xs text-t-300 uppercase tracking-widest mt-1">AI Generated & Custom Prompts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-full p-8 text-center text-t-300 border border-dashed border-border-100 rounded bg-panel font-mono text-sm">
            No templates found. Chat with the Commander to generate a prompt template.
            <br />
            <br />
            <span className="text-xs opacity-70">Hint: Say "Generate a prompt template for code review"</span>
          </div>
        ) : (
          templates.map(tpl => (
            <div key={tpl.id} className="bg-panel2 border border-border-100 rounded-md p-4 space-y-3 font-mono text-xs flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between border-b border-border-100 pb-2 mb-3">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-t-100 truncate text-sm">{tpl.title}</h3>
                    {tpl.description && (
                      <p className="text-t-300 text-[10px] mt-1 line-clamp-2">{tpl.description}</p>
                    )}
                  </div>
                  <div className="text-t-300 text-[9px] whitespace-nowrap">
                    {tpl.createdAt?.toDate ? formatDistanceToNow(tpl.createdAt.toDate(), { addSuffix: true }) : ''}
                  </div>
                </div>
                
                <div className="bg-panel p-3 border border-border-100 rounded overflow-x-auto max-h-48 overflow-y-auto">
                  <pre className="text-t-200 text-[10px] whitespace-pre-wrap font-mono">
                    {tpl.template}
                  </pre>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-100 mt-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleCopy(tpl.template)}
                  className="px-2 py-1 rounded bg-panel hover:bg-panel3 text-t-100 border border-border-100 flex items-center gap-1 uppercase tracking-widest text-[9px]"
                  title="Copy Prompt"
                >
                  <FileText className="w-3 h-3" /> Copy
                </button>
                <button 
                  onClick={() => handleDelete(tpl.id)}
                  className="px-2 py-1 rounded bg-status-bug/10 hover:bg-status-bug/20 text-status-bug border border-border-100 flex items-center gap-1 uppercase tracking-widest text-[9px]"
                  title="Delete Template"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { Widget } from '../Widget';
import { useTripStore } from '../../store/useTripStore';
import { FileText, Download, ShieldCheck, File, Plane, Building2, Trash2, Upload, Edit2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function DocumentVaultWidget() {
  const { documents, addDocument, removeDocument, updateDocument } = useTripStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', type: 'other' as any, subtext: '' });

  const getIcon = (type: string) => {
    switch (type) {
      case 'passport': return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      case 'ticket': return <Plane className="w-5 h-5 text-sky-400" />;
      case 'hotel': return <Building2 className="w-5 h-5 text-emerald-400" />;
      default: return <FileText className="w-5 h-5 text-gray-900" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 500KB to fit in Firestore document easily
    if (file.size > 500 * 1024) {
      alert("File is too large. Please upload a file smaller than 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      let type: 'passport' | 'ticket' | 'hotel' | 'other' = 'other';
      const fileNameLower = file.name.toLowerCase();
      if (fileNameLower.includes('passport') || fileNameLower.includes('id')) type = 'passport';
      else if (fileNameLower.includes('ticket') || fileNameLower.includes('flight') || fileNameLower.includes('boarding')) type = 'ticket';
      else if (fileNameLower.includes('hotel') || fileNameLower.includes('booking') || fileNameLower.includes('stay')) type = 'hotel';

      await addDocument({
        name: file.name,
        type,
        url: base64
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (doc: any) => {
    if (!doc.url) return;
    const a = document.createElement('a');
    a.href = doc.url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const startEditing = (doc: any) => {
    setEditingId(doc.id);
    setEditForm({ name: doc.name, type: doc.type, subtext: doc.subtext || doc.type });
  };

  const saveEdit = async (id: string) => {
    await updateDocument(id, {
      name: editForm.name,
      type: editForm.type,
      subtext: editForm.subtext
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <Widget title="Document Vault" icon={<FileText className="w-5 h-5 text-gray-400" />} className="col-span-1 md:col-span-1 lg:col-span-1 h-[600px]">
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-0">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 rounded-xl border border-white/20 bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors group shadow-sm"
          >
            {editingId === doc.id ? (
              <div className="flex-1 flex flex-col gap-2 min-w-0 pr-2">
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full text-sm p-1 border border-gray-300 rounded"
                  placeholder="Document Name"
                />
                <div className="flex gap-2">
                  <select 
                    value={editForm.type} 
                    onChange={(e) => setEditForm({...editForm, type: e.target.value as any})}
                    className="text-xs p-1 border border-gray-300 rounded flex-1"
                  >
                    <option value="passport">Passport/ID</option>
                    <option value="ticket">Ticket/Flight</option>
                    <option value="hotel">Hotel/Stay</option>
                    <option value="other">Other</option>
                  </select>
                  <input 
                    type="text" 
                    value={editForm.subtext} 
                    onChange={(e) => setEditForm({...editForm, subtext: e.target.value})}
                    className="w-full text-xs p-1 border border-gray-300 rounded flex-1"
                    placeholder="Subtext (e.g. PASSPORT)"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => saveEdit(doc.id)} className="flex-1 bg-indigo-50 text-indigo-600 text-xs py-1 rounded border border-indigo-200 flex items-center justify-center gap-1"><Check className="w-3 h-3"/> Save</button>
                  <button onClick={cancelEdit} className="flex-1 bg-gray-50 text-gray-600 text-xs py-1 rounded border border-gray-200 flex items-center justify-center gap-1"><X className="w-3 h-3"/> Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-white/10 border border-white/10 backdrop-blur-sm rounded-lg group-hover:bg-white/20 transition-colors shrink-0">
                    {getIcon(doc.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-gray-900 text-sm truncate">{doc.name}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider truncate">{doc.subtext || doc.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => startEditing(doc)}
                    className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {doc.url && (
                    <button 
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => removeDocument(doc.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}
        {documents.length === 0 && (
          <div className="text-center text-gray-400 py-8">No documents uploaded yet.</div>
        )}
      </div>
      
      <div className="mt-4 shrink-0">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept="image/*,.pdf"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-xl border border-dashed border-white/30 text-gray-500 hover:text-gray-900 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload Document (Max 500KB)
        </button>
      </div>
    </Widget>
  );
}

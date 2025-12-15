import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeShareModal } from '../features/ui/uiSlice.js';
import { X, Copy, Check, Users, Globe, Mail } from 'lucide-react';

export const ShareModal = () => {
  const dispatch = useDispatch();
  const { isShareModalOpen } = useSelector((state) => state.ui);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState(false);

  if (!isShareModalOpen) return null;

  const handleCopy = () => {
    // In a real app, this would be a dynamic link
    navigator.clipboard.writeText('https://taskmaster.app/p/share-token-123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (email) {
      setInvited(true);
      setTimeout(() => {
        setInvited(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Share Project</h2>
          </div>
          <button
            onClick={() => dispatch(closeShareModal())}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invite Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Invite people</label>
            <form onSubmit={handleInvite} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                    required
                />
              </div>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={invited}
              >
                {invited ? 'Sent!' : 'Invite'}
              </button>
            </form>
             {invited && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><Check size={12}/> Invitation sent successfully</p>}
          </div>

          <div className="border-t border-slate-100 pt-4">
             <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                     <div className="p-2 bg-slate-100 rounded-full text-slate-600">
                         <Globe size={16} />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-900">Anyone with the link</p>
                         <p className="text-xs text-slate-500">can view this project</p>
                     </div>
                 </div>
                 <select className="text-sm border-none bg-transparent font-medium text-slate-600 focus:ring-0 cursor-pointer hover:text-slate-900">
                     <option>Can view</option>
                     <option>Can edit</option>
                 </select>
             </div>

             <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                 <input 
                    type="text" 
                    readOnly 
                    value="https://taskmaster.app/p/share-token-123" 
                    className="bg-transparent border-none focus:ring-0 flex-1 text-sm text-slate-600 w-full outline-none"
                 />
                 <button 
                    onClick={handleCopy}
                    className={`p-2 rounded-md transition-all ${copied ? 'bg-green-100 text-green-600' : 'hover:bg-white hover:shadow-sm text-slate-500'}`}
                 >
                     {copied ? <Check size={18} /> : <Copy size={18} />}
                 </button>
             </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 text-right">
            <button 
                onClick={() => dispatch(closeShareModal())}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};
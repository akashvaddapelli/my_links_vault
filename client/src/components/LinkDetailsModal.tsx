import { X, ExternalLink, Edit2, Check, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LinkResponse } from "@shared/routes";
import { useState } from "react";
import { useUpdateLink as useUpdateLinkHook } from "@/hooks/use-links";

interface LinkDetailsModalProps {
  link: LinkResponse | null;
  onClose: () => void;
  icon: React.ReactNode;
}

export function LinkDetailsModal({ link, onClose, icon }: LinkDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link?.title || "");
  const [editUrl, setEditUrl] = useState(link?.url || "");
  const [editDescription, setEditDescription] = useState(link?.description || "");
  
  const updateLink = useUpdateLinkHook();

  if (!link) return null;

  const handleSave = () => {
    updateLink.mutate({
      id: link.id,
      data: {
        title: editTitle,
        url: editUrl,
        description: editDescription,
      }
    }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white dark:bg-black p-8 rounded-2xl brutal-border shadow-brutal-lg"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl text-2xl">
                {icon}
              </div>
              {isEditing ? (
                <input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-bold font-display leading-tight bg-transparent brutal-border p-2 rounded-lg w-full"
                />
              ) : (
                <h2 className="text-3xl font-bold font-display leading-tight">{link.title}</h2>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={updateLink.isPending}
                    className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-full brutal-border hover:scale-110 transition-transform"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Destination URL</h3>
              {isEditing ? (
                <input 
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl brutal-border focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-mono text-sm"
                />
              ) : (
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl brutal-border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
                    {link.url}
                  </span>
                </a>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Description</h3>
              {isEditing ? (
                <textarea 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl brutal-border focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm h-32 resize-none"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-900 p-4 rounded-xl brutal-border min-h-[4rem]">
                  {link.description || <span className="text-gray-400 italic">No description provided</span>}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateLink } from "@/hooks/use-links";

export function AddLinkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  
  const { mutate: createLink, isPending } = useCreateLink();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    createLink(
      { title, url, description },
      {
        onSuccess: () => {
          setIsOpen(false);
          setTitle("");
          setUrl("");
          setDescription("");
        },
      }
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl brutal-border shadow-brutal shadow-brutal-hover shadow-brutal-active"
      >
        <Plus className="w-5 h-5" />
        <span>Add Link</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-white dark:bg-black p-6 rounded-2xl brutal-border shadow-brutal-lg pointer-events-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-display">New Link</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Github Profile"
                      className="w-full px-4 py-3 bg-transparent brutal-border rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      URL
                    </label>
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://"
                      className="w-full px-4 py-3 bg-transparent brutal-border rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Description (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is this link about?"
                      rows={3}
                      className="w-full px-4 py-3 bg-transparent brutal-border rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 mt-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl brutal-border shadow-brutal shadow-brutal-hover shadow-brutal-active disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Saving..." : "Save Link"}
                  </button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

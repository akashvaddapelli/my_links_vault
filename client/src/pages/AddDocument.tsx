import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useUploadDocument } from "@/hooks/use-documents";

export default function AddDocument() {
    const [, setLocation] = useLocation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const { mutate: upload, isPending } = useUploadDocument();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !file) return;

        upload(
            { title, description, file },
            {
                onSuccess: () => setLocation("/documents"),
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] p-4 sm:p-8">
            <div className="max-w-xl mx-auto">
                <button
                    onClick={() => setLocation("/documents")}
                    className="flex items-center gap-2 mb-8 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Documents</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-black p-8 rounded-2xl brutal-border shadow-brutal-lg"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-xl brutal-border text-2xl">
                            📄
                        </div>
                        <h1 className="text-3xl font-black font-display uppercase italic tracking-tighter">Add Document</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Identity Proof"
                                className="w-full px-4 py-3 bg-transparent brutal-border rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                Upload File (Image or PDF)
                            </label>
                            <div
                                className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all ${file ? 'border-green-500 bg-green-50/50' : 'border-gray-300 hover:border-black dark:hover:border-white'
                                    }`}
                            >
                                <input
                                    type="file"
                                    required
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center gap-3 text-center">
                                    {file ? (
                                        <>
                                            <FileText className="w-10 h-10 text-green-500" />
                                            <div>
                                                <p className="font-bold text-sm">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                                            <div>
                                                <p className="font-bold">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-500">Images or PDF (will be converted/saved as PDF)</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                Description (Optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this document about?"
                                rows={4}
                                className="w-full px-4 py-3 bg-transparent brutal-border rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || !file || !title}
                            className="w-full py-4 mt-4 bg-black text-white dark:bg-white dark:text-black font-bold text-lg rounded-xl brutal-border shadow-brutal shadow-brutal-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? "Converting & Uploading..." : "Save Document"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, LogOut, Plus, Link as LinkIcon, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useDocuments } from "@/hooks/use-documents";
import { DocumentCard } from "@/components/DocumentCard";
import type { Document } from "@shared/schema";

export default function DocumentDashboard() {
    const [, setLocation] = useLocation();
    const { data: user, isLoading: isUserLoading } = useUser();
    const { mutate: logout } = useLogout();
    const { data: documents = [], isLoading: isDocsLoading } = useDocuments();

    const [searchQuery, setSearchQuery] = useState("");

    // Protect route
    useEffect(() => {
        if (!isUserLoading && !user) {
            setLocation("/login");
        }
    }, [isUserLoading, user, setLocation]);

    const handleLogout = () => {
        logout(undefined, { onSuccess: () => setLocation("/login") });
    };

    const filteredDocs = documents.filter((doc: Document) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isUserLoading || !user) return <div className="h-screen w-full flex items-center justify-center"><div className="animate-spin w-8 h-8 brutal-border rounded-full border-t-black"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
            {/* Navigation / Header Bar */}
            <nav className="border-b-2 border-black dark:border-white bg-white dark:bg-black sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-lg brutal-border shadow-brutal text-xl">
                                🔗
                            </div>
                            <span className="font-display font-bold text-xl hidden sm:block">LinkVault</span>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl brutal-border">
                            <button
                                onClick={() => setLocation("/")}
                                className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:bg-white dark:hover:bg-black"
                            >
                                <LinkIcon className="w-4 h-4" />
                                <span>Links</span>
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black shadow-sm"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Documents</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLocation("/add-document")}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl brutal-border shadow-brutal"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Document</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl brutal-border transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center sm:text-left"
                >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight mb-2 leading-tight uppercase italic">
                        Your Documents Database 📑
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                        Manage your personal files, securely converted to PDF.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 relative max-w-sm"
                >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-base bg-white dark:bg-black brutal-border rounded-xl shadow-brutal focus:outline-none focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all placeholder:text-gray-400"
                    />
                </motion.div>

                {/* Docs Grid */}
                {isDocsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl brutal-border animate-pulse" />
                        ))}
                    </div>
                ) : filteredDocs.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredDocs.map((doc: Document, index: number) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                            >
                                <DocumentCard document={doc} />
                            </motion.div>
                        ))}

                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-black rounded-3xl brutal-border shadow-brutal border-dashed">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold font-display mb-2">No documents found</h3>
                        <p className="text-gray-500">
                            {searchQuery ? "Try adjusting your search query." : "Click 'Add Document' to upload your first file."}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

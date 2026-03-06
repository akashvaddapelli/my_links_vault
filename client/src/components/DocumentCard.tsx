import { FileText, Eye, Download } from "lucide-react";
import { motion } from "framer-motion";
import type { Document } from "@shared/schema";

export function DocumentCard({ document }: { document: Document }) {
    const handleView = () => {
        window.open(document.file_url, "_blank");
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(document.file_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = `${document.title}.pdf`;
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <div className="relative group">
            <div className="w-full flex flex-col gap-3 p-4 bg-white dark:bg-black rounded-xl brutal-border shadow-brutal transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg text-xl">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleView}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg brutal-border transition-colors"
                            title="View PDF"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg brutal-border transition-colors"
                            title="Download PDF"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold font-display text-sm truncate">{document.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                        {document.description || "No description provided"}
                    </p>
                </div>
            </div>
        </div>
    );
}

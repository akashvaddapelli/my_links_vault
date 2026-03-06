import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PDFDocument } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";
import type { Document, InsertDocument } from "@shared/schema";

export function useDocuments() {
    return useQuery({
        queryKey: ["/api/documents"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("documents")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Document[];
        },
    });
}

export function useUploadDocument() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ title, description, file }: { title: string; description: string; file: File }) => {
            let pdfBytes: Uint8Array;

            if (file.type === "application/pdf") {
                pdfBytes = new Uint8Array(await file.arrayBuffer());
            } else if (file.type.startsWith("image/")) {
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage();
                const { width, height } = page.getSize();

                const imageBytes = await file.arrayBuffer();
                let image;
                if (file.type === "image/png") {
                    image = await pdfDoc.embedPng(imageBytes);
                } else {
                    image = await pdfDoc.embedJpg(imageBytes);
                }

                const dims = image.scaleToFit(width - 40, height - 40);
                page.drawImage(image, {
                    x: 20,
                    y: height - dims.height - 20,
                    width: dims.width,
                    height: dims.height,
                });

                pdfBytes = await pdfDoc.save();
            } else {
                // Fallback or handle other types if needed, but pdf-lib is limited
                // For now, let's treat others as text or just error out
                throw new Error("Unsupported file type. Please upload a PDF or an image.");
            }

            const fileName = `${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("documents")
                .upload(fileName, pdfBytes, {
                    contentType: "application/pdf",
                });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from("documents")
                .getPublicUrl(fileName);

            const fileUrl = publicUrlData.publicUrl;

            const { data, error: insertError } = await supabase
                .from("documents")
                .insert([{ title, description, file_url: fileUrl }])
                .select()
                .single();

            if (insertError) throw insertError;
            return data as Document;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
            toast({
                title: "Document Uploaded",
                description: "Your document has been converted to PDF and saved.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message,
            });
        },
    });
}

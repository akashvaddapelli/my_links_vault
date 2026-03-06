import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type LinkInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

const LINKS_KEY = "links-vault-data";

export function useLinks() {
  return useQuery({
    queryKey: ["/api/links"],
    queryFn: async () => {
      const data = localStorage.getItem(LINKS_KEY);
      return data ? JSON.parse(data) : [];
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: LinkInput) => {
      const current = JSON.parse(localStorage.getItem(LINKS_KEY) || "[]");
      const newLink = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
      localStorage.setItem(LINKS_KEY, JSON.stringify([...current, newLink]));
      return newLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link Added",
        description: "Your new link has been saved successfully.",
        duration: 2000,
      });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<LinkInput> }) => {
      const current = JSON.parse(localStorage.getItem(LINKS_KEY) || "[]");
      const updated = current.map((link: any) =>
        link.id === id ? { ...link, ...data } : link
      );
      localStorage.setItem(LINKS_KEY, JSON.stringify(updated));
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link Updated",
        description: "Your link has been updated successfully.",
        duration: 2000,
      });
    },
  });
}


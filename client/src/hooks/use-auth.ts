import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const MOCK_USER = { id: 1, email: "user@example.com", username: "Akash vaddapelli" };

export function useUser() {
  return useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      return isLoggedIn ? MOCK_USER : null;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      // No network request
      localStorage.setItem("isLoggedIn", "true");
      return MOCK_USER;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], MOCK_USER);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      // No network request
      localStorage.removeItem("isLoggedIn");
      return { success: true };
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
  });
}


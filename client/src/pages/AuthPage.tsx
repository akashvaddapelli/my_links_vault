import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLogin, useUser } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const { mutate: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");

    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/dashboard";

  };


  if (isUserLoading || user) return <div className="h-screen w-full flex items-center justify-center"><div className="animate-spin w-8 h-8 brutal-border rounded-full border-t-black"></div></div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gray-200 via-white to-gray-400 dark:from-gray-900 dark:via-black dark:to-gray-800 p-4 relative overflow-hidden">
      {/* Decorative background elements to enhance glass effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/10 dark:bg-black/10 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white/20 dark:bg-black/20 backdrop-blur-md text-black dark:text-white flex items-center justify-center rounded-2xl border border-white/30 dark:border-white/10 mx-auto mb-6 text-3xl shadow-lg">
            🔗
          </div>
          <h1 className="text-4xl font-bold font-display tracking-tight mb-2 text-black dark:text-white">Welcome Back</h1>
          <p className="text-black/60 dark:text-white/60 font-medium">Access your personal links vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-black/80 dark:bg-white/80 backdrop-blur-md text-white dark:text-black font-bold text-lg rounded-xl border border-white/20 dark:border-black/20 shadow-xl hover:bg-black dark:hover:bg-white disabled:opacity-50 transition-all active:scale-95"
          >
            {isPending ? "Authenticating..." : "Login to Vault"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

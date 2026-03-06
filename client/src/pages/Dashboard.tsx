import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useLinks } from "@/hooks/use-links";
import { AddLinkModal } from "@/components/AddLinkModal";
import { LinkCard } from "@/components/LinkCard";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const { mutate: logout } = useLogout();
  const { data: links = [], isLoading: isLinksLoading } = useLinks();
  
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

  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUserLoading || !user) return <div className="h-screen w-full flex items-center justify-center"><div className="animate-spin w-8 h-8 brutal-border rounded-full border-t-black"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
      {/* Navigation / Header Bar */}
      <nav className="border-b-2 border-black dark:border-white bg-white dark:bg-black sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-lg brutal-border shadow-brutal text-xl">
              🔗
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">LinkVault</span>
          </div>
          
          <div className="flex items-center gap-4">
            <AddLinkModal />
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight mb-2 leading-tight">
            Welcome back Akash vaddapelli😎
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
            Your Links are safe and secured ...here!😊
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
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-base bg-white dark:bg-black brutal-border rounded-xl shadow-brutal focus:outline-none focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all placeholder:text-gray-400"
          />
        </motion.div>

        {/* Links Grid */}
        {isLinksLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl brutal-border animate-pulse" />
            ))}
          </div>
        ) : filteredLinks.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <LinkCard link={link} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-black rounded-3xl brutal-border shadow-brutal border-dashed">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold font-display mb-2">No links found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search query." : "Click 'Add Link' to save your first URL."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

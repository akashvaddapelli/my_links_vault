import { useState } from "react";
import { FiLink, FiCopy, FiCheck } from "react-icons/fi";
import { 
  SiGithub, SiInstagram, SiTwitter, SiYoutube, SiLinkedin, 
  SiFacebook, SiTiktok, SiReddit, SiFigma, SiDribbble, 
  SiNotion, SiGoogle, SiX
} from "react-icons/si";
import type { LinkResponse } from "@shared/routes";
import { LinkDetailsModal } from "./LinkDetailsModal";
import { useToast } from "@/hooks/use-toast";

const getIconForTitle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('github')) return <SiGithub />;
  if (t.includes('instagram')) return <SiInstagram />;
  if (t.includes('twitter') || t.includes(' x ')) return <SiX />;
  if (t.includes('youtube')) return <SiYoutube />;
  if (t.includes('linkedin')) return <SiLinkedin />;
  if (t.includes('facebook')) return <SiFacebook />;
  if (t.includes('tiktok')) return <SiTiktok />;
  if (t.includes('reddit')) return <SiReddit />;
  if (t.includes('figma')) return <SiFigma />;
  if (t.includes('dribbble')) return <SiDribbble />;
  if (t.includes('notion')) return <SiNotion />;
  if (t.includes('google')) return <SiGoogle />;
  return <FiLink />;
};

export function LinkCard({ link }: { link: LinkResponse }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const icon = getIconForTitle(link.title);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    toast({
      title: "URL Copied!",
      description: "Link has been copied to your clipboard.",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="relative group">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-2 p-2 bg-white dark:bg-black rounded-lg brutal-border shadow-brutal shadow-brutal-hover shadow-brutal-active text-left group"
        >
          <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-md text-sm group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
            {icon}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-bold font-display text-xs truncate">{link.title}</h3>
          </div>
        </button>
        
        <button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-black brutal-border rounded-lg shadow-brutal hover:scale-110 active:scale-95 transition-all z-10"
          title="Copy URL"
        >
          {copied ? <FiCheck className="text-green-500 w-3 h-3" /> : <FiCopy className="w-3 h-3" />}
        </button>
      </div>

      {isModalOpen && (
        <LinkDetailsModal 
          link={link} 
          icon={icon} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}

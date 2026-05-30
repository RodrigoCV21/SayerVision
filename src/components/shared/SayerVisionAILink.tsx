import { Link } from "react-router-dom";
import { Palette } from "lucide-react";

export function SayerVisionAILink() {
  return (
    <Link
      to="/app"
      className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:bg-accent/5 transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
        <Palette className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
      </div>
      <span className="font-display font-bold text-foreground hidden sm:inline">SayerVisionAI</span>
    </Link>
  );
}

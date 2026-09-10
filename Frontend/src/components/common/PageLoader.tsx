import React from "react";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-slate-600">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default PageLoader;

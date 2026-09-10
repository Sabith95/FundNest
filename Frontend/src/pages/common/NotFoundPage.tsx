import React from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Navigates to the previous page in browser history
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileQuestion size={32} />
        </div>

        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">
          Page Not Found
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

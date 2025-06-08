import { useState } from "react";
import { X, RefreshCw, Home, AlertTriangle, User2 } from "lucide-react";
import { useNavigate } from "react-router";

type ErrorPopupProps = {
  open?: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  onRefresh?: () => void;
  onBackToDashboard?: () => void;
  onBackToLoginPage?: () => void;
  showRefresh?: boolean;
  showBackToDashboard?: boolean;
  showBackToLoginPage?: boolean;
};

const ErrorPopup = ({
  open = true,
  title = "Oops! Something went wrong",
  message = "We encountered an unexpected error. Please try again or contact support if the problem persists.",
  onClose,
  onRefresh,
  onBackToDashboard,
  onBackToLoginPage,
  showRefresh = true,
  showBackToDashboard = true,
  showBackToLoginPage = false,
}: ErrorPopupProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const navigate = useNavigate();

  const handleCloseClick = () => {
    setShowCloseConfirm(true);
  };

  const confirmClose = () => {
    setShowCloseConfirm(false);
    if (onClose) onClose();
    setIsOpen(false);
  };

  const cancelClose = () => {
    setShowCloseConfirm(false);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleBackToDashboard = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate("/");
    }
  };

  const handleBackToLoginPage = () => {
    if (onBackToLoginPage) {
      onBackToLoginPage();
    } else {
      navigate("/signin");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1b1b11] backdrop-blur-xs">
      <div className="relative close-goal-popup-exception w-full max-w-md transform transition-all duration-300 ease-out">
        {/* Main Error Modal */}
        <div
          className={`bg-(--theme) rounded-2xl shadow-2xl border border-(--theme-darker) overflow-hidden ${
            showCloseConfirm ? "scale-95 opacity-75" : "scale-100 opacity-100"
          } transition-all duration-200`}
        >
          {/* Header */}
          <div className="relative px-6 py-4 border-b border-(--theme-darker)">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: "#fee2e2" }}>
                  <AlertTriangle className="w-5 h-5 text-red-500" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-(--theme-reverse)">{title}</h3>
              </div>
              <button onClick={handleCloseClick} className="p-2 rounded-full transition-colors duration-200 cursor-pointer text-(--gray)">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-(--theme-reverse) leading-relaxed mb-6">{message}</p>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {showRefresh && (
                <button
                  onClick={handleRefresh}
                  className="bg-(--accent) text-(--theme) shadow-[0_4px_12px_rgba(102,178,255,0.3)] flex items-center cursor-pointer justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50"
                  onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "var(--accent-hard)")}
                  onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "var(--accent)")}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </button>
              )}

              {showBackToDashboard && (
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center border-(--accent) text-(--accent) bg-(--theme) cursor-pointer justify-center px-4 py-3 rounded-xl font-medium border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50"
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "var(--accent-soft)";
                    (e.target as HTMLButtonElement).style.borderColor = "var(--accent-hard)";
                    (e.target as HTMLButtonElement).style.color = "var(--theme-reverse)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "var(--white)";
                    (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.target as HTMLButtonElement).style.color = "var(--accent)";
                  }}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </button>
              )}
              {showBackToLoginPage && (
                <button
                  onClick={handleBackToLoginPage}
                  className="flex items-center border-(--accent) text-(--accent) bg-(--theme) cursor-pointer justify-center px-4 py-3 rounded-xl font-medium border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50"
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "var(--accent-soft)";
                    (e.target as HTMLButtonElement).style.borderColor = "var(--accent-hard)";
                    (e.target as HTMLButtonElement).style.color = "var(--theme-reverse)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "var(--white)";
                    (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.target as HTMLButtonElement).style.color = "var(--accent)";
                  }}
                >
                  <User2 className="w-4 h-4 mr-2" />
                  Back to Login Page
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Close Confirmation Modal */}
        {showCloseConfirm && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-(--theme) rounded-xl shadow-xl border border-(--theme-darker) p-6 w-full max-w-sm transform scale-100 transition-all duration-200">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" style={{ backgroundColor: "#fef3c7" }}>
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="text-lg font-semibold text-(--theme-reverse) mb-2">Close Error Dialog?</h4>
                <p className="text-(--gray) mb-6">Are you sure you want to close this error dialog? The issue may still persist.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelClose}
                    className="flex-1 text-(--gray) px-4 cursor-pointer py-2 rounded-lg font-medium border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClose}
                    className="flex-1 px-4 py-2 bg-(--accent) text-(--theme) cursor-pointer rounded-lg font-medium transition-colors duration-200"
                    onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "var(--accent-hard)")}
                    onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "var(--accent)")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPopup;

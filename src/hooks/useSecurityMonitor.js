import { useState, useEffect, useCallback } from 'react';

export function useSecurityMonitor({
  isEnabled = false,
  maxViolations = 3,
  onMaxViolationsExceeded = () => {},
  onViolationOccurred = () => {}
}) {
  const [violationCount, setViolationCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [lastViolationReason, setLastViolationReason] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const registerViolation = useCallback((reason) => {
    if (!isEnabled) return;
    
    setViolationCount((prev) => {
      const nextCount = prev + 1;
      setLastViolationReason(reason);
      setShowWarningModal(true);
      onViolationOccurred(nextCount, reason);

      if (nextCount >= maxViolations) {
        onMaxViolationsExceeded(nextCount, reason);
      }
      return nextCount;
    });
  }, [isEnabled, maxViolations, onMaxViolationsExceeded, onViolationOccurred]);

  // Request Fullscreen
  const requestFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.warn('Fullscreen request bypassed by browser permissions:', err);
    }
  };

  useEffect(() => {
    if (!isEnabled) return;

    // Visibility change (tab switch / window minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerViolation('Tab Switch / Window Minimized detected');
      }
    };

    // Window blur
    const handleWindowBlur = () => {
      registerViolation('Window focus lost (Switched window/app)');
    };

    // Fullscreen change
    const handleFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFull);
      if (!isFull) {
        registerViolation('Exited Fullscreen exam mode');
      }
    };

    // Disable context menu right click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable shortcuts (F12, Ctrl+Shift+I, Ctrl+C, Ctrl+V, Alt+Tab)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
      ) {
        e.preventDefault();
        registerViolation('DevTools / Inspect shortcut blocked');
      }
    };

    // Auto re-enter fullscreen on user click if currently exited
    const handleUserClick = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!isFull) {
        requestFullscreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleUserClick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleUserClick);
    };
  }, [isEnabled, registerViolation]);

  return {
    violationCount,
    showWarningModal,
    setShowWarningModal,
    lastViolationReason,
    isFullscreen,
    requestFullscreen
  };
}

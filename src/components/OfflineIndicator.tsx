import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500/95 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-b border-amber-600 shadow-sm sticky top-0 z-40 backdrop-blur-sm">
      <WifiOff className="w-4 h-4 shrink-0 text-amber-900" />
      <span>
        You are currently offline. The AI assistant requires an active internet connection.
      </span>
    </div>
  );
};

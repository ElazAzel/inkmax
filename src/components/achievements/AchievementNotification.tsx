import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/types/achievements';
import { RARITY_COLORS, RARITY_LABELS } from '@/types/achievements';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification with animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-[100] w-[90vw] max-w-sm transition-all duration-300",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <Card className={cn(
        "p-4 shadow-2xl border-2 bg-gradient-to-br",
        RARITY_COLORS[achievement.rarity],
        "text-white"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-medium opacity-90 mb-1">
                {RARITY_LABELS[achievement.rarity]}
              </div>
              <h4 className="font-bold text-lg">Достижение!</h4>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Achievement Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl animate-scale-in">{achievement.icon}</div>
          <div className="flex-1">
            <h5 className="font-semibold text-base mb-1">{achievement.title}</h5>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
        </div>

        {/* Sparkle Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAchievements } from '@/hooks/useAchievements';
import { RARITY_COLORS, RARITY_LABELS } from '@/types/achievements';
import type { Achievement } from '@/types/achievements';

interface AchievementsPanelProps {
  onClose: () => void;
}

export function AchievementsPanel({ onClose }: AchievementsPanelProps) {
  const { getAllAchievements, getAchievementsByCategory, getProgress } = useAchievements();
  const progress = getProgress();
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');

  const achievements = selectedCategory === 'all' 
    ? getAllAchievements() 
    : getAchievementsByCategory(selectedCategory);

  const categories = [
    { key: 'all' as const, label: 'Все', icon: '🏆' },
    { key: 'blocks' as const, label: 'Блоки', icon: '🧩' },
    { key: 'features' as const, label: 'Функции', icon: '⚡' },
    { key: 'milestones' as const, label: 'Вехи', icon: '🎯' },
    { key: 'social' as const, label: 'Соц. сети', icon: '🌟' },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header - Mobile Optimized */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Достижения</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Открыто {progress.unlocked} из {progress.total}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress.percentage} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {progress.percentage}% завершено
            </p>
          </div>
        </div>

        {/* Categories - Mobile Scroll */}
        <div className="flex gap-1.5 sm:gap-2 p-3 sm:p-4 border-b overflow-x-auto scrollbar-hide">
          {categories.map(category => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
              className="whitespace-nowrap text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <span className="mr-1 sm:mr-2">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Achievements Grid - Mobile Optimized */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3">
            {achievements.map(achievement => (
              <Card
                key={achievement.key}
                className={cn(
                  "p-3 sm:p-4 transition-all",
                  achievement.unlocked
                    ? "border-2 bg-gradient-to-br " + RARITY_COLORS[achievement.rarity] + " text-white"
                    : "border-dashed opacity-50 grayscale"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={cn(
                    "text-2xl sm:text-3xl flex-shrink-0",
                    !achievement.unlocked && "filter grayscale"
                  )}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-sm sm:text-base">
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 whitespace-nowrap">
                          {RARITY_LABELS[achievement.rarity]}
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs sm:text-sm",
                      achievement.unlocked ? "opacity-90" : "text-muted-foreground"
                    )}>
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Заблокировано
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

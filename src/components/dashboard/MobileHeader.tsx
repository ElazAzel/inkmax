import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StreakDisplay } from '@/components/streak/StreakDisplay';
import { TokenBalanceDisplay } from '@/components/tokens/TokenBalanceDisplay';
import logoIcon from '@/assets/logo-icon.png';

interface MobileHeaderProps {
  onSignOut: () => void;
  onOpenGallery: () => void;
  onOpenTokens?: () => void;
  userId?: string;
}

export function MobileHeader({ onSignOut, onOpenGallery, onOpenTokens, userId }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 md:hidden">
      <div className="mx-3 mt-3">
        <div className="backdrop-blur-2xl bg-card/75 border border-border/30 rounded-[22px] shadow-glass-lg px-3 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-colors" />
              <img
                src={logoIcon}
                alt="Lnkmx"
                className="relative h-8 w-8 rounded-xl shadow-sm object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <h1 className="text-lg font-black text-primary tracking-tight">lnkmx</h1>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Streak Display - compact */}
            <StreakDisplay userId={userId} compact />
            
            {/* Token Balance - compact */}
            <TokenBalanceDisplay onClick={onOpenTokens} compact />
            
            {/* Sign Out */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSignOut}
              className={cn(
                "h-9 w-9 rounded-xl",
                "hover:bg-destructive/10 hover:text-destructive",
                "active:scale-95 transition-all duration-200"
              )}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

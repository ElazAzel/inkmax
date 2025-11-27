import { memo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check, Moon, Sun, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { PageTheme } from '@/types/page';

interface ThemeSelectorProps {
  currentTheme: PageTheme;
  onThemeChange: (theme: Partial<PageTheme>) => void;
}

const THEMES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean and minimal',
    isPremium: false,
    theme: {
      backgroundColor: 'hsl(var(--background))',
      textColor: 'hsl(var(--foreground))',
      buttonStyle: 'rounded' as const,
      fontFamily: 'sans' as const,
    },
    preview: {
      bg: 'bg-background',
      text: 'text-foreground',
      button: 'bg-primary text-primary-foreground',
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark design',
    isPremium: false,
    theme: {
      backgroundColor: 'hsl(220 13% 9%)',
      textColor: 'hsl(210 40% 98%)',
      buttonStyle: 'rounded' as const,
      fontFamily: 'sans' as const,
      darkMode: true,
    },
    preview: {
      bg: 'bg-slate-900',
      text: 'text-slate-50',
      button: 'bg-slate-700 text-slate-100',
    }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Colorful and vibrant',
    isPremium: false,
    theme: {
      backgroundColor: 'linear-gradient(135deg, hsl(280 100% 70%) 0%, hsl(220 100% 75%) 100%)',
      textColor: 'hsl(0 0% 100%)',
      buttonStyle: 'rounded' as const,
      fontFamily: 'sans' as const,
    },
    preview: {
      bg: 'bg-gradient-to-br from-purple-400 to-blue-400',
      text: 'text-white',
      button: 'bg-white/20 text-white backdrop-blur-sm',
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra clean aesthetic',
    isPremium: false,
    theme: {
      backgroundColor: 'hsl(0 0% 98%)',
      textColor: 'hsl(0 0% 13%)',
      buttonStyle: 'default' as const,
      fontFamily: 'mono' as const,
    },
    preview: {
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      button: 'bg-gray-900 text-white',
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bold and electric',
    isPremium: true,
    theme: {
      backgroundColor: 'hsl(270 100% 5%)',
      textColor: 'hsl(180 100% 70%)',
      buttonStyle: 'pill' as const,
      fontFamily: 'sans' as const,
      accentColor: 'hsl(180 100% 70%)',
      shadowIntensity: 'glow' as const,
    },
    preview: {
      bg: 'bg-violet-950',
      text: 'text-cyan-400',
      button: 'bg-cyan-400 text-violet-950',
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Pro',
    description: 'Warm gradients',
    isPremium: true,
    theme: {
      backgroundColor: 'linear-gradient(135deg, hsl(15 100% 65%) 0%, hsl(340 100% 70%) 100%)',
      textColor: 'hsl(0 0% 100%)',
      buttonStyle: 'gradient' as const,
      fontFamily: 'sans' as const,
      shadowIntensity: 'strong' as const,
    },
    preview: {
      bg: 'bg-gradient-to-br from-orange-400 to-pink-500',
      text: 'text-white',
      button: 'bg-white/30 text-white backdrop-blur-sm',
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Pro',
    description: 'Deep blue vibes',
    isPremium: true,
    theme: {
      backgroundColor: 'linear-gradient(135deg, hsl(200 100% 40%) 0%, hsl(220 100% 20%) 100%)',
      textColor: 'hsl(0 0% 100%)',
      buttonStyle: 'rounded' as const,
      fontFamily: 'sans' as const,
      shadowIntensity: 'glow' as const,
    },
    preview: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-900',
      text: 'text-white',
      button: 'bg-white/20 text-white backdrop-blur-sm',
    }
  },
  {
    id: 'forest',
    name: 'Forest Pro',
    description: 'Natural greens',
    isPremium: true,
    theme: {
      backgroundColor: 'linear-gradient(135deg, hsl(140 60% 40%) 0%, hsl(160 80% 25%) 100%)',
      textColor: 'hsl(0 0% 100%)',
      buttonStyle: 'pill' as const,
      fontFamily: 'sans' as const,
      shadowIntensity: 'medium' as const,
    },
    preview: {
      bg: 'bg-gradient-to-br from-green-600 to-emerald-800',
      text: 'text-white',
      button: 'bg-white/25 text-white backdrop-blur-sm',
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Pro',
    description: 'Dark with purple accent',
    isPremium: true,
    theme: {
      backgroundColor: 'hsl(240 20% 8%)',
      textColor: 'hsl(0 0% 95%)',
      buttonStyle: 'rounded' as const,
      fontFamily: 'sans' as const,
      accentColor: 'hsl(280 100% 70%)',
      shadowIntensity: 'glow' as const,
      darkMode: true,
    },
    preview: {
      bg: 'bg-slate-950',
      text: 'text-slate-50',
      button: 'bg-purple-500 text-white',
    }
  },
];

export const ThemeSelector = memo(function ThemeSelector({ 
  currentTheme, 
  onThemeChange 
}: ThemeSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Simple theme matching based on backgroundColor
  const activeThemeId = THEMES.find(
    t => t.theme.backgroundColor === currentTheme.backgroundColor
  )?.id || 'classic';

  return (
    <div className="space-y-6">
      {/* Dark/Light Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          {currentTheme.darkMode ? (
            <Moon className="h-5 w-5 text-primary" />
          ) : (
            <Sun className="h-5 w-5 text-primary" />
          )}
          <div>
            <Label className="text-sm font-semibold">Dark Mode</Label>
            <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
          </div>
        </div>
        <Switch
          checked={currentTheme.darkMode || false}
          onCheckedChange={(checked) => onThemeChange({ darkMode: checked })}
        />
      </div>

      {/* Theme Presets */}
      <div>
        <Label className="text-base font-semibold">Theme Presets</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Choose a pre-designed theme for your page
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map((theme) => (
            <Card
              key={theme.id}
              onClick={() => onThemeChange(theme.theme)}
              className={cn(
                "relative cursor-pointer transition-all hover:scale-105 overflow-hidden",
                activeThemeId === theme.id 
                  ? "ring-2 ring-primary shadow-lg" 
                  : "hover:ring-1 hover:ring-border"
              )}
            >
              {/* Premium Badge */}
              {theme.isPremium && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                    PRO
                  </span>
                </div>
              )}

              {/* Theme Preview */}
              <div className={cn("h-24 p-3 flex flex-col gap-1.5", theme.preview.bg)}>
                <div className={cn("text-xs font-medium", theme.preview.text)}>
                  Aa
                </div>
                <div className={cn(
                  "h-4 rounded-full w-full text-[8px] flex items-center justify-center font-medium",
                  theme.preview.button
                )}>
                  Button
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-2 bg-card">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-semibold">{theme.name}</h4>
                  {activeThemeId === theme.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <Palette className="h-4 w-4 mr-2" />
            Advanced Theme Settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          {/* Accent Color */}
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <input
              type="color"
              value={currentTheme.accentColor || '#3b82f6'}
              onChange={(e) => onThemeChange({ accentColor: e.target.value })}
              className="w-full h-10 rounded-md border border-input cursor-pointer"
            />
          </div>

          {/* Shadow Intensity */}
          <div className="space-y-2">
            <Label>Shadow Intensity</Label>
            <Select
              value={currentTheme.shadowIntensity || 'medium'}
              onValueChange={(value: any) => onThemeChange({ shadowIntensity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="soft">Soft</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="strong">Strong</SelectItem>
                <SelectItem value="glow">Glow Effect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Gradient */}
          <div className="space-y-2">
            <Label>Custom Gradient (Optional)</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Start Color</Label>
                <input
                  type="color"
                  value={currentTheme.customGradientStart || '#3b82f6'}
                  onChange={(e) => onThemeChange({ customGradientStart: e.target.value })}
                  className="w-full h-10 rounded-md border border-input cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">End Color</Label>
                <input
                  type="color"
                  value={currentTheme.customGradientEnd || '#8b5cf6'}
                  onChange={(e) => onThemeChange({ customGradientEnd: e.target.value })}
                  className="w-full h-10 rounded-md border border-input cursor-pointer"
                />
              </div>
            </div>
            {currentTheme.customGradientStart && currentTheme.customGradientEnd && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const gradient = `linear-gradient(135deg, ${currentTheme.customGradientStart} 0%, ${currentTheme.customGradientEnd} 100%)`;
                  onThemeChange({ 
                    backgroundColor: gradient,
                    backgroundGradient: gradient 
                  });
                }}
                className="w-full mt-2"
              >
                Apply Gradient
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

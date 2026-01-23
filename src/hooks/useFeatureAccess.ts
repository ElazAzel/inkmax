import { useFreemiumLimits, type FreeTier } from '@/hooks/useFreemiumLimits';

export function useFeatureAccess(requiredTier: FreeTier): boolean {
  const { currentTier } = useFreemiumLimits();

  const tierLevel = (tier: FreeTier): number => {
    switch (tier) {
      case 'pro':
        return 2;
      default:
        return 1;
    }
  };

  return tierLevel(currentTier) >= tierLevel(requiredTier);
}

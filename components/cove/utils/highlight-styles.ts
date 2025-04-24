import type { CustomGlossTabTable } from '~/db/schema';

/**
 * Determines the border color based on validation status
 */
export const getHighlightBorder = (
  section: string,
  tabs: CustomGlossTabTable[] = []
): string => {
  const tab = tabs.find((tab) => tab.name === section);
  return tab?.isCorrect || tab?.isVerified
    ? 'border-green-500'
    : 'border-yellow-400';
};

/**
 * Determines the background fill color for the selected section
 * and applies opacity for non-selected sections
 */
export const getHighlightFill = (
  section: string,
  tabInfoSelected: { name: string; isCorrect: boolean; isVerified: boolean }
): string => {
  // If this is the selected section
  if (tabInfoSelected.name === section) {
    return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
      ? 'bg-green-100/50'
      : 'bg-yellow-100/50';
  }

  // If this is not the selected section, apply opacity only
  // Using Tailwind's 60% opacity creates good visual distinction while maintaining readability
  return 'opacity-60';
};

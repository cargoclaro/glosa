import type { CustomGlossTabTable } from '~/db/schema';

/**
 * Determines the border color based on validation status
 * This border should ALWAYS be visible regardless of selection
 */
export const getValidationBorder = (
  section: string,
  tabs: CustomGlossTabTable[] = []
): string => {
  const tab = tabs.find((tab) => tab.name === section);
  
  if (!tab) {
    return 'border-gray-400'; // Default border when no validation data
  }
  
  if (tab.isCorrect || tab.isVerified) {
    return 'border-green-500 border-2'; // Success state - green border
  } else {
    return 'border-yellow-400 border-2'; // Warning/needs review state - yellow border
  }
};

/**
 * Determines the background fill color ONLY for the selected section
 */
export const getSelectionFill = (
  section: string,
  tabInfoSelected: { name: string; isCorrect: boolean; isVerified: boolean }
): string => {
  // Only apply background if this is the selected section
  if (tabInfoSelected.name === section) {
    if (tabInfoSelected.isCorrect || tabInfoSelected.isVerified) {
      return 'bg-green-100/30'; // Light green background for selected valid section
    } else {
      return 'bg-yellow-100/30'; // Light yellow background for selected warning section
    }
  }

  return ''; // No background for non-selected sections
};

/**
 * Determines header styling for selected sections
 */
export const getSelectionHeaderStyle = (
  section: string,
  tabInfoSelected: { name: string; isCorrect: boolean; isVerified: boolean }
): string => {
  if (tabInfoSelected.name === section) {
    return 'font-bold'; // Bold headers when selected
  }
  
  return ''; // No additional styling when not selected - keep original font-weight
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use getValidationBorder instead
 */
export const getHighlightBorder = (
  section: string,
  tabs: CustomGlossTabTable[] = []
): string => {
  return getValidationBorder(section, tabs);
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use getSelectionFill instead
 */
export const getHighlightFill = (
  section: string,
  tabInfoSelected: { name: string; isCorrect: boolean; isVerified: boolean }
): string => {
  return getSelectionFill(section, tabInfoSelected);
};

import type { CustomGlossTabTable } from '~/db/schema';

// Importar el tipo correcto que incluye las validaciones
type TabValidation = {
  id: number;
  name: string | null;
  isCorrect: boolean | null;
  // Otros campos que no necesitamos para esta función
};

type TabWithValidations = {
  id: string;
  name: string;
  isCorrect: boolean;
  isVerified: boolean;
  validations: TabValidation[];
};

/**
 * Mapea las secciones clickeadas a los nombres de tabs de validación
 */
const mapSectionToTabName = (section: string, coveNumber?: number): string[] => {
  const baseTabName = coveNumber ? `COVE ${coveNumber}` : 'COVE';
  
  // Para secciones específicas, buscar tanto la nueva estructura como la antigua
  if (section === 'Datos Generales' || section === 'Datos generales del proveedor') {
    return [
      `${baseTabName} - Datos Generales`,
      `${baseTabName}`, // Fallback para estructura antigua
    ];
  }
  
  if (section === 'Datos Proveedor Destinatario' ||
      section === 'Domicilio del proveedor' ||
      section === 'Datos generales del destinatario' ||
      section === 'Domicilio del destinatario') {
    return [
      `${baseTabName} - Datos Proveedor Destinatario`,
      `${baseTabName}`, // Fallback para estructura antigua
    ];
  }
  
  if (section === 'Datos de la mercancía' || section === 'Validación de mercancías') {
    return [
      `${baseTabName} - Validación de mercancías`,
      `${baseTabName}`, // Fallback para estructura antigua
    ];
  }
  
  // Para otras secciones, usar el nombre tal como viene
  return [section, `${baseTabName}`];
};

/**
 * Mapea las secciones de UI a los nombres exactos de las validaciones específicas
 */
const mapSectionToValidationName = (section: string): string[] => {
  const validationMappings: Record<string, string[]> = {
    // Datos Generales
    'Datos Generales': [
      'Número de Factura (Importación)',
      'Fecha de Expedición (Importación)',
      'Número de Factura (Exportación)',
      'Fecha de Expedición (Exportación)',
    ],
    
    // Datos Proveedor Destinatario - mapear a validaciones específicas
    'Datos Proveedor Destinatario': [
      'Datos generales del proveedor',
      'Domicilio del proveedor', 
      'Datos generales del destinatario',
      'Domicilio del destinatario'
    ],
    'Datos generales del proveedor': ['Datos generales del proveedor'],
    'Domicilio del proveedor': ['Domicilio del proveedor'],
    'Datos generales del destinatario': ['Datos generales del destinatario'],
    'Domicilio del destinatario': ['Domicilio del destinatario'],
    
    // Datos de la mercancía
    'Datos de la mercancía': [
      'Mercancias',
      'Valor total en dólares',
      'Número de serie'
    ],
    'Validación de mercancías': [
      'Mercancias',
      'Valor total en dólares', 
      'Número de serie'
    ],
  };

  return validationMappings[section] || [section];
};

/**
 * Busca una validación específica en los tabs
 */
const findValidationInTabs = (
  validationNames: string[],
  tabs: (CustomGlossTabTable | TabWithValidations)[]
): { isValid: boolean; exists: boolean } => {
  for (const tab of tabs) {
    // Type guard para verificar si el tab tiene validaciones
    if (hasValidations(tab)) {
      for (const validation of tab.validations) {
        if (validation.name && validationNames.includes(validation.name)) {
          return {
            isValid: validation.isCorrect ?? false,
            exists: true
          };
        }
      }
    }
  }
  
  return { isValid: false, exists: false };
};

/**
 * Type guard para verificar si un tab tiene validaciones
 */
const hasValidations = (tab: CustomGlossTabTable | TabWithValidations): tab is TabWithValidations => {
  return 'validations' in tab && Array.isArray((tab as TabWithValidations).validations);
};

/**
 * Determina si una sección específica está actualmente seleccionada
 * Nueva versión más granular para COVEs
 */
const isSectionSelected = (
  section: string, 
  tabInfoSelected: { name: string; isCorrect: boolean; isVerified: boolean },
  selectedCoveSection: string,
  coveNumber?: number
): boolean => {
  console.log('isSectionSelected called:', {
    section,
    tabInfoSelected: tabInfoSelected.name,
    selectedCoveSection,
    coveNumber
  });
  
  // Si hay una sección específica seleccionada, hacer comparación granular
  if (selectedCoveSection) {
    // Verificar si la sección actual es exactamente la que fue clickeada
    const isExactMatch = section === selectedCoveSection;
    
    // También verificar mapeos específicos para casos donde los nombres no coinciden exactamente
    const sectionMappings: Record<string, string[]> = {
      'Datos Generales': ['Datos generales del proveedor', 'Datos Generales'],
      'Datos generales del proveedor': ['Datos Generales', 'Datos generales del proveedor'],
      'Datos Proveedor Destinatario': [
        'Domicilio del proveedor', 
        'Datos generales del destinatario', 
        'Domicilio del destinatario',
        'Datos Proveedor Destinatario'
      ],
      'Domicilio del proveedor': ['Datos Proveedor Destinatario', 'Domicilio del proveedor'],
      'Datos generales del destinatario': ['Datos Proveedor Destinatario', 'Datos generales del destinatario'],
      'Domicilio del destinatario': ['Datos Proveedor Destinatario', 'Domicilio del destinatario'],
      'Datos de la mercancía': ['Validación de mercancías', 'Datos de la mercancía'],
      'Validación de mercancías': ['Datos de la mercancía', 'Validación de mercancías']
    };
    
    // Si hay mapeo específico, usar eso
    const mappedSections = sectionMappings[selectedCoveSection] || [];
    const isMappedMatch = mappedSections.includes(section);
    
    const result = isExactMatch || isMappedMatch;
    console.log('Granular matching:', { 
      isExactMatch, 
      isMappedMatch, 
      mappedSections, 
      result 
    });
    
    return result;
  }
  
  // Fallback a verificar si estamos en el tab correcto del COVE
  const possibleTabNames = mapSectionToTabName(section, coveNumber);
  const isInCorrectTab = possibleTabNames.includes(tabInfoSelected.name);
  
  console.log('Fallback tab matching:', { 
    possibleTabNames, 
    currentTab: tabInfoSelected.name, 
    isInCorrectTab 
  });
  
  return isInCorrectTab;
};

/**
 * Determina el color del borde basado en el estado de validación ESPECÍFICA
 */
export const getHighlightBorder = (
  section: string,
  tabs: (CustomGlossTabTable | TabWithValidations)[] = [],
  coveNumber?: number
): string => {
  // Mapear la sección a nombres de validaciones específicas
  const validationNames = mapSectionToValidationName(section);
  
  // Buscar la validación específica en los tabs
  const validationResult = findValidationInTabs(validationNames, tabs);
  
  // Si encontramos la validación específica, usar su estado
  if (validationResult.exists) {
    return validationResult.isValid ? 'border-green-500' : 'border-yellow-400';
  }
  
  // Fallback: usar el método anterior (estado general del tab)
  const possibleTabNames = mapSectionToTabName(section, coveNumber);
  const tab = tabs.find((tab) => possibleTabNames.includes(tab.name));
  
  return tab?.isCorrect || tab?.isVerified
    ? 'border-green-500'
    : 'border-yellow-400';
};

/**
 * Determina el color de fondo para la sección seleccionada
 * y aplica opacidad para las secciones no seleccionadas
 */
export const getHighlightFill = (
  section: string,
  tabInfoSelected: { name: string; isCorrect: boolean; isVerified: boolean },
  selectedCoveSection: string,
  tabs: (CustomGlossTabTable | TabWithValidations)[] = [],
  coveNumber?: number
): string => {
  // Verificar si esta sección está actualmente seleccionada usando la nueva lógica granular
  if (isSectionSelected(section, tabInfoSelected, selectedCoveSection, coveNumber)) {
    // Para la sección seleccionada, usar el estado de la validación específica
    const validationNames = mapSectionToValidationName(section);
    const validationResult = findValidationInTabs(validationNames, tabs);
    
    if (validationResult.exists) {
      return validationResult.isValid ? 'bg-green-100/50' : 'bg-yellow-100/50';
    }
    
    // Fallback al estado general del tab
    return tabInfoSelected.isCorrect || tabInfoSelected.isVerified
      ? 'bg-green-100/50'
      : 'bg-yellow-100/50';
  }

  // Si esta no es la sección seleccionada, aplicar opacidad solamente
  return 'opacity-60';
};

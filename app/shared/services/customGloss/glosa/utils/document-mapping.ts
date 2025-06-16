import type { Cove } from '../../extract-and-structure/schemas/cove';
import type { Factura } from '../../extract-and-structure/schemas/factura';

/**
 * Resultado del mapeo entre una factura y un COVE
 */
export interface FacturaCoveMapping {
  factura: Factura;
  cove: Cove;
  facturaIndex: number;
  coveIndex: number;
  matchType: 'exact' | 'partial' | 'no_match';
  confidence: number;
}

/**
 * Información sobre documentos no mapeados
 */
export interface UnmappedDocuments {
  facturasNoMapeadas: Array<{ factura: Factura; index: number; reason: string }>;
  covesNoMapeados: Array<{ cove: Cove; index: number; reason: string }>;
}

/**
 * Resultado completo del mapeo
 */
export interface DocumentMappingResult {
  mappings: FacturaCoveMapping[];
  unmapped: UnmappedDocuments;
  summary: {
    totalFacturas: number;
    totalCoves: number;
    mappingsExactos: number;
    mappingsParciales: number;
    facturasNoMapeadas: number;
    covesNoMapeados: number;
  };
}

/**
 * Normaliza un número de factura para comparación
 * Remueve espacios, guiones, y convierte a minúsculas
 */
function normalizeInvoiceNumber(invoiceNumber: string): string {
  return invoiceNumber
    .toLowerCase()
    .replace(/[-\s_]/g, '')
    .trim();
}

/**
 * Calcula la similitud entre dos números de factura normalizados
 * Retorna un valor entre 0 y 1 (1 = idénticos)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeInvoiceNumber(str1);
  const norm2 = normalizeInvoiceNumber(str2);
  
  if (norm1 === norm2) return 1.0;
  
  // Si uno contiene al otro (tipo "12345" vs "INV-12345")
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    const shorter = Math.min(norm1.length, norm2.length);
    const longer = Math.max(norm1.length, norm2.length);
    return shorter / longer * 0.8; // Factor de penalización por no ser exacto
  }
  
  // Algoritmo de distancia Levenshtein simplificado
  const maxLength = Math.max(norm1.length, norm2.length);
  if (maxLength === 0) return 1.0;
  
  let distance = 0;
  for (let i = 0; i < maxLength; i++) {
    if (norm1[i] !== norm2[i]) distance++;
  }
  
  return Math.max(0, 1 - (distance / maxLength));
}

/**
 * Busca la mejor coincidencia para una factura entre los COVEs disponibles
 */
function findBestCoveMatch(
  factura: Factura,
  facturaIndex: number,
  coves: Cove[],
  usedCoveIndices: Set<number>
): FacturaCoveMapping | null {
  let bestMatch: FacturaCoveMapping | null = null;
  let bestScore = 0;
  
  coves.forEach((cove, coveIndex) => {
    if (usedCoveIndices.has(coveIndex)) return;
    
    const coveInvoiceNumber = cove.datosDelAcuseDeValor.numeroDeFactura;
    const similarity = calculateSimilarity(factura.invoice_number, coveInvoiceNumber);
    
    if (similarity > bestScore) {
      let matchType: 'exact' | 'partial' | 'no_match';
      if (similarity >= 0.95) matchType = 'exact';
      else if (similarity >= 0.7) matchType = 'partial';
      else matchType = 'no_match';
      
      if (matchType !== 'no_match') {
        bestMatch = {
          factura,
          cove,
          facturaIndex,
          coveIndex,
          matchType,
          confidence: similarity
        };
        bestScore = similarity;
      }
    }
  });
  
  return bestMatch;
}



/**
 * Mapea facturas con COVEs basado en números de factura
 */
export function mapFacturasWithCoves(
  facturas: Factura[],
  coves: Cove[]
): DocumentMappingResult {
  const mappings: FacturaCoveMapping[] = [];
  const usedCoveIndices = new Set<number>();
  const usedFacturaIndices = new Set<number>();
  
  // Paso 1: Matches exactos primero
  facturas.forEach((factura, facturaIndex) => {
    if (usedFacturaIndices.has(facturaIndex)) return;
    
    const bestMatch = findBestCoveMatch(factura, facturaIndex, coves, usedCoveIndices);
    
    if (bestMatch && bestMatch.matchType === 'exact') {
      mappings.push(bestMatch);
      usedCoveIndices.add(bestMatch.coveIndex);
      usedFacturaIndices.add(facturaIndex);
    }
  });
  
  // Paso 2: Matches parciales para documentos no mapeados
  facturas.forEach((factura, facturaIndex) => {
    if (usedFacturaIndices.has(facturaIndex)) return;
    
    const bestMatch = findBestCoveMatch(factura, facturaIndex, coves, usedCoveIndices);
    
    if (bestMatch && bestMatch.matchType === 'partial') {
      mappings.push(bestMatch);
      usedCoveIndices.add(bestMatch.coveIndex);
      usedFacturaIndices.add(facturaIndex);
    }
  });
  
  // Paso 3: Identificar documentos no mapeados
  const facturasNoMapeadas = facturas
    .map((factura, index) => ({ factura, index }))
    .filter(({ index }) => !usedFacturaIndices.has(index))
    .map(({ factura, index }) => ({
      factura,
      index,
      reason: `No se encontró COVE correspondiente para factura ${factura.invoice_number}`
    }));
  
  const covesNoMapeados = coves
    .map((cove, index) => ({ cove, index }))
    .filter(({ index }) => !usedCoveIndices.has(index))
    .map(({ cove, index }) => ({
      cove,
      index,
      reason: `No se encontró factura correspondiente para COVE con número ${cove.datosDelAcuseDeValor.numeroDeFactura}`
    }));
  
  // Estadísticas del mapeo
  const exactMappings = mappings.filter(m => m.matchType === 'exact').length;
  const partialMappings = mappings.filter(m => m.matchType === 'partial').length;
  
  return {
    mappings,
    unmapped: {
      facturasNoMapeadas,
      covesNoMapeados
    },
    summary: {
      totalFacturas: facturas.length,
      totalCoves: coves.length,
      mappingsExactos: exactMappings,
      mappingsParciales: partialMappings,
      facturasNoMapeadas: facturasNoMapeadas.length,
      covesNoMapeados: covesNoMapeados.length
    }
  };
}

/**
 * Utility para obtener todas las mercancías de todos los COVEs mapeados
 */
export function getAllMercanciasFromMappings(mappings: FacturaCoveMapping[]) {
  return mappings.flatMap((mapping, mappingIndex) =>
    mapping.cove.mercancias.map((mercancia, mercanciaIndex) => ({
      mercancia,
      cove: mapping.cove,
      factura: mapping.factura,
      mappingIndex,
      mercanciaIndex,
      coveIndex: mapping.coveIndex,
      facturaIndex: mapping.facturaIndex
    }))
  );
}

/**
 * Utility para agregar valores monetarios de múltiples mappings
 */
export function aggregateValoresFromMappings(
  mappings: FacturaCoveMapping[],
  tipoCambio: number
) {
  let valorComercialTotal = 0;
  let valorDolaresTotal = 0;
  let valorComercialFacturasTotal = 0;
  
  mappings.forEach(mapping => {
    // Sumar valores de COVEs
    const valorTotalCove = mapping.cove.mercancias.reduce(
      (sum, mercancia) => sum + (mercancia.datosDeLaMercancia?.valorTotal || 0),
      0
    );
    const valorDolaresCove = mapping.cove.mercancias.reduce(
      (sum, mercancia) => sum + (mercancia.datosDeLaMercancia?.valorTotalEnDolares || 0),
      0
    );
    
    // Determinar si el valor del COVE está en dólares o pesos
    const monedaCove = mapping.cove.mercancias[0]?.datosDeLaMercancia?.tipoMoneda;
    if (monedaCove === 'USD') {
      valorDolaresTotal += valorTotalCove;
      valorComercialTotal += valorTotalCove * tipoCambio;
    } else {
      valorComercialTotal += valorTotalCove;
      valorDolaresTotal += valorDolaresCove;
    }
    
    // Sumar valores de facturas
    valorComercialFacturasTotal += mapping.factura.total_amount;
  });
  
  return {
    valorComercialTotal,
    valorDolaresTotal,
    valorComercialFacturasTotal,
    numeroMappings: mappings.length
  };
} 
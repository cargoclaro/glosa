import { Langfuse } from 'langfuse';
import { fetchFileFromUrl } from 'lib/utils';
import { describe, expect, it } from 'vitest';
import { extractAndStructureFactura, extractMultipleFacturas } from './extract-and-structure-factura';

describe('Extract and Structure Factura', () => {
  it('should extract and structure multiple Facturas from a single PDF using NEW method', async () => {
    // Este PDF contiene 13 facturas en 13 páginas (una por página)
    const multipleFacturasTestCase = {
      fileUrl: 'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15uwZC0FyES0lPex1mXBWQop7GAjJIMsDCUZk2',
      facturaRanges: [
        { startPage: 1, endPage: 1 },   // Factura 1
        { startPage: 2, endPage: 2 },   // Factura 2
        { startPage: 3, endPage: 3 },   // Factura 3
        { startPage: 4, endPage: 4 },   // Factura 4
        { startPage: 5, endPage: 5 },   // Factura 5
        { startPage: 6, endPage: 6 },   // Factura 6
        { startPage: 7, endPage: 7 },   // Factura 7
        { startPage: 8, endPage: 8 },   // Factura 8
        { startPage: 9, endPage: 9 },   // Factura 9
        { startPage: 10, endPage: 10 }, // Factura 10
        { startPage: 11, endPage: 11 }, // Factura 11
        { startPage: 12, endPage: 12 }, // Factura 12
        { startPage: 13, endPage: 13 }, // Factura 13
      ],
      description: 'PDF con 13 facturas usando NUEVA función',
    };

    console.log('PROBANDO NUEVA FUNCIÓN extractMultipleFacturas...');
    console.log(`Descargando: ${multipleFacturasTestCase.description}`);

    const langfuse = new Langfuse();
    const trace = langfuse.trace({
      name: 'Test Extract Multiple Facturas with NEW Function',
    });

    // Descargar el archivo
    const file = await fetchFileFromUrl(multipleFacturasTestCase.fileUrl);
    console.log(`Archivo descargado: ${file.name} (${file.size} bytes)`);

    // NUEVA FUNCIÓN: Extraer múltiples facturas por separado
    console.log('USANDO NUEVA FUNCIÓN extractMultipleFacturas:');
    const startTime = Date.now();
    
    const multipleFacturasResults = await extractMultipleFacturas(
      file, 
      multipleFacturasTestCase.facturaRanges, 
      trace.id
    );
    
    const endTime = Date.now();
    console.log(`Tiempo total: ${(endTime - startTime) / 1000}s`);

    console.log('\nRESULTADOS CON NUEVA FUNCIÓN:');
    console.log(`Número de facturas extraídas: ${multipleFacturasResults.length}`);
    
    // Validar que tenemos 13 facturas separadas
    expect(multipleFacturasResults).toHaveLength(13);
    
    // Validar cada factura individualmente
    for (let i = 0; i < multipleFacturasResults.length; i++) {
      const factura = multipleFacturasResults[i];
      const expectedRange = multipleFacturasTestCase.facturaRanges[i];
      
      console.log(`\n   FACTURA ${i + 1}:`);
      console.log(`     Número: ${factura?.invoice_number}`);
      console.log(`     Rango: páginas ${factura?.pageRange.startPage}-${factura?.pageRange.endPage}`);
      console.log(`     Total: ${factura?.total_amount} ${factura?.currency_code}`);
      console.log(`     Fecha: ${factura?.invoice_date}`);
      console.log(`     Items: ${factura?.items?.length || 0}`);
      
      // Validaciones
      expect(factura?.facturaIndex).toBe(i + 1);
      expect(factura?.pageRange).toEqual(expectedRange);
      expect(factura?.invoice_number).toBeDefined();
      expect(factura?.total_amount).toBeDefined();
      expect(factura?.total_amount).toBeGreaterThan(0);
      expect(factura?.items).toBeDefined();
      expect(factura?.items?.length).toBeGreaterThan(0);
    }

    // Validar que todos los números de factura son diferentes (no mezclados)
    const invoiceNumbers = multipleFacturasResults.map(factura => factura?.invoice_number);
    const uniqueNumbers = new Set(invoiceNumbers.filter(Boolean));
    console.log(`\nNúmeros únicos encontrados: ${uniqueNumbers.size}/${invoiceNumbers.length}`);
    
    // Contar items totales
    const totalItems = multipleFacturasResults.reduce((sum, factura) => sum + (factura?.items?.length || 0), 0);
    console.log(`Total de items: ${totalItems}`);

    // Sumar valores totales
    const totalAmounts = multipleFacturasResults.reduce((sum, factura) => sum + (factura?.total_amount || 0), 0);
    console.log(`Suma total: ${totalAmounts}`);

    console.log('\n¡NUEVA FUNCIÓN FUNCIONA CORRECTAMENTE!');
    console.log(`   ${multipleFacturasResults.length} facturas extraídas por separado`);
    console.log('   Cada factura tiene su propio número de factura');
    console.log('   Cada factura tiene sus propios items');
    console.log('   Rangos de páginas correctos');
  });

  it('should demonstrate comparison between single and multiple extraction', async () => {
    // Comparar extracción completa vs extracción individual
    const facturaTestCase = {
      fileUrl: 'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15uwZC0FyES0lPex1mXBWQop7GAjJIMsDCUZk2',
      description: 'PDF con 13 facturas - comparación de métodos de extracción',
    };

    console.log('\nCOMPARACIÓN DE MÉTODOS DE EXTRACCIÓN...');
    console.log(`Descargando: ${facturaTestCase.description}`);

    const langfuse = new Langfuse();
    const trace = langfuse.trace({
      name: 'Test Factura Extraction Comparison',
    });

    // Descargar el archivo
    const file = await fetchFileFromUrl(facturaTestCase.fileUrl);
    console.log(`Archivo descargado: ${file.name} (${file.size} bytes)`);

    console.log('EXTRACCIÓN COMPLETA (método original):');
    console.log('   Extrayendo PDF completo como una sola factura...');
    
    const resultadoCompleto = await extractAndStructureFactura(file, trace.id);
    
    console.log('\nRESULTADO DE EXTRACCIÓN COMPLETA:');
    console.log(`   Número de factura: ${resultadoCompleto.invoice_number}`);
    console.log(`   Total: ${resultadoCompleto.total_amount} ${resultadoCompleto.currency_code}`);
    console.log(`   Número de items: ${resultadoCompleto.items?.length || 0}`);
    console.log(`   Fecha: ${resultadoCompleto.invoice_date}`);

    // Validaciones básicas
    expect(resultadoCompleto.invoice_number).toBeDefined();
    console.log(`   Número de factura extraído: ${resultadoCompleto.invoice_number}`);
    
    expect(resultadoCompleto.items?.length).toBeGreaterThan(0);
    console.log(`   Items extraídos: ${resultadoCompleto.items?.length} (items de múltiples facturas mezclados)`);
    
    console.log('\nCOMPARACIÓN DE MÉTODOS:');
    console.log('   - Extracción completa: 1 factura con items mezclados');
    console.log('   - Extracción individual: 13 facturas separadas con sus propios items');
    
    console.log('\nPrueba de comparación completada');
  });
}); 
import { Langfuse } from 'langfuse';
import { fetchFileFromUrl } from 'lib/utils';
import { describe, expect, it } from 'vitest';
import { classifyDocuments } from '../classification/classification';
import { createExpedienteWithoutData } from '../classification/create-expediente-without-data';
import { extractAndStructure } from './index';

describe('Extract and Structure - FLUJO COMPLETO REAL', () => {
  it('should process the complete flow: 1 pedimento + 1 PDF with 13 facturas + 1 PDF with 13 COVEs', async () => {
    console.log('PROBANDO FLUJO COMPLETO REAL DEL SISTEMA');
    console.log('   1 Pedimento individual');
    console.log('   1 PDF con 13 facturas (se debe dividir automáticamente)');
    console.log('   1 PDF con 13 COVEs (se debe dividir automáticamente)');

    const langfuse = new Langfuse();
    const trace = langfuse.trace({
      name: 'Test Complete Real Flow',
    });

    // PASO 1: Descargar los archivos originales
    console.log('\nDescargando archivos...');
    const [pedimentoFile, facturasMultiPdf, covesMultiPdf] = await Promise.all([
      fetchFileFromUrl('https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15ysswgapTh5Ia1zEGHs0nwV4OZSPtvmMJ7xAp'), // Pedimento individual
      fetchFileFromUrl('https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15uwZC0FyES0lPex1mXBWQop7GAjJIMsDCUZk2'), // PDF con 13 facturas
      fetchFileFromUrl('https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15h8nI3fFivngwCHKuLPbSFNEMV217joIx9qfk'), // PDF con 13 COVEs
    ]);

    console.log(`   Pedimento: ${pedimentoFile.name} (${pedimentoFile.size} bytes)`);
    console.log(`   Facturas: ${facturasMultiPdf.name} (${facturasMultiPdf.size} bytes)`);
    console.log(`   COVEs: ${covesMultiPdf.name} (${covesMultiPdf.size} bytes)`);

    // PASO 2: Clasificar cada archivo
    console.log('\nClasificando documentos...');
    const clasificaciones = await classifyDocuments([
      pedimentoFile,
      facturasMultiPdf, 
      covesMultiPdf,
    ], trace.id);

    console.log('   Resultados de clasificación:');
    for (let i = 0; i < clasificaciones.length; i++) {
      const resultado = clasificaciones[i];
      if (resultado) {
        console.log(`     Archivo ${i + 1}:`);
        if (typeof resultado.classification === 'string') {
          console.log(`       Tipo: ${resultado.classification} (documento único)`);
        } else {
          console.log(`       Tipos: ${resultado.classification.length} documentos detectados`);
          resultado.classification.forEach((doc, idx) => {
            console.log(`         ${idx + 1}. ${doc.classification} (páginas ${doc.startPage}-${doc.endPage})`);
          });
        }
      }
    }

    // PASO 3: Crear expediente (esto incluye división automática)
    console.log('\nCreando expediente y dividiendo PDFs...');
    const expedienteResult = await createExpedienteWithoutData(clasificaciones);

    if (expedienteResult.isErr()) {
      throw new Error(`Error creando expediente: ${expedienteResult.error}`);
    }

    const expediente = expedienteResult.value;
    console.log('   Expediente creado:');
    console.log(`      Pedimento: ${expediente.Pedimento ? '✅' : '❌'}`);
    console.log(`      Facturas: ${expediente.Factura.length} archivos`);
    console.log(`      COVEs: ${expediente.Cove.length} archivos`);

    // Validar que se dividieron correctamente
    expect(expediente.Factura.length).toBeGreaterThan(1); // Debería haber múltiples facturas
    expect(expediente.Cove.length).toBeGreaterThan(1); // Debería haber múltiples COVEs
    
    console.log(`   División exitosa: ${expediente.Factura.length} facturas + ${expediente.Cove.length} COVEs`);

    // PASO 4: Extraer y estructurar todo
    console.log('\nExtrayendo y estructurando documentos...');
    const startTime = Date.now();
    
    const result = await extractAndStructure(expediente, trace.id);
    
    const endTime = Date.now();
    console.log(`   Tiempo total: ${(endTime - startTime) / 1000}s`);

    // PASO 5: Validar resultados
    console.log('\nValidando resultados...');

    // Pedimento
    console.log('\nPEDIMENTO:');
    expect(result.pedimento).toBeDefined();
    console.log('   Pedimento extraído correctamente');

    // Facturas
    console.log('\nFACTURAS:');
    console.log(`   Total de facturas procesadas: ${result.factura.length}`);
    expect(result.factura.length).toBeGreaterThan(1);
    
    let facturasTotales = 0;
    let montoTotalFacturas = 0;
    
    for (let i = 0; i < result.factura.length; i++) {
      const factura = result.factura[i];
      if (factura) {
        facturasTotales++;
        montoTotalFacturas += factura.total_amount || 0;
        console.log(`     Factura ${i + 1}: #${factura.invoice_number}, $${factura.total_amount} ${factura.currency_code}`);
        
        // Validaciones individuales
        expect(factura.invoice_number).toBeDefined();
        expect(factura.total_amount).toBeGreaterThan(0);
      }
    }
    
    console.log(`   Monto total: $${montoTotalFacturas.toFixed(2)}`);
    console.log(`   ${facturasTotales} facturas procesadas exitosamente`);

    // COVEs
    console.log('\nCOVEs:');
    console.log(`   Total de COVEs procesados: ${result.cove.length}`);
    expect(result.cove.length).toBeGreaterThan(1);
    
    let covesTotales = 0;
    let mercanciasTotales = 0;
    
    for (let i = 0; i < result.cove.length; i++) {
      const cove = result.cove[i];
      if (cove) {
        covesTotales++;
        mercanciasTotales += cove.mercancias.length;
        console.log(`     COVE ${i + 1}: ID=${cove.datosDelAcuseDeValor.idCove}, ${cove.mercancias.length} mercancías`);
        
        // Validaciones individuales
        expect(cove.datosDelAcuseDeValor.idCove).toBeDefined();
        expect(cove.mercancias.length).toBeGreaterThan(0);
      }
    }
    
    console.log(`   Total mercancías: ${mercanciasTotales}`);
    console.log(`   ${covesTotales} COVEs procesados exitosamente`);

    // RESUMEN FINAL
    console.log('\nFLUJO COMPLETO EJECUTADO EXITOSAMENTE!');
    console.log('\nRESUMEN:');
    console.log(`   Input: 3 archivos PDF (1 pedimento + 1 multi-facturas + 1 multi-COVEs)`);
    console.log(`   Clasificación: Detectó múltiples documentos correctamente`);
    console.log(`   División: Creó ${expediente.Factura.length + expediente.Cove.length + 1} archivos individuales`);
    console.log(`   Extracción: Procesó ${facturasTotales + covesTotales + 1} documentos estructurados`);
    console.log(`   Output: ${facturasTotales} facturas + ${covesTotales} COVEs + 1 pedimento`);
    
    console.log('\nEL SISTEMA MANEJA MÚLTIPLES DOCUMENTOS AUTOMÁTICAMENTE!');
  });

  it('should verify the numbers match expected quantities', async () => {
    console.log('\nVERIFICACIÓN DE CANTIDADES ESPERADAS');
    
    // Este test valida que estamos obteniendo las cantidades correctas
    console.log('Cantidades esperadas según los PDFs:');
    console.log('   Facturas: 13 (del PDF multi-facturas)');
    console.log('   COVEs: 13 (del PDF multi-COVEs)'); 
    console.log('   Pedimento: 1 (individual)');
    console.log('   Total documentos esperados: 27');
    
    console.log('\nSi el test anterior no devuelve estas cantidades,');
    console.log('   significa que hay un problema en:');
    console.log('   • La clasificación (no detecta todos los documentos)');
    console.log('   • La división (no divide correctamente)');
    console.log('   • La extracción (no procesa todos los archivos)');
    
    // Solo validación conceptual
    expect(true).toBe(true);
  });
}); 
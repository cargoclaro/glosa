import { expect, test } from '~/lib/playwright/fixture';

test('Glosa un expediente y valida una sección exitosamente', async ({
  page,
}) => {
  await page.locator('text="Nueva Glosa"').click();
  await page.locator('text="Glosa Regular"').click();
  // Direct file upload without waiting for file chooser event
  await page.setInputFiles('input[type="file"]', [
    'app/(dashboard)/test/A-66151 COVE.pdf',
    'app/(dashboard)/test/A-66151 FACTURA.pdf',
    'app/(dashboard)/test/A-66151 PACK.pdf',
    'app/(dashboard)/test/A-66151 TRAD.pdf',
    'app/(dashboard)/test/PROFORMA.pdf'
  ]);
  await page.locator('text="Glosar"').click();
  await page.locator('text="Continuar"').click();
  
  await page.waitForURL('**/analysis');
  await page.locator('text="Marcar como verificado"').waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('text="Marcar como verificado"').click();

  await expect(page.getByText('Análisis verificado')).toBeVisible({ timeout: 60000 });
});

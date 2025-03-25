import { expect, test } from '~/lib/playwright/fixture';

test('Glosa un expediente y valida una sección exitosamente', async ({
  page,
}) => {
  await page.locator('text="Nueva Glosa"').click();
  await page.locator('text="Glosa Regular"').click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('input[type="file"]').click(),
  ]);
  await fileChooser.setFiles([
    'A-66151 COVE.pdf',
    'A-66151 FACTURA.pdf',
    'A-66151 PACK.pdf',
    'A-66151 TRAD.pdf',
    'PROFORMA.pdf'
  ]);
  await page.locator('text="Glosar"').click();
  await page.locator('text="Continuar"').click();

  await page.waitForNavigation({ waitUntil: 'networkidle' });
  await page.locator('text="Marcar como verificado"').click();

  await expect(page).toHaveText('Análisis verificado');
});

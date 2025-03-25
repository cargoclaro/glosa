import { expect, test } from '~/lib/playwright/fixture';

test('Glosa un expediente y valida una sección exitosamente', async ({
  page,
}) => {
  await page.getByText('Nueva Glosa').click();
  await page.getByText('Glosa Regular').click();
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
  await page.getByText('Glosar').click();
  await page.getByText('Continuar').click();

  await page.waitForNavigation({ waitUntil: 'networkidle' });
  await page.getByText('Marcar como verificado').click();

  await expect(page).toHaveText('Análisis verificado');
});

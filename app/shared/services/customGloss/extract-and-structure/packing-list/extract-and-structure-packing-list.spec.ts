import { describe, expect, it } from 'vitest';
import {
  extractAndStructurePackingList,
} from './extract-and-structure-packing-list';

describe('Extract and Structure Packing List', () => {
  it('should correctly extract and structure packing lists', async () => {
    const packingListFixture = [
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15P5NLJRxkozZNG45DnM3Oy1CRlXrVAEjFKYBm',
        expectedOutput: {
          mercancias: [
            {
              cantidad: 1,
            },
          ],
          pesoBruto: {
            valor: 1650,
            unidadDeMedida: 'lb',
          },
        },
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y150DvPWbozluNwmWerUvXsTP7dntpA69DgMq1C',
        expectedOutput: {
          mercancias: [
            {
              cantidad: 1204,
            },
          ],
          pesoBruto: {
            valor: 1383.48,
            unidadDeMedida: 'kg',
          },
        },
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15YZPve7HjXIrsoaGCginAhSTQkP245ld9H0yU',
        expectedOutput: {
          mercancias: [
            {
              cantidad: 6160,
            },
            {
              cantidad: 87,
            },
            {
              cantidad: 240,
            },
          ],
          pesoBruto: {
            valor: 34514,
            unidadDeMedida: 'lb',
          },
        },
      },
    ] as const;
    const packingListResults = await Promise.all(
      packingListFixture.map(async ({ fileUrl }) => {
        const packingListResult = await extractAndStructurePackingList(fileUrl);
        return { packingListResult, fileUrl };
      })
    );

    for (const { packingListResult, fileUrl } of packingListResults) {
      // Find the expected output for the current fileUrl
      const fixture = packingListFixture.find(
        (item) => item.fileUrl === fileUrl
      );
      expect
        .soft(
          packingListResult,
          `Result data should match expected output for: ${fileUrl}`
        )
        .toEqual(fixture?.expectedOutput);
    }
  });
});

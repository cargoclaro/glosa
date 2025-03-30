import { describe, expect, it } from 'vitest';
import { extractAndStructurePackingList } from './extract-and-structure';
import packingListFixture from './fixtures/packing-list.json';

describe('Extract and Structure doesn\'t fail at runtime', () => {
  it('should correctly extract and structure documents', async () => {
    const packingListResults = await Promise.all(
      packingListFixture.map(async ({ fileUrl }) => {
        const packingListResult = await extractAndStructurePackingList(fileUrl);
        return { packingListResult, fileUrl };
      })
    );

    for (const { packingListResult, fileUrl } of packingListResults) {
      expect.soft(packingListResult, `Mismatch in packing list: ${fileUrl}`).toEqual(packingListResult);
    }
  });
});

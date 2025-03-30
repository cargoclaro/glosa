import { describe, expect, it } from 'vitest';
import { extractAndStructurePackingList } from './extract-and-structure';
import packingListFixture from './fixtures/packing-list.json';

describe.concurrent('Extract and Structure', () => {
  it('should correctly extract and structure packing lists', async () => {
    const packingListResults = await Promise.all(
      packingListFixture.map(async ({ fileUrl }) => {
        const packingListResult = await extractAndStructurePackingList(fileUrl);
        return { packingListResult, fileUrl };
      })
    );

    for (const { packingListResult, fileUrl } of packingListResults) {
      expect.soft(packingListResult.isOk(), `Result should be Ok for: ${fileUrl}`).toBe(true);
      
      if (packingListResult.isOk()) {
        const data = packingListResult.value;
        expect.soft(data, `Result data should be defined for: ${fileUrl}`).toBeDefined();
      }
    }
  });
});

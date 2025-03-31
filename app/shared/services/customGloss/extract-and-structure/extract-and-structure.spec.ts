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
      // Find the expected output for the current fileUrl
      const fixture = packingListFixture.find(item => item.fileUrl === fileUrl);
      expect.soft(packingListResult, `Result data should match expected output for: ${fileUrl}`)
        .toEqual(fixture?.expectedOutput);
    }
  });
});

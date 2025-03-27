import { describe, it, expect } from 'vitest';
import { classifyDocuments } from './classification';
import type { DocumentType } from './classification';
import { expectToBeDefined } from '~/lib/utils';

describe('Classification', () => {
  it('should correctly classify a regular "expediente"', async () => {
    interface TestFile {
      ufsUrl: string;
      expectedDocumentType: DocumentType;
    }
    const testFiles: TestFile[] = [
      {
        ufsUrl: 'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15u1EQuvyES0lPex1mXBWQop7GAjJIMsDCUZk2',
        expectedDocumentType: 'cove'
      },
      {
        ufsUrl: 'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15KDcF7h24cxAwqMmpsYVRUeW6jkbtTlr5Qf7D',
        expectedDocumentType: 'factura'
      },
      {
        ufsUrl: 'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15P5NLJRxkozZNG45DnM3Oy1CRlXrVAEjFKYBm',
        expectedDocumentType: 'listaDeEmpaque'
      },
      {
        ufsUrl: 'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15AF3N1bVEhI73SMs1mOVHTgc05pWuYPnbZRty',
        expectedDocumentType: 'documentoDeTransporte'
      },
      {
        ufsUrl: 'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zV3W89SgutyXdVR43qhBYaSHWfrT9MLbDjkN',
        expectedDocumentType: 'pedimento'
      }
    ];

    const classifiedFiles = await classifyDocuments(testFiles.map(testFile => ({
      ufsUrl: testFile.ufsUrl
    })));

    for (const testFile of testFiles) {
      const classifiedFile = classifiedFiles.find(classifiedFile => classifiedFile.ufsUrl === testFile.ufsUrl);
      expectToBeDefined(classifiedFile);
      expect(classifiedFile.documentType).toBe(testFile.expectedDocumentType);
    }
  });
});
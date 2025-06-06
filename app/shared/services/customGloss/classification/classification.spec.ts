import { Langfuse } from 'langfuse';
import { describe, expect, it } from 'vitest';
import { fetchFileFromUrl } from '~/lib/utils';
import { expectToBeDefined } from '~/lib/vitest/utils';
import { classifyDocuments } from './classification';

describe('Classification', () => {
  const langfuse = new Langfuse();

  const trace = langfuse.trace({
    name: 'Test Classification',
  });

  it('should correctly classify single document files', async () => {
    const singleDocumentTestCases = [
      {
        classification: 'Carta Regla 3.1.8',
        fileUrls: [
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Vk6xFysC0QwoBJsWz9AMZTXgeVDlIUcOYFa4',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15d4sdeUMah63MQ4ULAyrOudGFkmN5TBsKeVRl',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153KY9n8BhnLpbl6it5NaGkD4BTRJsU8jFoO2K',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15sRQlbKdGH6Y152uanyQckEJU0xmhI7Ml9WbA',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153eCpVzBhnLpbl6it5NaGkD4BTRJsU8jFoO2K',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15AF3N1bVEhI73SMs1mOVHTgc05pWuYPnbZRty',
        ],
      },
      {
        classification: 'Cove',
        fileUrls: [
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15u1EQuvyES0lPex1mXBWQop7GAjJIMsDCUZk2',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15XadhI2Q3p02PnBlWqwL7baCzMhxf4mHoEDc9',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15HyVqAoWCjnmTGoQ3c9SyIxeudvRq4iEBXMF7',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Fn3r61gpw0UmYxiesJuoAgDqlBLkHvzhTSZ3',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15IDryccR2Okng1Id8jPzMFLQmSoW4e9tbTJcr',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zkxGeSgutyXdVR43qhBYaSHWfrT9MLbDjkNA',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15MgmsGr907FYSfgKGA9JUX3rIQ2amz4bTDeNj',
        ],
      },
      {
        classification: 'Factura',
        fileUrls: [
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15KDcF7h24cxAwqMmpsYVRUeW6jkbtTlr5Qf7D',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15P7iu6tIxkozZNG45DnM3Oy1CRlXrVAEjFKYB',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15hNsoakFivngwCHKuLPbSFNEMV217joIx9qfk',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15R98CiWjBNb7QDtefE4Jkcj0LXAp19KrPC5ny',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15WePKBq3wjBm5PIGkCivebVrsyDL3Mfap4oEZ',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y154oMDbcAZyVxPdXUvHtS0WcsbRhYGfge7EjTp',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15KgUEE124cxAwqMmpsYVRUeW6jkbtTlr5Qf7D',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15aYazRw0RiU9Wd36XkuP4qMsp7xZS2nIEhTNz',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15OgKYdGq3sqVEtiorhnZIFDfCcbMey8HJpjTU',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15dhOithMah63MQ4ULAyrOudGFkmN5TBsKeVRl',
        ],
      },
      {
        classification: 'Packing List',
        fileUrls: [
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15P5NLJRxkozZNG45DnM3Oy1CRlXrVAEjFKYBm',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Qv9MjZmP3ThsNJt5xqeOK1fAPnj4uVgcvWRl',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15YZPve7HjXIrsoaGCginAhSTQkP245ld9H0yU',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y150DvPWbozluNwmWerUvXsTP7dntpA69DgMq1C',
        ],
      },
      {
        classification: 'Bill of Lading',
        fileUrls: [
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Y6qUlCHjXIrsoaGCginAhSTQkP245ld9H0yU',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15jnqfKkXiXu6oPELDcp4qty5SYJUsk1xhTNwm',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y154kOCZmAZyVxPdXUvHtS0WcsbRhYGfge7EjTp',
        ],
      },
      {
        classification: 'Air Waybill',
        fileUrls: [
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15bEYET5z4sCMTwv8SiueyUEh9X7BFO4rKQIp5',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y156xhtNS1lBozqeKEFZX0D348m9hsYyRkctGC5',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Vhu1uUsC0QwoBJsWz9AMZTXgeVDlIUcOYFa4',
        ],
      },
      {
        classification: 'Pedimento',
        fileUrls: [
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zV3W89SgutyXdVR43qhBYaSHWfrT9MLbDjkN',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15RC2dzWjBNb7QDtefE4Jkcj0LXAp19KrPC5ny',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15sZosE3GH6Y152uanyQckEJU0xmhI7Ml9WbAj',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y1505BkNhozluNwmWerUvXsTP7dntpA69DgMq1C',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15zM2uZQrSgutyXdVR43qhBYaSHWfrT9MLbDjk',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15cIQMudVcvCh6jLY2TW18xoSftlQJw0FzIEAK',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15mWGiMerE2uXJiL0QAGTzsqlyf96tYwco47Dn',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15atV3D30RiU9Wd36XkuP4qMsp7xZS2nIEhTNz',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15JOd9KTh6zLoABGKujt2Tp51WEDQH0FRheI6S',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15xPXHg7vVzZoT1kgBtS2DfJw4AMx5qLjKYOWG',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15XFI4wFQ3p02PnBlWqwL7baCzMhxf4mHoEDc9',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y151oxYkBOdKsYBGW4XISFeRC5wmafh0qJ89ktM',
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15YWstnNHjXIrsoaGCginAhSTQkP245ld9H0yU',
        ],
      },
    ] as const;

    // Create a flat array of all file URLs
    const allFiles = singleDocumentTestCases.flatMap(
      ({ classification, fileUrls }) =>
        fileUrls.map((ufsUrl) => ({
          ufsUrl,
          expectedClassification: classification,
        }))
    );

    // Fetch all files first
    const fetchedFiles = await Promise.all(
      allFiles.map(async ({ ufsUrl, expectedClassification }) => {
        const file = await fetchFileFromUrl(ufsUrl);
        return {
          file,
          ufsUrl,
          expectedClassification,
        };
      })
    );

    // Classify all files at once
    const classifiedFiles = await classifyDocuments(
      fetchedFiles.map(({ file }) => file),
      trace.id
    );

    expect(classifiedFiles).toHaveLength(allFiles.length);

    // Create a mapping from file name to expected document type
    const filenameToExpectedTypeMap = new Map(
      fetchedFiles.map((item) => [item.file.name, item.expectedClassification])
    );

    // Check if each file was correctly classified
    for (const classifiedFile of classifiedFiles) {
      const expectedType = filenameToExpectedTypeMap.get(
        classifiedFile.file.name
      );
      expectToBeDefined(expectedType);
      expect
        .soft(
          classifiedFile.classification,
          `Classification for ${classifiedFile.file.name}`
        )
        .toStrictEqual(expectedType);
    }
  });

  it('should correctly classify multiple document files', async () => {
    const multipleDocumentsTestCases = [
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15U6jQv754gXutEPfbM3xZokBl6wDHdjnC8LAK',
        classification: [
          {
            classification: 'Packing List',
            startPage: 1,
            endPage: 1,
          },
          {
            classification: 'Delivery Ticket',
            startPage: 2,
            endPage: 3,
          },
          {
            classification: 'Shipper',
            startPage: 4,
            endPage: 4,
          },
          {
            classification: 'Shipper',
            startPage: 5,
            endPage: 5,
          },
          {
            classification: 'Shipper',
            startPage: 6,
            endPage: 6,
          },
        ],
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15JwHxSp6zLoABGKujt2Tp51WEDQH0FRheI6Sn',
        classification: [
          {
            classification: 'Packing List',
            startPage: 1,
            endPage: 1,
          },
          {
            classification: 'Packing Slip',
            startPage: 2,
            endPage: 2,
          },
          {
            classification: 'Packing Slip',
            startPage: 3,
            endPage: 3,
          },
          {
            classification: 'Packing List',
            startPage: 4,
            endPage: 4,
          },
        ],
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153mEQatBhnLpbl6it5NaGkD4BTRJsU8jFoO2K',
        classification: [
          {
            classification: 'Carta Regla 3.1.8',
            startPage: 1,
            endPage: 1,
          },
          {
            classification: 'Carta Regla 3.1.8',
            startPage: 2,
            endPage: 2,
          },
          {
            classification: 'Carta Regla 3.1.8',
            startPage: 3,
            endPage: 3,
          },
          {
            classification: 'Carta Regla 3.1.8',
            startPage: 4,
            endPage: 5,
          },
        ],
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15M1vUn907FYSfgKGA9JUX3rIQ2amz4bTDeNjd',
        classification: [
          {
            classification: 'Factura',
            startPage: 1,
            endPage: 1,
          },
          {
            classification: 'Factura',
            startPage: 2,
            endPage: 2,
          },
          {
            classification: 'Factura',
            startPage: 3,
            endPage: 3,
          },
          {
            classification: 'Factura',
            startPage: 4,
            endPage: 4,
          },
        ],
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15DY8emWvXf1H4BGpPhqDTbi9LIkRoZlxA503e',
        classification: [
          {
            classification: 'Factura',
            startPage: 1,
            endPage: 1,
          },
          {
            classification: 'Factura',
            startPage: 2,
            endPage: 2,
          },
          {
            classification: 'Factura',
            startPage: 3,
            endPage: 3,
          },
          {
            classification: 'Factura',
            startPage: 4,
            endPage: 4,
          },
        ],
      },
      {
        fileUrl:
          'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15AVS8DnEhI73SMs1mOVHTgc05pWuYPnbZRtyq',
        classification: [
          {
            classification: 'Cove',
            startPage: 1,
            endPage: 2,
          },
          {
            classification: 'Cove',
            startPage: 3,
            endPage: 5,
          },
          {
            classification: 'Cove',
            startPage: 6,
            endPage: 7,
          },
          {
            classification: 'Cove',
            startPage: 8,
            endPage: 9,
          },
        ],
      },
    ] as const;

    const allUfsUrls = multipleDocumentsTestCases.map(({ fileUrl }) => fileUrl);

    // Fetch all files first
    const fetchedFiles = await Promise.all(
      allUfsUrls.map(async (ufsUrl) => {
        const file = await fetchFileFromUrl(ufsUrl);
        return { file, ufsUrl };
      })
    );

    // Classify all files at once
    const classifiedFiles = await classifyDocuments(
      fetchedFiles.map(({ file }) => file),
      trace.id
    );

    expect(classifiedFiles).toHaveLength(allUfsUrls.length);

    // Create a mapping from file name to expected document type
    const filenameToExpectedTypeMap = new Map(
      fetchedFiles.map((item) => [
        item.file.name,
        multipleDocumentsTestCases.find(
          (testCase) => testCase.fileUrl === item.ufsUrl
        )?.classification,
      ])
    );

    // Check if each file was correctly classified
    for (const classifiedFile of classifiedFiles) {
      const expectedType = filenameToExpectedTypeMap.get(
        classifiedFile.file.name
      );
      expectToBeDefined(expectedType);
      expect
        .soft(
          classifiedFile.classification,
          `Classification for ${classifiedFile.file.name}`
        )
        .toStrictEqual(expectedType);
    }
  });
});

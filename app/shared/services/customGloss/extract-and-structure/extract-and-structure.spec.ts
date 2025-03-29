import { describe, expect, it } from 'vitest';
import { extractAndStructureCartasRegla318, extractAndStructureFacturas, extractAndStructurePackingList, extractAndStructureBillOfLading, extractAndStructureAirWaybill, extractAndStructureCoves, extractAndStructurePedimento } from './extract-and-structure';

describe('Extract and Structure doesn\'t fail at runtime', () => {
  const testCases = {
    'Carta Regla 3.1.8': {
      fileUrls: [
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Vk6xFysC0QwoBJsWz9AMZTXgeVDlIUcOYFa4',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15d4sdeUMah63MQ4ULAyrOudGFkmN5TBsKeVRl',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153mEQatBhnLpbl6it5NaGkD4BTRJsU8jFoO2K',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153KY9n8BhnLpbl6it5NaGkD4BTRJsU8jFoO2K',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15sRQlbKdGH6Y152uanyQckEJU0xmhI7Ml9WbA',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y153eCpVzBhnLpbl6it5NaGkD4BTRJsU8jFoO2K',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15VInFhpNsC0QwoBJsWz9AMZTXgeVDlIUcOYFa',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15AF3N1bVEhI73SMs1mOVHTgc05pWuYPnbZRty',
      ],
    },
    'Factura': {
      fileUrls: [
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15KDcF7h24cxAwqMmpsYVRUeW6jkbtTlr5Qf7D',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15M1vUn907FYSfgKGA9JUX3rIQ2amz4bTDeNjd',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15P7iu6tIxkozZNG45DnM3Oy1CRlXrVAEjFKYB',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15hNsoakFivngwCHKuLPbSFNEMV217joIx9qfk',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15R98CiWjBNb7QDtefE4Jkcj0LXAp19KrPC5ny',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15WePKBq3wjBm5PIGkCivebVrsyDL3Mfap4oEZ',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15DY8emWvXf1H4BGpPhqDTbi9LIkRoZlxA503e',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y154oMDbcAZyVxPdXUvHtS0WcsbRhYGfge7EjTp',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15KgUEE124cxAwqMmpsYVRUeW6jkbtTlr5Qf7D',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15aYazRw0RiU9Wd36XkuP4qMsp7xZS2nIEhTNz',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15OgKYdGq3sqVEtiorhnZIFDfCcbMey8HJpjTU',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15dL2OcXaMah63MQ4ULAyrOudGFkmN5TBsKeVR',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15dhOithMah63MQ4ULAyrOudGFkmN5TBsKeVRl',
      ],
    },
    'Packing List': {
      fileUrls: [
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15P5NLJRxkozZNG45DnM3Oy1CRlXrVAEjFKYBm',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Qv9MjZmP3ThsNJt5xqeOK1fAPnj4uVgcvWRl',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15YZPve7HjXIrsoaGCginAhSTQkP245ld9H0yU',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y150DvPWbozluNwmWerUvXsTP7dntpA69DgMq1C',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15JwHxSp6zLoABGKujt2Tp51WEDQH0FRheI6Sn',
      ],
    },
    'Bill of Lading': {
      fileUrls: [
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Y6qUlCHjXIrsoaGCginAhSTQkP245ld9H0yU',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15jnqfKkXiXu6oPELDcp4qty5SYJUsk1xhTNwm',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y154kOCZmAZyVxPdXUvHtS0WcsbRhYGfge7EjTp',
      ],
    },
    'Air Waybill': {
      fileUrls: [
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15bEYET5z4sCMTwv8SiueyUEh9X7BFO4rKQIp5',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y156xhtNS1lBozqeKEFZX0D348m9hsYyRkctGC5',
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15Vhu1uUsC0QwoBJsWz9AMZTXgeVDlIUcOYFa4',
      ],
    },
    'Cove': {
      fileUrls: [
        'https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15u1EQuvyES0lPex1mXBWQop7GAjJIMsDCUZk2',
      ],
    },
    'Pedimento': {
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
    }
  };

  it('should correctly extract and structure documents', async () => {
    // Create promises for all document types to process in parallel
    const promises = [
      // Process Pedimento documents
      (async () => {
        const pedimentoTestCase = testCases['Pedimento'];
        const pedimentoPromises = pedimentoTestCase.fileUrls.map(fileUrl => 
          extractAndStructurePedimento(fileUrl).then(result => {
            expect.soft(result).toBeDefined();
            expect.soft('error' in result, `Error in pedimento: ${fileUrl}`).toBe(false);
            return result;
          })
        );
        return Promise.all(pedimentoPromises);
      })(),

      // Process Factura documents
      (async () => {
        const facturaTestCase = testCases['Factura'];
        const facturaResults = await extractAndStructureFacturas(facturaTestCase.fileUrls);
        expect.soft(facturaResults).toBeDefined();
        for (const result of facturaResults) {
          expect.soft('error' in result, `Error in factura: ${result}`).toBe(false);
        }
        return facturaResults;
      })(),
      
      // Process Packing List documents
      (async () => {
        const packingListTestCase = testCases['Packing List'];
        const packingListPromises = packingListTestCase.fileUrls.map(fileUrl => 
          extractAndStructurePackingList(fileUrl).then(result => {
            expect.soft(result).toBeDefined();
            expect.soft('error' in result, `Error in packing list: ${fileUrl}`).toBe(false);
            return result;
          })
        );
        return Promise.all(packingListPromises);
      })(),
      
      // Process Bill of Lading documents
      (async () => {
        const billOfLadingTestCase = testCases['Bill of Lading'];
        const billOfLadingPromises = billOfLadingTestCase.fileUrls.map(fileUrl => 
          extractAndStructureBillOfLading(fileUrl).then(result => {
            expect.soft(result).toBeDefined();
            expect.soft('error' in result, `Error in bill of lading: ${fileUrl}`).toBe(false);
            return result;
          })
        );
        return Promise.all(billOfLadingPromises);
      })(),
      
      // Process Air Waybill documents
      (async () => {
        const airWaybillTestCase = testCases['Air Waybill'];
        const airWaybillPromises = airWaybillTestCase.fileUrls.map(fileUrl => 
          extractAndStructureAirWaybill(fileUrl).then(result => {
            expect.soft(result).toBeDefined();
            expect.soft('error' in result, `Error in air waybill: ${fileUrl}`).toBe(false);
            return result;
          })
        );
        return Promise.all(airWaybillPromises);
      })(),
      
      // Process Cove documents
      (async () => {
        const coveTestCase = testCases['Cove'];
        const coveResults = await extractAndStructureCoves(coveTestCase.fileUrls);
        expect.soft(coveResults).toBeDefined();
        for (const result of coveResults) {
          expect.soft('error' in result, `Error in cove: ${result}`).toBe(false);
        }
        return coveResults;
      })(),
      
      // Process Carta Regla 3.1.8 documents
      (async () => {
        const cartaRegla318TestCase = testCases['Carta Regla 3.1.8'];
        const cartaResults = await extractAndStructureCartasRegla318(cartaRegla318TestCase.fileUrls);
        expect.soft(cartaResults).toBeDefined();
        for (const result of cartaResults) {
          expect.soft('error' in result, `Error in carta regla 3.1.8: ${result}`).toBe(false);
        }
        return cartaResults;
      })()
    ];
    
    // Wait for all document processing to complete in parallel
    await Promise.all(promises);
  });
});

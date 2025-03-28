// A simple script to insert test documents into the database
// This is intended to be run manually when needed for testing purposes

import { db } from '../db';
import { CustomGlossFile } from '../db/schema';

// Function to insert test documents for a specific gloss ID
async function insertTestDocuments(glossId) {
  if (!glossId) {
    console.error('Please provide a valid gloss ID');
    return;
  }

  try {
    // Get the current working directory for file hosting
    const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mock-data`;
    
    // Insert a test pedimento document
    const result = await db.insert(CustomGlossFile).values([
      {
        name: 'Pedimento de Prueba',
        url: `${baseUrl}/test-pedimento.html`,
        documentType: 'pedimento',
        customGlossId: glossId,
      },
      {
        name: 'Carta Porte',
        url: `${baseUrl}/test-pedimento.html`,
        documentType: 'carta_porte',
        customGlossId: glossId,
      },
      {
        name: 'COVE',
        url: `${baseUrl}/test-pedimento.html`,
        documentType: 'cove',
        customGlossId: glossId,
      }
    ]).returning();

    console.log('Documents inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting test documents:', error);
  }
}

// If this script is run directly, parse the command line argument for the gloss ID
if (process.argv[1].endsWith('insert-test-doc.js')) {
  const glossId = process.argv[2];
  if (!glossId) {
    console.error('Please provide a gloss ID as an argument');
    process.exit(1);
  }
  
  insertTestDocuments(glossId)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

export { insertTestDocuments }; 
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { z } from 'zod';

const identificadoresSchema = z.record(z.string(), z.object({
  descripcion: z.string(),
  nivel: z.string(),
  supuesto: z.string(),
  complementos: z.array(z.object({
    complemento_1: z.string(),
    complemento_2: z.string(),
    complemento_3: z.string(),
  })),
}));

// Definir tipo para el objeto de identificadores
type IdentificadorData = {
  descripcion: string;
  nivel: string;
  supuesto: string;
  complementos: Array<{
    complemento_1: string;
    complemento_2: string;
    complemento_3: string;
  }>;
};

/**
 * Función para cargar un archivo HTML y extraer los elementos "tr"
 * @param filePath Ruta al archivo HTML
 * @returns Promise con un array de elementos "tr" como strings
 */
export async function loadHtmlFile(filePath: string) {
  try {
    // Si es una ruta relativa, resolvemos desde el directorio actual
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, filePath);

    const htmlContent = await fs.promises.readFile(resolvedPath, 'utf-8');

    // Usar JSDOM en lugar de DOMParser
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    const tableElement = doc.querySelector('table');

    if (!tableElement) {
      throw new Error('No se encontró el elemento table en el archivo HTML');
    }
    console.log(`Archivo HTML cargado exitosamente de: ${resolvedPath}`);

    // Obtener todos los elementos tr de la tabla (excluyendo los encabezados)
    const trElements = Array.from(tableElement.querySelectorAll('tr')).slice(2);

    // Extraer la información de cada fila
    // Primero extraemos los datos de todas las filas
    const allRowsData = trElements.map(tr => {
      // Obtener todas las celdas de la fila
      const cells = Array.from(tr.querySelectorAll('td'));

      // Extraer el texto dentro de los elementos p de cada celda
      const identifierCell = cells[0]?.querySelector('p')?.textContent?.trim() || '';

      // Definir el regex para capturar solo el código del identificador (2 letras/números)
      const identifierRegex = /^([A-Z0-9]{2})\s*[-–]/;
      const identifierMatch = identifierCell.match(identifierRegex);

      // Extraer solo el código del identificador
      const clave = identifierMatch ? identifierMatch[1] : '';
      const descripcion = identifierCell.replace(identifierRegex, '').trim();

      const nivel = cells[1]?.querySelector('p strong')?.textContent?.trim() || '';
      const supuesto = cells[2]?.querySelector('p')?.textContent?.trim() || '';
      const complemento_1 = cells[3]?.querySelector('p')?.textContent?.trim() || '';
      const complemento_2 = cells[4]?.querySelector('p')?.textContent?.trim() || '';
      const complemento_3 = cells[5]?.querySelector('p')?.textContent?.trim() || '';

      return {
        clave,
        descripcion,
        nivel,
        supuesto,
        complemento_1,
        complemento_2,
        complemento_3
      };
    });

    // Filtramos los identificadores de nivel "P" y excluimos aquellos que pertenecen a secciones de nivel "G"
    // Además, agrupamos las filas adicionales que pertenecen al mismo identificador de nivel "P"
    const levelPData: Record<string, IdentificadorData> = {};
    let inGSection = false;
    let currentIdentifier: IdentificadorData | null = null;
    let currentClave = "";

    for (let i = 0; i < allRowsData.length; i++) {
      const row = allRowsData[i];

      // Si encontramos un nivel "G", marcamos que estamos en una sección G
      if (row && row.nivel && row.nivel.trim() === 'G') {
        inGSection = true;
        continue;
      }

      // Si encontramos un nuevo nivel (P u otro) después de una sección G, salimos de la sección G
      if (inGSection && row && row.nivel && row.nivel.trim() !== '') {
        inGSection = false;
      }

      // Si no estamos en una sección G
      if (!inGSection && row) {
        // Verificamos si es una fila principal (con nivel "P") o una fila adicional (complementos)
        if (row.nivel && row.nivel.trim() === 'P' && row.clave) {
          // Es una nueva fila principal de nivel "P"
          currentClave = row.clave;
          currentIdentifier = {
            descripcion: row.descripcion,
            nivel: row.nivel,
            supuesto: row.supuesto,
            complementos: [{
              complemento_1: row.complemento_1,
              complemento_2: row.complemento_2,
              complemento_3: row.complemento_3,
            }]
          };
          levelPData[currentClave] = currentIdentifier;
        } else if (
          currentIdentifier &&
          !row.clave &&
          !row.descripcion &&
          !row.nivel &&
          !row.supuesto &&
          (row.complemento_1 || row.complemento_2 || row.complemento_3)
        ) {
          // Es una fila adicional con solo datos de complementos
          // Agregamos los complementos como un nuevo elemento en el array de complementos
          if (currentClave) {
            const currentIdentifier = levelPData[currentClave];
            if (currentIdentifier) {
              currentIdentifier.complementos.push({
                complemento_1: row.complemento_1,
                complemento_2: row.complemento_2,
                complemento_3: row.complemento_3,
              });
            }
          }
        } else if (row.nivel || row.clave) {
          // Es una nueva fila con otro nivel o identificador, pero no es parte de la anterior
          if (row.clave) {
            currentClave = row.clave;
            currentIdentifier = {
              descripcion: row.descripcion,
              nivel: row.nivel,
              supuesto: row.supuesto,
              complementos: [{
                complemento_1: row.complemento_1,
                complemento_2: row.complemento_2,
                complemento_3: row.complemento_3,
              }]
            };
            levelPData[currentClave] = currentIdentifier;
          }
        }
      }
    }

    const parsedData = identificadoresSchema.parse(levelPData);

    console.log(`Se encontraron ${Object.keys(parsedData).length} identificadores (después de agrupar filas múltiples)`);
    
    // Guardar los datos como una constante en un archivo TypeScript
    const tsContent = `// Archivo generado automáticamente
export const IDENTIFICADORES = ${JSON.stringify(parsedData, null, 2)} as const;
`;
    
    fs.writeFileSync('identificadores.ts', tsContent);
    console.log('Datos guardados como constante en identificadores.ts');
    
    return parsedData;
  } catch (error) {
    console.error(`Error al cargar el archivo HTML: ${error}`);
    throw error;
  }
}

loadHtmlFile('test.html');
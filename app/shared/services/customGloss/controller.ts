"use server";

import { randomUUID } from "crypto";
import { create, read } from "./model";
import { isAuthenticated } from "../auth";
// import { DUMP_GLOSS_FOR_CREATION } from "@/app/shared/constants";

// import { ANEXO_22_FIELDS_REQUESTS } from "@/app/constants";

export async function analysis(formData: FormData) {
  console.log("analysis", formData);
  try {
    // const responses = await Promise.all(
    //   ANEXO_22_FIELDS_REQUESTS.map((req) => fetch(req.url, req.options))
    // );

    // const allOk = responses.every((res) => res.ok);
    // if (!allOk) {
    //   return {
    //     success: false,
    //     message: "Ocurrió un error al obtener los campos del Anexo 22",
    //   };
    // }

    // const data = await Promise.all(responses.map((res) => res.text()));

    // console.log(data);

    // const pdfModifications = await fetch(
    //   "http://localhost:3000/api/gloss/highlighting_pediment_pdf",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       data,
    //     }),
    //   }
    // )
    //   .then((res) => res.text())
    //   .catch((error) => {
    //     console.error(error);
    //     return {
    //       success: false,
    //       message: "Ocurrió un error al modificar el PDF",
    //     };
    //   });

    // console.log(pdfModifications);

    const session = await isAuthenticated();
    const user_id = session.userId as string;

    // const custom_id = "3b25fce1-f969-4449-9968-dca412c022ac"; // CDMX

    const query_id = randomUUID();

    const response = await fetch(
      `https://cargo-claro-fastapi.onrender.com/receive-pdf/sandbox/${user_id}/${query_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GLOSS_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: "Ocurrió un error al enviar los documentos",
      };
    }

    const jsonResponse = await response.json();

    // const jsonResponse = {
    //   summary:
    //     "El análisis del pedimento correspondiente a SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV ha revelado un total de seis errores y dos advertencias. En la sección de tipo de operación, se detectó que el tipo declarado como 'IMP' no es consistente con el origen y destino de las mercancías, siendo necesario corregirlo a 'EXP'. En el destino/origen, se encontró que la clave de origen no coincide con el destino final declarado (USA), lo cual es crítico. En la operación, existen discrepancias en el número de guía, el peso bruto y el valor de incrementables, además de inconsistencias en la validación de pesos y bultos. En cuanto a las advertencias, se evidenció la falta de especificaciones del RFC del importador y datos del proveedor/comprador, que son esenciales para la operación. Es fundamental realizar las correcciones necesarias para evitar problemas con la aduana y asegurar el cumplimiento normativo.",
    //   timeSaved: 30,
    //   moneySaved: 3000.75,
    //   importerName: "SACC ASESORES ADUANEROS EN COMERCIO EXTERIOR, SA DE CV",
    //   pedimentNum: { number: 214737091001023, status: "ERROR", anio: 2024 },
    //   operationType: {
    //     status: "ERROR",
    //     data: [
    //       {
    //         id: 1,
    //         name: "Tipo de Operación",
    //         value: "IMP",
    //         is_check: true,
    //       },
    //     ],
    //     appendices: [
    //       {
    //         id: 2,
    //         title: "Tipo de Operación",
    //         description:
    //           "El tipo de operación debe ser consistente con:\n" +
    //           "1. Origen y destino de las mercancías\n" +
    //           "2. Clave de pedimento según Apéndice 2\n" +
    //           "3. Régimen aduanero según Apéndice 16",
    //         status: "ERROR",
    //         result: "Excepción Aplicable",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Análisis del Tipo de Operación",
    //             description:
    //               "❌ El tipo de operación esperado es 'EXP' para este origen/destino, sin embargo, se ha declarado 'IMP'. Esto representa una discrepancia grave que debe ser corregida para evitar problemas con la aduana.",
    //             links: [
    //               "[Ley Aduanera](https://www.sat.gob.mx/home) - Referencia de tipos de operación",
    //             ],
    //           },
    //         ],
    //         actions_to_take: [
    //           {
    //             id: 1,
    //             description:
    //               "Modificar el pedimento para reflejar el tipo de operación correcto como 'EXP'. Verificar que toda la documentación se ajuste a esta operación.",
    //           },
    //         ],
    //         summary:
    //           "El análisis del tipo de operación revela una discrepancia entre lo declarado ('IMP') y lo esperado ('EXP'). Se debe corregir el pedimento para evitar sanciones.",
    //       },
    //     ],
    //   },
    //   destinationOrigin: {
    //     status: "ERROR",
    //     destinationOriginKey: "9",
    //     appendixValidator: "Apéndice 15",
    //     appendices: [
    //       {
    //         id: 3,
    //         title: "Destino/Origen de Mercancías",
    //         description:
    //           "El destino/origen debe ser consistente con:\n" +
    //           "1. Clave válida según Apéndice 15\n" +
    //           "2. Destino final declarado\n" +
    //           "3. Documentación de la operación",
    //         status: "ERROR",
    //         result: "Cumplimiento Obligatorio",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Verificación de clave de destino/origen",
    //             description:
    //               "✅ La clave de destino/origen existe en Apéndice 15, y es válida. \n" +
    //               "❌ Sin embargo, el destino final declarado (USA) no coincide con la clave 9, que debe ser México. Esto representa una discrepancia crítica.",
    //             links: ["[Apéndice 15](URL_del_apendice)"],
    //           },
    //           {
    //             id: 2,
    //             title: "Coherencia en la documentación",
    //             description:
    //               "❌ Los documentos de transporte presentan incoherencias con respecto al país de origen y destino, lo que podría complicar el proceso aduanero y generar sanciones.",
    //             links: ["[Reglamento de la Ley Aduanera](URL_del_reglamento)"],
    //           },
    //         ],
    //         actions_to_take: [
    //           {
    //             id: 1,
    //             description:
    //               "Rectificar el destino final declarado para que coincida con la clave de origen/destino 9 (México).",
    //           },
    //           {
    //             id: 2,
    //             description:
    //               "Asegurar que los documentos de transporte sean coherentes y reflejen el país de origen correcto.",
    //           },
    //         ],
    //         summary:
    //           "Se encontraron errores en la declaración del pedimento. El destino declarado no es coherente con la clave de origen y los documentos presentan incoherencias. Se deben realizar correcciones inmediatas.",
    //       },
    //     ],
    //   },
    //   operation: {
    //     status: "ERROR",
    //     calculations: [
    //       {
    //         id: 4,
    //         title: "Fecha de entrada",
    //         description:
    //           "Capítulo I\n" +
    //           "Entrada, salida y control de mercancías\n" +
    //           "ARTICULO 10. La entrada o la salida de mercancías del territorio nacional, las maniobras de carga, descarga, transbordo y almacenamiento de las mismas, el embarque o desembarque de pasajeros y la revisión de sus equipajes, deberá efectuarse por lugar autorizado, en día y hora hábil.\n" +
    //           "El Servicio de Administración Tributaria podrá autorizar la entrada al territorio nacional o la salida del mismo por lugar distinto al autorizado, de mercancías que por su naturaleza o volumen no puedan despacharse conforme a lo establecido en el párrafo anterior, o bien, por eficiencia y facilitación en el despacho de las mercancías.",
    //         status: "CHECKED",
    //         result: "Cumplimiento Obligatorio",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Verificación de fecha de entrada",
    //             description:
    //               "✅ La fecha de entrada del pedimento (2021-08-12) es un día hábil, cumpliendo con la obligación establecida.",
    //             links: [
    //               "[Ley de Aduanas](https://www.gob.mx/sat/acciones-y-programas/ley-de-aduanas)",
    //             ],
    //           },
    //         ],
    //         actions_to_take: [],
    //         summary:
    //           "La fecha de entrada del pedimento cumple con la obligación de ser un día hábil.",
    //       },
    //       {
    //         id: 5,
    //         title: "Documento de transporte",
    //         description:
    //           "Los datos declarados en el pedimento deben coincidir exactamente con los datos registrados en el documento de transporte, incluyendo:\n" +
    //           "- Número de guía\n" +
    //           "- Fecha de entrada\n" +
    //           "- Número de bultos\n" +
    //           "- Peso bruto\n" +
    //           "- Valor del flete",
    //         status: "ERROR",
    //         result: "Cumplimiento Obligatorio",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Número de guía",
    //             description:
    //               "❌ El número de guía no coincide. El registrado es '40600231954' y en el pedimento se encuentra '2W646MHPPF H' y '406-00231954 M'.",
    //             links: [
    //               "[Norma de Regulación de Transporte](https://www.sat.gob.mx/consultas/transportes)",
    //             ],
    //           },
    //           {
    //             id: 2,
    //             title: "Fecha de entrada",
    //             description:
    //               "✅ La fecha de entrada coincide ('2021-08-12' vs '12/08/2021').",
    //             links: [],
    //           },
    //           {
    //             id: 3,
    //             title: "Número de bultos",
    //             description: "✅ El número de bultos coincide (1 vs 1).",
    //             links: [],
    //           },
    //           {
    //             id: 4,
    //             title: "Peso bruto",
    //             description:
    //               "❌ El peso bruto no coincide. Registrado es '19.5' y en el pedimento es '19.0'.",
    //             links: [
    //               "[Regulación de Pesos y Medidas](https://www.gob.mx/sct/acciones-y-programas/peso-y-medida)",
    //             ],
    //           },
    //           {
    //             id: 5,
    //             title: "Valor de incrementables",
    //             description:
    //               "❌ El valor de incrementables no coincide. Registrado es '2380.0' y en el pedimento es '10873'.",
    //             links: [
    //               "[Ley del Impuesto General de Importación](https://www.sat.gob.mx/sitio_internet/cfd/leyes/ley_ig.xml)",
    //             ],
    //           },
    //         ],
    //         actions_to_take: [
    //           {
    //             id: 1,
    //             description:
    //               "Corregir el número de guía en el pedimento para que coincida exactamente con el registrado.",
    //           },
    //           {
    //             id: 2,
    //             description:
    //               "Ajustar el peso bruto en el pedimento para que coincida con el registrado.",
    //           },
    //           {
    //             id: 3,
    //             description:
    //               "Modificar el valor de incrementables en el pedimento para que refleje el registrado.",
    //           },
    //         ],
    //         summary:
    //           "Se encontraron discrepancias en el número de guía, peso bruto y valor de incrementables que deben ser corregidas para cumplir con la normativa aduanera.",
    //       },
    //       {
    //         id: 6,
    //         title: "Tipo de cambio",
    //         description:
    //           "Corresponde al día hábil anterior a la fecha de entrada de las mercancías.",
    //         status: "CHECKED",
    //         result: "Cumplimiento Obligatorio",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Verificación de Tipo de Cambio",
    //             description:
    //               "✅ El tipo de cambio del pedimento coincide exactamente con el tipo de cambio esperado del DOF.",
    //             links: ["[DOF - Tipo de Cambio](http://www.dof.gob.mx)"],
    //           },
    //         ],
    //         actions_to_take: [],
    //         summary:
    //           "El tipo de cambio del pedimento es correcto y coincide con el esperado del DOF. No se requieren acciones.",
    //       },
    //       {
    //         id: 7,
    //         title: "Valores del pedimento",
    //         description:
    //           "Los valores declarados deben coincidir con los cálculos esperados basados en el tipo de cambio.",
    //         status: "WARNING",
    //         result: "Excepción Aplicable",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Valor en Dólares",
    //             description:
    //               "⚠️ Existe una discrepancia entre el valor en dólares registrado en el pedimento y el valor calculado. El pedimento indica $2920.82, mientras que el cálculo es de $2380.00. Es importante validar esta diferencia para evitar problemas en el despacho aduanero.",
    //             links: [
    //               "[Ley Aduanera](https://www.gob.mx/sat/acciones-y-programas/ley-aduanera)",
    //             ],
    //           },
    //           {
    //             id: 2,
    //             title: "Valor de Aduana",
    //             description:
    //               "✅ El valor de aduana coincide exactamente con el calculado, lo cual es positivo. Ambas cifras son $58721.",
    //             links: [],
    //           },
    //           {
    //             id: 3,
    //             title: "Precio Pagado o Valor Comercial",
    //             description:
    //               "⚠️ Hay una ligera discrepancia en el precio pagado o valor comercial. El pedimento muestra $47848, pero el cálculo es de $47847.044. Debe revisarse esta diferencia, ya que podría afectar el valor final a efectos fiscales.",
    //             links: [],
    //           },
    //         ],
    //         actions_to_take: [
    //           {
    //             id: 1,
    //             description:
    //               "Verifique el valor en dólares del pedimento y ajuste si es necesario. También revise el precio pagado o valor comercial para corregir cualquier error.",
    //           },
    //         ],
    //         summary:
    //           "Se encontraron discrepancias en el valor en dólares y el precio pagado o valor comercial en el pedimento. Se recomienda verificar y ajustar donde sea necesario para asegurar el cumplimiento de la normativa aduanera.",
    //       },
    //     ],
    //   },
    //   grossWeight: {
    //     status: "ERROR",
    //     calculations: [
    //       {
    //         id: 8,
    //         title: "Pesos y Bultos",
    //         description:
    //           "La validación de pesos y bultos debe asegurar que:\n" +
    //           "1. El Peso Neto Total es menor que el Peso Bruto declarado en el Pedimento\n" +
    //           "2. El Peso Bruto declarado en el Pedimento coincide con el del Documento de Transporte\n" +
    //           "3. El Número Total de Bultos coincide entre el Pedimento y el Documento de Transporte\n" +
    //           "4. Las Marcas y Números de los Bultos son coherentes",
    //         status: "ERROR",
    //         result: "Excepción Aplicable",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Inconsistencia de Peso Bruto",
    //             description:
    //               "❌ La diferencia entre el peso bruto del pedimento (19.0) y del documento de transporte (19.5) indica una discrepancia que debe ser verificada.",
    //             links: [
    //               "[Reglamento de la Ley Aduanera](http://www.sat.gob.mx)",
    //             ],
    //           },
    //           {
    //             id: 2,
    //             title: "Inconsistencia en Número de Bultos",
    //             description:
    //               "❌ A pesar de que el número total de bultos es el mismo (1), se debe revisar que la información sobre marcas y números de bultos coincida en ambos documentos.",
    //             links: ["[Norma Oficial Mexicana](http://www.normas.gob.mx)"],
    //           },
    //           {
    //             id: 3,
    //             title: "Pendiente de Validación de Peso Neto",
    //             description:
    //               "⚠️ El peso neto total calculado es 0, lo que genera una pendiente en la validación respecto a los pesos brutos declarados.",
    //             links: [
    //               "[Ley de Impuestos Generales de Importación y de Exportación](http://www.dof.gob.mx)",
    //             ],
    //           },
    //         ],
    //         actions_to_take: [
    //           {
    //             id: 1,
    //             description:
    //               "Verificar y corregir los pesos en el pedimento y documento de transporte, asegurando que sean consistentes.",
    //           },
    //           {
    //             id: 2,
    //             description:
    //               "Revisar y actualizar la información de marcas y números de bultos en ambos documentos.",
    //           },
    //           {
    //             id: 3,
    //             description:
    //               "Calcular el peso neto total correctamente y asegurarse de que esté registrado en el pedimento.",
    //           },
    //         ],
    //         summary:
    //           "Se han detectado errores en los pesos brutos y en la información de bultos. Se deben realizar verificaciones y correcciones en los documentos para asegurar su coherencia.",
    //       },
    //     ],
    //   },
    //   invoiceData: {
    //     status: "CHECKED",
    //     importerExporter: {
    //       rfc_is_check: true,
    //       tax_address_is_check: true,
    //       company_name_is_check: true,
    //       details: {
    //         id: 9,
    //         title: "Datos del Proveedor/Comprador",
    //         description:
    //           "La validación de datos comerciales debe asegurar:\n" +
    //           "1. Correcta identificación del importador/exportador\n" +
    //           "2. Validez de los datos del proveedor/comprador\n" +
    //           "3. Coherencia en el COVE según Regla 1.9.19\n" +
    //           "4. Validez de la cesión de derechos (si aplica)",
    //         status: "WARNING",
    //         result: "Excepción Aplicable",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Datos del Importador/Exportador",
    //             description:
    //               "⚠️ El RFC declarado no está especificado, lo cual es un requisito obligatorio para la validación de importaciones y exportaciones. Aunque coincide con los documentos, la falta de especificación es un defecto.",
    //             links: [
    //               "[Código Fiscal de la Federación](https://www.sat.gob.mx/home)",
    //             ],
    //           },
    //           {
    //             id: 2,
    //             title: "Datos del Proveedor/Comprador",
    //             description:
    //               "⚠️ Falta de especificación del Nombre/Razón Social, Domicilio e ID Fiscal. Estos datos son necesarios para la correcta identificación del proveedor/comprador en la operación.",
    //             links: [
    //               "[Ley Aduanera](https://www.dof.gob.mx/buscar/dof/ley_aduanera.html)",
    //             ],
    //           },
    //         ],
    //         actions_to_take: [
    //           {
    //             id: 1,
    //             description:
    //               "Especificar el RFC del importador/exportador, así como el Nombre/Razón Social, Domicilio e ID Fiscal del proveedor/comprador para cumplir con los requisitos de la legislación aduanera.",
    //           },
    //         ],
    //         summary:
    //           "Se encontraron advertencias en cuanto a la falta de especificaciones del RFC del importador/exportador y de datos del proveedor/comprador. Se deben ingresar estos datos para cumplir adecuadamente con las disposiciones normativas.",
    //       },
    //     },
    //     supplierBuyer: {
    //       company_name_is_check: true,
    //       address_is_check: true,
    //       tax_id: true,
    //       details: {},
    //     },
    //   },
    //   transportData: {
    //     status: "CHECKED",
    //     type: "LAND",
    //     data: [
    //       {
    //         id: 10,
    //         title: "Datos de Transporte y Unidades",
    //         description:
    //           "La validación de transporte debe asegurar:\n" +
    //           "1. Correcta identificación del medio de transporte\n" +
    //           "2. Validez de los identificadores de unidades\n" +
    //           "3. Coherencia con el Apéndice 10\n" +
    //           "4. Consistencia entre todos los documentos",
    //         status: "CHECKED",
    //         result: "Cumplimiento Obligatorio",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Identificación del Medio de Transporte",
    //             description:
    //               "✅ El medio de transporte está adecuadamente identificado como CONTENEDOR en modalidad MARÍTIMO, cumpliendo con los requerimientos.",
    //             links: [
    //               "[Normas de transporte marítimo](https://example.com/normas-transporte-maritimo)",
    //             ],
    //           },
    //           {
    //             id: 2,
    //             title: "Validación de Identificadores de Unidades",
    //             description:
    //               "✅ El contenedor ABCD1234567 de tipo 22G1 es válido, cumpliendo con la normativa correspondiente.",
    //             links: [
    //               "[Reglamento de Identificación de Contenedores](https://example.com/reglamento-identificacion-contenedores)",
    //             ],
    //           },
    //           {
    //             id: 3,
    //             title: "Validación de Claves",
    //             description:
    //               "✅ Las claves declaradas (22G1, TRAC) son válidas según el Apéndice 10, lo que asegura el cumplimiento normativo.",
    //             links: [
    //               "[Apéndice 10 de la Regulación Aduanera](https://example.com/apendice10)",
    //             ],
    //           },
    //           {
    //             id: 4,
    //             title: "Coherencia entre Documentos",
    //             description:
    //               "✅ Todos los documentos presentan coherencia: pedimento, transporte y packing list coinciden.",
    //             links: [
    //               "[Reglamento sobre documentos aduaneros](https://example.com/reglamento-documentos-aduaneros)",
    //             ],
    //           },
    //           {
    //             id: 5,
    //             title: "Detalles por Tipo de Unidad",
    //             description:
    //               "✅ Los detalles por tipo de unidad están completos y han sido verificados, cumpliendo totalmente los requisitos.",
    //             links: [
    //               "[Guía de detalles de unidades](https://example.com/guia-detalles-unidades)",
    //             ],
    //           },
    //         ],
    //         actions_to_take: [],
    //         summary:
    //           "El pedimento ha sido analizado y cumple con las normativas, sin inconsistencias encontradas. Las validaciones de identificación, claves y coherencia documental están correctas.",
    //       },
    //     ],
    //   },
    //   certification: {
    //     status: "CHECKED",
    //     taxes: [
    //       { id: 1, tax: 16, type: "IVA", isCheck: true },
    //       { id: 2, tax: 5, type: "IGI", isCheck: true },
    //     ],
    //     restrictionsRegulations: [
    //       {
    //         id: 11,
    //         title: "Identificadores y Observaciones",
    //         description:
    //           "La validación de identificadores y observaciones debe asegurar:\n" +
    //           "1. Correcta declaración de identificadores según Apéndice 8\n" +
    //           "2. Validez de e-documents declarados\n" +
    //           "3. Correcta aplicación de IMMEX (si aplica)\n" +
    //           "4. Observaciones claras y fundamentos legales vigentes",
    //         status: "CHECKED",
    //         result: "Cumplimiento Obligatorio",
    //         comparisons: [
    //           {
    //             id: 1,
    //             title: "Identificadores",
    //             description:
    //               "��� Identificadores válidos. Todos los identificadores declarados son correctos y válidos, cumpliendo con las normativas aplicables.",
    //             links: [
    //               "[Normativa sobre Identificadores](https://www.example.com/normativa_identificadores)",
    //             ],
    //           },
    //           {
    //             id: 2,
    //             title: "e-Documents",
    //             description:
    //               "✅ Todos los e-documents coinciden correctamente con el sistema y están debidamente declarados.",
    //             links: [
    //               "[Reglamento de e-Documents](https://www.example.com/reglamento_e_documents)",
    //             ],
    //           },
    //           {
    //             id: 3,
    //             title: "Programa IMMEX",
    //             description:
    //               "⚠️ No aplica programa IMMEX, lo cual es correcto dado que no se declaró. Sin embargo, siempre se debe verificar su relevancia en el contexto específico de la operación.",
    //             links: ["[Ley IMMEX](https://www.example.com/ley_immex)"],
    //           },
    //           {
    //             id: 4,
    //             title: "Fundamentos Legales",
    //             description:
    //               "✅ Fundamentos legales vigentes y correctos. Todos los fundamentos legales citados cumplen con los requisitos establecidos.",
    //             links: [
    //               "[Fundamentos Legales](https://www.example.com/fundamentos_legales)",
    //             ],
    //           },
    //         ],
    //         actions_to_take: [],
    //         summary:
    //           "La validación del pedimento muestra cumplimiento obligatorio en todos los aspectos analizados, sin inconsistencias encontradas. Se recomienda mantener las prácticas actuales de validación y consulta de normativas.",
    //       },
    //     ],
    //   },
    //   files: [
    //     {
    //       name: "TRANSPORTE",
    //       url: "https://drive.google.com/file/d/1Gjq-L3_GK7XFkqNhiNRQQWQT5mWpsZOF/preview",
    //     },
    //     {
    //       name: "CESIÓN DE DERECHOS",
    //       url: "https://drive.google.com/file/d/1V1NqXOKdDbqCVfe4N_Y9sO7EJ8DUofm3/preview",
    //     },
    //     {
    //       name: "PEDIMENTO",
    //       url: "https://drive.google.com/file/d/1_MPjjVK1TgmZISo29rx5_3XkWjo1Ub1j/preview",
    //     },
    //     {
    //       name: "E-NOM",
    //       url: "https://drive.google.com/file/d/1CEdjGzHD7ZZg5uTLcVLIKv__D2-R7ngr/preview",
    //     },
    //     {
    //       name: "CARTA 3.1.8",
    //       url: "https://drive.google.com/file/d/1QLYUVE1KEv5CnefU5JSZK-78o0W9uDQ1/preview",
    //     },
    //     {
    //       name: "COVE",
    //       url: "https://drive.google.com/file/d/1kGQMf4l-O1sYCusB863k5yDPoituPmuS/preview",
    //     },
    //   ],
    //   alerts: [
    //     { type: "HIGH", description: "NUM. FACTURA" },
    //     { type: "LOW", description: "# CONTENEDOR" },
    //     { type: "LOW", description: "PRECIO UNIT" },
    //     { type: "LOW", description: "CANTIDAD UMT" },
    //     { type: "LOW", description: "PESO BRUTO" },
    //   ],
    // };

    const newOperationType = {
      ...jsonResponse.operationType,
      data: JSON.stringify(jsonResponse.operationType.data),
      appendices: JSON.stringify(jsonResponse.operationType.appendices),
    };
    const newDestinationOrigin = {
      ...jsonResponse.destinationOrigin,
      appendices: JSON.stringify(jsonResponse.destinationOrigin.appendices),
    };
    const newOperation = {
      ...jsonResponse.operation,
      calculations: JSON.stringify(jsonResponse.operation.calculations),
    };
    const newGrossWeight = {
      ...jsonResponse.grossWeight,
      calculations: JSON.stringify(jsonResponse.grossWeight.calculations),
    };
    const newInvoiceData = {
      ...jsonResponse.invoiceData,
      importerExporter: JSON.stringify(
        jsonResponse.invoiceData.importerExporter
      ),
      supplierBuyer: JSON.stringify(jsonResponse.invoiceData.supplierBuyer),
    };
    const newTransportData = {
      ...jsonResponse.transportData,
      data: JSON.stringify(jsonResponse.transportData.data),
    };
    const newCertifications = {
      ...jsonResponse.certification,
      taxes: JSON.stringify(jsonResponse.certification.taxes),
      restrictionsRegulations: JSON.stringify(
        jsonResponse.certification.restrictionsRegulations
      ),
    };

    const newCustomGloss = await create({
      data: {
        user: { connect: { id: user_id } },
        summary: jsonResponse.summary,
        timeSaved: jsonResponse.timeSaved,
        moneySaved: jsonResponse.moneySaved,
        importerName: jsonResponse.importerName,
        pedimentNum: { create: jsonResponse.pedimentNum },
        operationType: { create: newOperationType },
        destinationOrigin: {
          create: newDestinationOrigin,
        },
        operation: { create: newOperation },
        grossWeight: { create: newGrossWeight },
        invoiceData: { create: newInvoiceData },
        transportData: { create: newTransportData },
        certification: { create: newCertifications },
        alerts: { create: jsonResponse.alerts },
        files: { create: jsonResponse.files },
      },
    });

    return {
      success: true,
      glossId: newCustomGloss.id,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrió un error interno",
    };
  }
}

export async function getMyAnalysis() {
  try {
    const session = await isAuthenticated();
    return await read({ userId: session.userId as string });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMyAnalysisById(id: string) {
  try {
    const session = await isAuthenticated();
    return await read({ id, userId: session.userId as string });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRecentAnalysis() {
  try {
    const session = await isAuthenticated();
    return await read({ userId: session.userId as string, recent: true });
  } catch (error) {
    console.error(error);
    return [];
  }
}

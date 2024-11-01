import getBaseUrl from "../utils/get-base-url";

export const INITIAL_STATE_RESPONSE = {
  success: false,
  message: "",
  errors: {},
};

// THIS WILL BE REPLACED BY THE REAL DATA FROM THE USER
export const DUMP_GLOSSES = [
  {
    id: 28,
    importerName: "Nissan",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 27,
    importerName: "Cablemex",
    operationStatus: "DONE",
  },
  {
    id: 26,
    importerName: "Daniel González",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 25,
    importerName: "Javier",
    operationStatus: "DONE",
  },
  {
    id: 24,
    importerName: "Chevrolet",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 23,
    importerName: "Ford",
    operationStatus: "DONE",
  },
  {
    id: 22,
    importerName: "Toyota",
    operationStatus: "DONE",
  },
  {
    id: 21,
    importerName: "Mazda",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 20,
    importerName: "Subaru",
    operationStatus: "DONE",
  },
  {
    id: 19,
    importerName: "Ford2",
    operationStatus: "DONE",
  },
  {
    id: 18,
    importerName: "Toyota2",
    operationStatus: "DONE",
  },
  {
    id: 17,
    importerName: "Mazda2",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 16,
    importerName: "Subaru2",
    operationStatus: "DONE",
  },
  {
    id: 15,
    importerName: "Nissan3",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 14,
    importerName: "Cablemex3",
    operationStatus: "DONE",
  },
  {
    id: 13,
    importerName: "Daniel González3",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 12,
    importerName: "Javier3",
    operationStatus: "DONE",
  },
  {
    id: 11,
    importerName: "Chevrolet3",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 10,
    importerName: "Ford3",
    operationStatus: "DONE",
  },
  {
    id: 9,
    importerName: "Toyota3",
    operationStatus: "DONE",
  },
  {
    id: 8,
    importerName: "Mazda3",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 7,
    importerName: "Subaru3",
    operationStatus: "DONE",
  },
  {
    id: 6,
    importerName: "Ford23",
    operationStatus: "DONE",
  },
  {
    id: 5,
    importerName: "Toyota23",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 4,
    importerName: "Mazda23",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 3,
    importerName: "Subaru23",
    operationStatus: "DONE",
  },
  {
    id: 2,
    importerName: "Mazda234",
    operationStatus: "IN_PROGRESS",
  },
  {
    id: 1,
    importerName: "Subaru234",
    operationStatus: "DONE",
  },
];

const baseUrl = getBaseUrl();
const anexo22Url = `${baseUrl}/api/gloss/anexo_22`;
const generalOptions = {
  method: "POST",
  credentials: "include" as RequestCredentials,
  headers: {
    "Content-Type": "application/json",
  },
};
export const ANEXO_22_FIELDS_REQUESTS = [
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "1_encabezado_principal_de_pedimento",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "2_encabezado_para_paginas_secundarias_del_pedimento",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "3_agente_aduanal_o_agencia_aduanal_representacion_legal_apoderado_aduanal_o_de_almacen",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "4_datos_del_proveedor_comprador",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "5_datos_del_destinatario",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "6_datos_del_transporte_y_transportista",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "7_candados",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "8_guias_manifiestos_conocimientos_embarque_o_documentos_de_transporte",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "9_contenedores_equipo_ferrocarril_numero_economico_vehiculo",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "10_identificadores_nivel_pedimento",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "11_cuentas_aduaneras_y_cuentas_aduaneras_de_garantia_nivel_pedimento",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "12_descargos",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "13_compensaciones",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "14_documentos_que_amparan_las_formas_de_pago_distintas_a_efectivo",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "15_observaciones_nivel_pedimento",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "16_partidas",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "17_mercancias",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "18_regulaciones_y_restricciones_no_arancelarias",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "19_identificadores_nivel_partida",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "20_cuentas_aduaneras_de_garantia_nivel_partida",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "21_determinacion_y_pago_de_contribuciones_por_aplicacion_de_los_artículos_2_5_del_t_mec_14_del_anexo_III_de_la_decision_15_del_anexo_I_del_tlcaelc_o_del_acc_nivel_partida",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "22_observaciones_a_nivel_partida",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "23_rectificaciones",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "24_diferencias_de_contribuciones_nivel_pedimento",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "25_prueba_suficiente",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "26_encabezado_para_determinacion_de_contribuciones_a_nivel_partida_para_pedimentos_complementarios_al_amparo_del_articulo_2_5_del_t_mec",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "27_encabezado_para_determinacion_de_contribuciones_a_nivel_partida_para_pedimentos_complementarios_al_amparo_de_los_articulos_14_del_anexo_III_de_la_decision_15_del_anexo_I_del_tlcaelc_o_del_acc",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "28_distribucion_de_copias",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field:
          "29_instructivo_de_llenado_del_pedimento_de_transito_para_el_transbordo",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "30_apendice_1",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "31_apendice_2",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "32_apendice_3",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "33_apendice_4",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "34_apendice_5",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "35_apendice_6",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "36_apendice_7",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "37_apendice_8",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "38_apendice_9",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "39_apendice_10",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "40_apendice_11",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "41_apendice_12",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "42_apendice_13",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "43_apendice_14",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "44_apendice_15",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "45_apendice_16",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "46_apendice_17",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "47_apendice_18",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "48_apendice_19",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "49_apendice_21",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "50_apendice_22",
      }),
    },
  },
  {
    url: anexo22Url,
    options: {
      ...generalOptions,
      body: JSON.stringify({
        request_field: "51_apendice_23",
      }),
    },
  },
];

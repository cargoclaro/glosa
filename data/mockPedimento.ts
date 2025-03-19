
import { Pedimento } from "~/types/pedimento";

export const mockPedimento: Pedimento = {
  encabezado_del_pedimento: {
    num_pedimento: "25 47 3065 5000483",
    tipo_oper: "IMP",
    cve_pedim: "A1",
    regimen: "IMD",
    destino_origen: "9",
    tipo_cambio: 20.26170,
    peso_bruto: 1108.000,
    aduana_entrada_salida: "470"
  },
  medios_transporte: {
    entrada_salida: "4",
    arribo: "4",
    salida: "7"
  },
  valores: {
    valor_dolares: 28019.97,
    valor_aduana: 567733,
    precio_pagado_valor_comercial: 471790
  },
  datos_importador: {
    rfc: "GCT150821KD7",
    curp: "",
    razon_social: "GARAY COMPONENTES TUBULARES SA DE CV",
    domicilio: "DARWIN, No. Ext. 74, No. Int. 301, ANZUREZ, C.P. 11590, MIGUEL HIDALGO, CIUDAD DE MÉXICO, MEXICO (ESTADOS UNIDOS MEXICANOS)"
  },
  incrementables: {
    val_seguros: 0,
    seguros: 0,
    fletes: 82616,
    embalajes: 0,
    otros_incrementables: 13327
  },
  decrementables: {
    transporte_decrementables: 0,
    seguro_decrementables: 0,
    carga_decrementables: 0,
    descarga_decrementables: 0,
    otros_decrementables: 0
  },
  fecha_entrada_presentacion: "20/02/2025",
  identificadores_nivel_pedimento: {
    clave_seccion_aduanera: "470",
    marcas_numeros_bultos: "S/M S/N 2 BULTOS"
  },
  id_fiscal: "ENV/2024/00003538",
  cove: null,
  nombre_razon_social: "HIJOS DE JUAN DE GARAY S.A.",
  domicilio: "PASEO OBISPO OTADUY No. 9-11, C.P. 20560, OÑATE (GUIPUZCOA), ESPAÑA (REINO DE)",
  vinculacion: "SI",
  datos_factura: [
    {
      num_factura: "37006759,COVE257 BSYDG6",
      fecha_factura: "13/02/2025",
      incoterm: "EXW",
      moneda_factura: "EUR",
      valor_moneda_factura: 22400.00,
      factor_moneda_factura: 1.03950000,
      valor_dolares_factura: 23284.80
    }
  ],
  no_guia_embarque_id: "075-63874134",
  tipo_contenedor_vehiculo: "",
  identificadores_pedimento: [
    {
      clave: "CR",
      complemento_1: "305",
      complemento_2: "",
      complemento_3: ""
    },
    {
      clave: "SO",
      complemento_1: "AA",
      complemento_2: "",
      complemento_3: ""
    },
    {
      clave: "ED",
      complemento_1: "017025102VQG3",
      complemento_2: "",
      complemento_3: ""
    },
    {
      clave: "ED",
      complemento_1: "04382513O7E14",
      complemento_2: "",
      complemento_3: ""
    }
  ],
  observaciones_a_nivel_pedimento: "SE ANEXA GUIA AEREA\nSE ANEXA CARTA FACTURA COMERCIAL ES/200177/16",
  document_summary: "",
  partidas: [
    {
      fraccion: "73269099",
      subd_num_identificacion_comercial: "99",
      vinc: "1",
      met_val: "1",
      umc: "6",
      cantidad_umc: 32000.000,
      umt: "1",
      cantidad_umt: 1056.00000,
      p_vic: "ESP",
      p_oid: "DEU",
      descripcion: "ELEMENTO DE ACERO PARA TUBOS(CRASHELEMENT 3MM BERUCOAT AF732)",
      val_adu_usd: null,
      imp_precio_pag: null,
      precio_unit: null,
      val_agreg: null,
      marca: "567733",
      modelo: "471790",
      pais_origen: null,
      pais_vendedor: null,
      tasa_arancel: 16.00000,
      t_t: "1",
      f_p: 0,
      importe: 90908,
      observaciones: "LOTE: PR7257"
    }
  ]
};

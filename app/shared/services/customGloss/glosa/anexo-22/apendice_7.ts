export const apendice7 = {
  "Apéndice": "7",
  "Título": "Unidades de medida",
  "Unidades": [
    {
      "Clave": "1",
      "Descripción": "Kilo"
    },
    {
      "Clave": "2", 
      "Descripción": "Gramo"
    },
    {
      "Clave": "3",
      "Descripción": "Metro lineal"
    },
    {
      "Clave": "4",
      "Descripción": "Metro cuadrado"
    },
    {
      "Clave": "5",
      "Descripción": "Metro cúbico"
    },
    {
      "Clave": "6",
      "Descripción": "Pieza"
    },
    {
      "Clave": "7",
      "Descripción": "Cabeza"
    },
    {
      "Clave": "8",
      "Descripción": "Litro"
    },
    {
      "Clave": "9",
      "Descripción": "Par"
    },
    {
      "Clave": "10",
      "Descripción": "Kilowatt"
    },
    {
      "Clave": "11",
      "Descripción": "Millar"
    },
    {
      "Clave": "12",
      "Descripción": "Juego"
    },
    {
      "Clave": "13",
      "Descripción": "Kilowatt/Hora"
    },
    {
      "Clave": "14",
      "Descripción": "Tonelada"
    },
    {
      "Clave": "15",
      "Descripción": "Barril"
    },
    {
      "Clave": "16",
      "Descripción": "Gramo neto"
    },
    {
      "Clave": "17",
      "Descripción": "Decenas"
    },
    {
      "Clave": "18",
      "Descripción": "Cientos"
    },
    {
      "Clave": "19",
      "Descripción": "Docenas"
    },
    {
      "Clave": "20",
      "Descripción": "Caja"
    },
    {
      "Clave": "21",
      "Descripción": "Botella"
    },
    {
      "Clave": "22",
      "Descripción": "Carat"
    }
  ]
} as const;

import { z } from "zod";

export type Apendice7 = z.infer<typeof apendice7Schema>;

export const apendice7Schema = z.object({
  Apéndice: z.literal("7"),
  Título: z.literal("Unidades de medida"),
  Unidades: z.array(
    z.object({
      Clave: z.string().describe("Código numérico que identifica la unidad de medida"),
      Descripción: z.string().describe("Nombre descriptivo de la unidad de medida")
    })
  ).describe("Lista de unidades de medida válidas para el comercio exterior")
});
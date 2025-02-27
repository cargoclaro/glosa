import { z } from "zod"

export const schema = z.object({
  importer_name: z.string(),
  summary: z.string(),
  metrics: z.array(
    z.object({ time_saved: z.number(), money_saved: z.number() })
  ),
  secciones_pedimento: z.object({
    pediment_number: z.object({
      provided_context: z.object({
        pedimento: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({ name: z.string(), value: z.number() })
              ])
            )
          })
        )
      }),
      validation_steps: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(
            z.object({ id: z.number(), step_description: z.string() })
          )
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    }),
    operation_type: z.object({
      provided_context: z.object({
        pedimento: z.object({
          document_id: z.string(),
          document_summary: z.string(),
          data: z.array(z.object({ name: z.string(), value: z.string() }))
        }),
        documento_de_transporte: z.array(z.unknown())
      }),
      external_context: z.object({
        apendice_2: z.object({ name: z.string(), value: z.string() }),
        apendice_16: z.object({ name: z.string(), value: z.string() })
      }),
      validation_steps: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(
            z.object({ id: z.number(), step_description: z.string() })
          )
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    }),
    destination_origin: z.object({
      provided_context: z.object({
        pedimento: z.object({
          document_id: z.string(),
          document_summary: z.string(),
          data: z.array(z.object({ name: z.string(), value: z.string() }))
        }),
        documento_de_transporte: z.array(z.unknown())
      }),
      external_context: z.object({
        apendice_15: z.object({ name: z.string(), value: z.string() })
      }),
      validation_steps: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(z.unknown())
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    }),
    operation: z.object({
      provided_context: z.object({
        pedimento: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({ name: z.string(), value: z.number() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      num_factura: z.string(),
                      fecha_factura: z.string(),
                      incoterm: z.string(),
                      moneda_factura: z.string(),
                      valor_moneda_factura: z.string(),
                      factor_moneda_factura: z.number(),
                      valor_dolares_factura: z.string()
                    })
                  )
                }),
                z.object({
                  name: z.string(),
                  value: z.object({
                    seguros: z.string(),
                    fletes: z.string(),
                    embalajes: z.string(),
                    otros: z.string()
                  })
                }),
                z.object({
                  name: z.string(),
                  value: z.object({
                    fletes: z.string(),
                    seguros: z.string(),
                    carga: z.string(),
                    descarga: z.string(),
                    otros: z.string()
                  })
                })
              ])
            )
          })
        ),
        documento_de_transporte: z.array(z.unknown()),
        cove: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      descripcion: z.string(),
                      cantidad: z.number(),
                      unidad: z.string(),
                      precio_unitario: z.string(),
                      precio_total: z.string()
                    })
                  )
                }),
                z.object({
                  name: z.string(),
                  value: z.object({
                    seguros: z.null(),
                    fletes: z.null(),
                    embalajes: z.null(),
                    otros: z.null()
                  })
                })
              ])
            )
          })
        ),
        carta_318: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      descripcion: z.string(),
                      cantidad: z.number(),
                      unidad: z.string(),
                      precio_unitario: z.string(),
                      precio_total: z.string()
                    })
                  )
                }),
                z.object({
                  name: z.string(),
                  value: z.object({
                    seguros: z.string(),
                    fletes: z.string(),
                    embalajes: z.string(),
                    otros: z.string()
                  })
                })
              ])
            )
          })
        ),
        factura: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      descripcion: z.string(),
                      cantidad: z.number(),
                      unidad: z.string(),
                      precio_unitario: z.string(),
                      precio_total: z.string()
                    })
                  )
                }),
                z.object({
                  name: z.string(),
                  value: z.object({
                    seguros: z.null(),
                    fletes: z.null(),
                    embalajes: z.null(),
                    otros: z.null()
                  })
                })
              ])
            )
          })
        )
      }),
      inferred_context: z.array(
        z.union([
          z.object({
            pedimento: z.array(
              z.object({
                document_id: z.string(),
                document_summary: z.string(),
                data: z.array(z.object({ name: z.string(), value: z.string() }))
              })
            )
          }),
          z.object({
            factura: z.array(
              z.object({
                document_id: z.string(),
                document_summary: z.string(),
                data: z.array(z.object({ name: z.string(), value: z.string() }))
              })
            )
          })
        ])
      ),
      external_context: z.object({
        diario_oficial_de_la_federacion: z.array(
          z.object({ name: z.string(), value: z.number() })
        ),
        apendice_3: z.array(z.object({ name: z.string(), value: z.string() })),
        apendice_14: z.array(z.object({ name: z.string(), value: z.string() }))
      }),
      validation_steps: z.array(
        z.object({
          name: z.string(),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(
            z.object({ id: z.number(), step_description: z.string() })
          )
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    }),
    gross_weight: z.object({
      provided_context: z.object({
        pedimento: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      id: z.number(),
                      umc: z.string(),
                      cantidad_umc: z.string()
                    })
                  )
                })
              ])
            )
          })
        ),
        factura: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      id: z.number(),
                      peso_bruto: z.string(),
                      peso_neto: z.string()
                    })
                  )
                })
              ])
            )
          })
        ),
        packing_list: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      id: z.number(),
                      peso_bruto: z.string(),
                      peso_neto: z.string()
                    })
                  )
                })
              ])
            )
          })
        ),
        cove: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      id: z.number(),
                      umc: z.string(),
                      cantidad_umc: z.string()
                    })
                  )
                }),
                z.object({ name: z.string(), value: z.string() })
              ])
            )
          })
        )
      }),
      validation_steps: z.array(
        z.object({
          name: z.string(),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(
            z.object({ id: z.number(), step_description: z.string() })
          )
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    }),
    invoice_data: z.object({
      provided_context: z.object({
        pedimento: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      num_factura: z.string(),
                      fecha_factura: z.string(),
                      incoterm: z.string(),
                      moneda_factura: z.string(),
                      valor_moneda_factura: z.number(),
                      factor_moneda_factura: z.number(),
                      valor_dolares_factura: z.number()
                    })
                  )
                })
              ])
            )
          })
        ),
        factura: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({ name: z.string(), value: z.number() })
              ])
            )
          })
        ),
        cove: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({ name: z.string(), value: z.number() })
              ])
            )
          })
        ),
        carta_318: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.object({ valor: z.number(), moneda: z.string() })
                })
              ])
            )
          })
        ),
        carta_cesion_de_derechos: z.array(z.unknown())
      }),
      external_context: z.object({
        validacion_rfc: z.array(
          z.object({
            rfc: z.string(),
            tipo: z.string(),
            es_valido: z.boolean()
          })
        ),
        diario_oficial_de_la_federacion: z.array(
          z.union([
            z.object({ name: z.string(), value: z.number() }),
            z.object({ name: z.string(), value: z.null() })
          ])
        )
      }),
      validation_steps: z.array(
        z.object({
          name: z.string(),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(
            z.object({ id: z.number(), step_description: z.string() })
          )
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    }),
    transport_data: z.object({
      provided_context: z.object({
        pedimento: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.string() }),
                z.object({
                  name: z.string(),
                  value: z.object({
                    entrada_salida: z.string(),
                    arribo: z.string(),
                    salida: z.string()
                  })
                })
              ])
            )
          })
        ),
        documento_de_transporte: z.array(z.unknown())
      }),
      external_context: z.object({
        apendice_3: z.object({ name: z.string(), value: z.string() }),
        apendice_10: z.object({ name: z.string(), value: z.string() })
      }),
      validation_steps: z.array(
        z.object({
          name: z.string(),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(
            z.object({ id: z.number(), step_description: z.string() })
          )
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    }),
    partidas: z.object({
      provided_context: z.object({
        pedimento: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({
                  id: z.number(),
                  name: z.string(),
                  value: z.number()
                }),
                z.object({
                  id: z.number(),
                  name: z.string(),
                  value: z.array(
                    z.object({
                      sec: z.number(),
                      fraccion: z.string(),
                      nico: z.string(),
                      umc: z.string(),
                      cantidad_umc: z.number(),
                      umt: z.string(),
                      cantidad_umt: z.number(),
                      p_v_c: z.string(),
                      p_o_d: z.string(),
                      val_adu: z.number(),
                      imp_precio_pag: z.number(),
                      precio_unit: z.number(),
                      val_agreg: z.null(),
                      identificadores: z.array(
                        z.union([
                          z.object({
                            clave: z.string(),
                            complemento1: z.string(),
                            complemento2: z.null(),
                            complemento3: z.null()
                          }),
                          z.object({
                            clave: z.string(),
                            complemento1: z.string(),
                            complemento2: z.string(),
                            complemento3: z.null()
                          }),
                          z.object({
                            clave: z.string(),
                            complemento1: z.null(),
                            complemento2: z.null(),
                            complemento3: z.null()
                          })
                        ])
                      ),
                      contribuciones: z.array(
                        z.object({
                          con: z.string(),
                          tasa: z.number(),
                          t_t: z.string(),
                          f_p: z.string(),
                          importe: z.number()
                        })
                      )
                    })
                  )
                }),
                z.object({
                  id: z.number(),
                  name: z.string(),
                  value: z.string()
                })
              ])
            )
          })
        ),
        cove: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.object({
                name: z.string(),
                value: z.object({
                  funge_certificado: z.boolean(),
                  subdivision: z.string()
                })
              })
            )
          })
        ),
        rrnas: z.array(z.unknown())
      }),
      inferred_context: z.object({
        pedimento: z.array(
          z.object({
            document_id: z.string(),
            document_summary: z.string(),
            data: z.array(
              z.union([
                z.object({ name: z.string(), value: z.number() }),
                z.object({
                  name: z.string(),
                  value: z.array(
                    z.object({
                      sec: z.number(),
                      fraccion: z.string(),
                      precio_pagado: z.number(),
                      precio_unitario: z.number(),
                      valor_aduana: z.number(),
                      igi: z.number(),
                      iva: z.number()
                    })
                  )
                })
              ])
            )
          })
        )
      }),
      external_context: z.object({
        taxfinder: z.array(
          z.object({
            sec: z.number(),
            fraccion: z.string(),
            nico: z.array(
              z.object({
                nico: z.string(),
                descripcion: z.string(),
                fecha_dof: z.string(),
                fecha_entrada_vigor: z.string(),
                abrogado: z.boolean(),
                oid: z.string()
              })
            ),
            umt: z.string(),
            identificadores: z.string(),
            contribuciones: z.string(),
            permisos: z.string(),
            restricciones_arancelarias: z.array(z.unknown()),
            restricciones_no_arancelarias: z.array(
              z.object({
                articulo: z.string(),
                tipo_regulacion: z.string(),
                norma: z.string(),
                descripcion: z.string()
              })
            )
          })
        ),
        apendice_8: z.array(
          z.union([
            z.object({
              sec: z.number(),
              fraccion: z.string(),
              clave: z.string(),
              nivel: z.string(),
              supuestos_aplicacion: z.string(),
              complemento1: z.string(),
              complemento2: z.null(),
              complemento3: z.null()
            }),
            z.object({
              sec: z.number(),
              fraccion: z.string(),
              clave: z.string(),
              nivel: z.string(),
              supuestos_aplicacion: z.string(),
              complemento1: z.null(),
              complemento2: z.null(),
              complemento3: z.null()
            }),
            z.object({
              sec: z.number(),
              fraccion: z.string(),
              clave: z.string(),
              nivel: z.string(),
              supuestos_aplicacion: z.string(),
              complemento1: z.string(),
              complemento2: z.string(),
              complemento3: z.null()
            })
          ])
        )
      }),
      validation_steps: z.array(
        z.object({
          id: z.number(),
          fraccion: z.string(),
          steps: z.array(
            z.union([
              z.object({
                id: z.number(),
                name: z.string(),
                llm_analysis: z.string(),
                is_correct: z.boolean(),
                actions_to_take: z.array(
                  z.object({ id: z.number(), step_description: z.string() })
                )
              }),
              z.object({
                id: z.number(),
                name: z.string(),
                llm_analysis: z.string(),
                is_correct: z.boolean(),
                actions_to_take: z.array(z.unknown())
              })
            ])
          ),
          llm_analysis: z.string(),
          is_correct: z.boolean(),
          actions_to_take: z.array(
            z.object({ id: z.number(), step_description: z.string() })
          )
        })
      ),
      is_correct: z.boolean(),
      summary: z.string(),
      full_context: z.boolean()
    })
  }),
  secciones_cove: z.object({}),
  files: z.array(z.object({ name: z.string(), url: z.string() })),
  alerts: z.object({
    high: z.array(
      z.object({ id: z.number(), validation_step_name: z.string() })
    ),
    medium: z.array(
      z.object({ id: z.number(), validation_step_name: z.string() })
    ),
    low: z.array(
      z.object({ id: z.number(), validation_step_name: z.string() })
    )
  })
})

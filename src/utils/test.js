export const Inventarios = [
    {
        "id": 1,
        "cantidad": 10,
        "producto": {
            "id": 1,
            "nombre": "Espresso",
            "precio": 2,
            "imagen": "------",
            "category": {
                "id": 1,
                "nombre": "Café",
                "departament": {
                    "id": 1,
                    "nombre": "Bebidas"
                }
            },
            "descuento": {
                "id": 0,
                "porcentaje": 0,
                "descripcion": "sin descuento"
              }
        }
    },
    {
        "id": 2,
        "cantidad": 6,
        "producto": {
            "id": 2,
            "nombre": "Macchiato",
            "precio": 5,
            "imagen": "------",
            "category": {
                "id": 1,
                "nombre": "Café",
                "departament": {
                    "id": 1,
                    "nombre": "Bebidas"
                }
            },
            "descuento": {
                "id": 0,
                "porcentaje": 0,
                "descripcion": "sin descuento"
              }
        }
    },
    {
        "id": 3,
        "cantidad": 7,
        "producto": {
            "id": 3,
            "nombre": "Frapuccino",
            "precio": 15,
            "imagen": "------",
            "category": {
                "id": 2,
                "nombre": "Bebidas Frías",
                "departament": {
                    "id": 1,
                    "nombre": "Bebidas"
                }
            },
            "descuento": {
                "id": 0,
                "porcentaje": 0,
                "descripcion": "sin descuento"
              }
        }
    },
    {
        "id": 4,
        "cantidad": 10,
        "producto": {
            "id": 4,
            "nombre": "Tostadas con aguacate",
            "precio": 3,
            "imagen": "------",
            "category": {
                "id": 3,
                "nombre": "Sandwiches y Bocadillos",
                "departament": {
                    "id": 2,
                    "nombre": "Alimentos"
                }
            },
            "descuento": {
                "id": 0,
                "porcentaje": 0,
                "descripcion": "sin descuento"
              }
        }
    },
    {
        "id": 5,
        "cantidad": 15,
        "producto": {
            "id": 5,
            "nombre": "Brownies",
            "precio": 8,
            "imagen": "------",
            "category": {
                "id": 4,
                "nombre": "Repostería",
                "departament": {
                    "id": 2,
                    "nombre": "Alimentos"
                }
            },
            "descuento": {
                "id": 0,
                "porcentaje": 0,
                "descripcion": "sin descuento"
              }
        }
    },
    {
        "id": 6,
        "cantidad": 100,
        "producto": {
            "id": 6,
            "nombre": "Agua mineral",
            "precio": 7,
            "imagen": "------",
            "category": {
                "id": 5,
                "nombre": "Bebidas Embotelladas",
                "departament": {
                    "id": 3,
                    "nombre": "Productos para Llevar"
                }
            },
            "descuento": {
                "id": 0,
                "porcentaje": 0,
                "descripcion": "sin descuento"
              }
        }
    }
];

export const Providers = [
    { "id": 0, "nombre": "proveedor 1" },
    { "id": 2, "nombre": "proveedor 2" },
    { "id": 3, "nombre": "proveedor 3" },
    { "id": 4, "nombre": "proveedor 4" },
    { "id": 5, "nombre": "proveedor 5" }
];

export const IncomeNotes = [
    {
        "id": 1,
        "descripcion": "aaaa",
        "fecha": "2024-05-09T00:00:00.000",
        "proveedor": "steven",
        "detalleIngreso": [
            {
                "cantidad": 100,
                "inventario": {
                    "id": 1,
                    "producto": {
                        "id": 1,
                        "nombre": "Producto 1"
                    }
                }
            },
            {
                "cantidad": 200,
                "inventario": {
                    "id": 2,
                    "producto": {
                        "id": 2,
                        "nombre": "Producto 2"
                    }
                }
            }
        ]
    },
    {
        "id": 2,
        "descripcion": "bbbb",
        "fecha": "2024-06-20T00:00:00.000",
        "proveedor": "sarah",
        "detalleIngreso": [
            {
                "cantidad": 10,
                "inventario": {
                    "id": 7,
                    "producto": {
                        "id": 7,
                        "nombre": "Producto 7"
                    }
                }
            },
            {
                "cantidad": 30,
                "inventario": {
                    "id": 5,
                    "producto": {
                        "id": 5,
                        "nombre": "Producto 5"
                    }
                }
            }
        ]
    },
    {
        "id": 3,
        "descripcion": "ccccc",
        "fecha": "2024-06-09T00:00:00.000",
        "proveedor": "sarah",
        "detalleIngreso": [
            {
                "cantidad": 5,
                "inventario": {
                    "id": 7,
                    "producto": {
                        "id": 7,
                        "nombre": "Producto 7"
                    }
                }
            }
        ]
    }
];

export const EgressNotes = [
    {
        "id": 1,
        "descripcion": "dddd",
        "fecha": "2024-05-09T00:00:00.000",
        "detalleEgreso": [
            {
                "cantidad": 1,
                "inventario": {
                    "id": 1,
                    "producto": {
                        "id": 1,
                        "nombre": "Producto 1"
                    }
                }
            },
            {
                "cantidad": 10,
                "inventario": {
                    "id": 2,
                    "producto": {
                        "id": 2,
                        "nombre": "Producto 2"
                    }
                }
            }
        ]
    },
    {
        "id": 2,
        "descripcion": "eeee",
        "fecha": "2024-06-09T00:00:00.000",
        "detalleEgreso": [
            {
                "cantidad": 1,
                "inventario": {
                    "id": 3,
                    "producto": {
                        "id": 3,
                        "nombre": "Producto 3"
                    }
                }
            },
            {
                "cantidad": 10,
                "inventario": {
                    "id": 1,
                    "producto": {
                        "id": 1,
                        "nombre": "Producto 1"
                    }
                }
            }
        ]
    },
    {
        "id": 3,
        "descripcion": "ffff",
        "fecha": "2024-06-09T00:00:00.000",
        "detalleEgreso": [
            {
                "cantidad": 1,
                "inventario": {
                    "id": 3,
                    "producto": {
                        "id": 3,
                        "nombre": "Producto 3"
                    }
                }
            },
            {
                "cantidad": 10,
                "inventario": {
                    "id": 7,
                    "producto": {
                        "id": 7,
                        "nombre": "Producto 7"
                    }
                }
            }
        ]
    }
];
export const ventasDeProductos = [
    {
        id: 1,
        fecha: "2024-06-30T23:17:41.060Z",
        status: "Pagado",
        tipoPago: {
            id: 1,
            nombre: "Pago por QR"
        },
        detalleVenta: [
            {
                id: 1,
                cantidad: 2,
                producto: {
                    id: 1,
                    nombre: "Camisa",
                    precio: 25,
                    imagen: {
                        id: 1,
                        descripcion: "Camisa de algodón",
                        enlace: "https://ejemplo.com/imagen-camisa.jpg"
                    },
                    category: {
                        id: 1,
                        nombre: "Ropa",
                        departament: {
                            id: 1,
                            nombre: "Moda"
                        }
                    },
                    descuento: {
                        id: 1,
                        porcentaje: 0,
                        descripcion: ""
                    }
                }
            },
            {
                id: 2,
                cantidad: 1,
                producto: {
                    id: 2,
                    nombre: "Pantalón",
                    precio: 35,
                    imagen: {
                        id: 2,
                        descripcion: "Pantalón de mezclilla",
                        enlace: "https://ejemplo.com/imagen-pantalon.jpg"
                    },
                    category: {
                        id: 1,
                        nombre: "Ropa",
                        departament: {
                            id: 1,
                            nombre: "Moda"
                        }
                    },
                    descuento: {
                        id: 1,
                        porcentaje: 10,
                        descripcion: "Descuento de temporada"
                    }
                }
            }
        ],
        person: {
            id: 1,
            nombre: "Juan Pérez",
            usuario: "juanperez",
            email: "juan@example.com",
            direccion: "Calle Principal #123",
            enabled: true
        }
    },
    {
        id: 2,
        fecha: "2024-06-30T20:15:00.000Z",
        status: "Cancelado",
        tipoPago: {
            id: 2,
            nombre: "Pago en efectivo"
        },
        detalleVenta: [
            {
                id: 3,
                cantidad: 1,
                producto: {
                    id: 3,
                    nombre: "Zapatos",
                    precio: 50,
                    imagen: {
                        id: 3,
                        descripcion: "Zapatos de cuero",
                        enlace: "https://ejemplo.com/imagen-zapatos.jpg"
                    },
                    category: {
                        id: 2,
                        nombre: "Calzado",
                        departament: {
                            id: 1,
                            nombre: "Moda"
                        }
                    },
                    descuento: {
                        id: 1,
                        porcentaje: 0,
                        descripcion: ""
                    }
                }
            }
        ],
        person: {
            id: 2,
            nombre: "María López",
            usuario: "marialopez",
            email: "maria@example.com",
            direccion: "Avenida Principal #456",
            enabled: true
        }
    }
];
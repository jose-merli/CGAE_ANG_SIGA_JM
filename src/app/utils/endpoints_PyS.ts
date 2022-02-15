export let endpoints_PyS: any = {
    PyS_savePagoCompraSuscripcion: "pys/savePagoCompraSuscripcion",
    PyS_getFichaCompraSuscripcion: "pys/getFichaCompraSuscripcion",
    PyS_solicitarCompra: "pys/solicitarCompra",
    PyS_aprobarCompra: "pys/aprobarCompra",
    PyS_denegarPeticion: "pys/denegarPeticion",
    PyS_comboEstadosFactura: "pys/comboEstadosFactura",
    PyS_getListaCompraProductos: "pys/getListaCompraProductos",
    PyS_denegarPeticionMultiple: "/pys/denegarPeticionMultiple",
    PyS_facturarCompraMultiple: "/pys/facturarCompraMultiple",
    PyS_aprobarCompraMultiple: "/pys/aprobarCompraMultiple",
    PyS_getListaProductosCompra: "/pys/getListaProductosCompra",
    PyS_getPermisoModificarImporteProducto: "/pys/getPermisoModificarImporteProducto",
    PyS_updateProductosPeticion: "/pys/updateProductosPeticion",
    PyS_getFacturasPeticion: "/pys/getFacturasPeticion",
    PyS_getDescuentosPeticion: "/pys/getDescuentosPeticion",
    PyS_saveAnticipoPeticion: "/pys/saveAnticipoPeticion",
    PyS_anularPeticion: "/pys/anularPeticion",
    PyS_facturarCompra: "/facturacionRapidaPyS/facturacionRapidaCompra",
    PyS_getListaSuscripciones: "/pys/getListaSuscripciones",
    PyS_getListaServiciosSuscripcion: "/pys/getListaServiciosSuscripcion",
    PyS_solicitarSuscripcion: "pys/solicitarSuscripcion",
    PyS_aprobarSuscripcion: "pys/aprobarSuscripcion",
    PyS_updateServiciosPeticion: "/pys/updateServiciosPeticion",
    serviciosBusqueda_comboTiposMultiple: "pys/listadoTipoServicioByIdCategoriaMultiple",
    productosBusqueda_comboTiposMultiple: "pys/listadoTipoProductoByIdCategoriaMultiple",
    PyS_aprobarSuscripcionMultiple: "pys/aprobarSuscripcionMultiple",
    PyS_denegarSuscripcionMultiple: "pys/denegarSuscripcionMultiple",
    PyS_anularSuscripcionMultiple: "pys/anularSuscripcionMultiple",
    PyS_anularCompraMultiple: "pys/anularCompraMultiple",
    cargasMasivasCompras_descargarModelo: "cargaMasivaCompras/descargarModelo",
    cargasMasivasCompras_listado: "cargaMasivaCompras/listado",
    cargasMasivasCompras_cargarFichero: "cargaMasivaCompras/cargarFichero",
    cargasMasivasCompras_descargarFicheros: "cargaMasivaCompras/descargarFicheros",
    monederosBusqueda_searchListadoMonederos: "pys/getMonederos",
    PyS_updatesMovimientosMonedero: "pys/updateMovimientosMonedero",
    PyS_getListaMovimientosMonedero: "pys/getListaMovimientosMonedero",
    PyS_updateServiciosMonedero: "pys/updateServiciosMonedero",
    PyS_getListaServiciosMonedero: "pys/getListaServiciosMonedero", 
    PyS_anadirAnticipoCompra: "pys/anadirAnticipoCompra",
    PyS_liquidarMonederos: "pys/liquidarMonederos",
    PyS_actualizacionColaSuscripcionesPersona: "pys/actualizacionColaSuscripcionesPersona",
    PyS_comboPreciosServPers: "combo/comboPreciosServPers",
    PyS_getSeleccionSerieFacturacion: "/facturacionRapidaPyS/getSeleccionSerieFacturacion",
     //INICIO PRODUCTOS Y SERVICIOS
  
    //PANTALLA TIPOS PRODUCTOS
    tiposProductos_searchListadoProductos: 'pys/listadoTipoProducto',
    tiposProductos_searchListadoProductosHistorico: 'pys/listadoTipoProductoHistorico',
    tiposProductos_activarDesactivarProducto: 'pys/activarDesactivarProducto',
    tiposProductos_crearEditarProducto: 'pys/crearEditarProducto',
    tiposProductos_comboProducto: 'combo/tipoProductos',

    //PANTALLA TIPOS SERVICIOS
    tiposServicios_searchListadoServicios: 'pys/listadoTipoServicio',
    tiposServicios_searchListadoServiciosHistorico: 'pys/listadoTipoServicioHistorico',
    tiposServicios_activarDesactivarServicio: 'pys/activarDesactivarServicio',
    tiposServicios_crearEditarServicio: 'pys/crearEditarServicio',
    tiposServicios_comboServicios: 'combo/tipoServicios',

    //PANTALLAS BUSCADOR PRODUCTOS / FICHA PRODUCTOS
    productosBusqueda_comboIva: 'combo/tipoIva',
    productosBusqueda_comboFormaPago: 'combo/tipoFormaPago',
    productosBusqueda_comboTipos: 'pys/listadoTipoProductoByIdCategoria',
    productosBusqueda_busqueda: 'pys/buscarProductos',
    productosBusqueda_activarDesactivar: 'pys/reactivarBorradoFisicoLogicoProductos',
    fichaProducto_detalleProducto: 'pys/detalleProducto',
    fichaProducto_crearProducto: 'pys/nuevoProducto',
    fichaProducto_editarProducto: 'pys/editarProducto',
    fichaProducto_comboIvaNoDerogados: 'combo/tipoIvaNoDerogados',
    fichaProducto_comboFormasDePagoInternet: 'combo/pagoInternet',
    fichaProducto_comboFormasDePagoSecretaria: 'combo/comboPagoSecretaria',
    fichaProducto_crearFormaDePago: 'pys/formasPagoProducto',
    fichaProducto_obtenerCodigosPorColegio: '/pys/obtenerCodigosPorColegio',

    //PANTALLAS BUSCADOR SERVICIOS / FICHA SERVICIOS
    serviciosBusqueda_busqueda: 'pys/buscarServicios',
    serviciosBusqueda_comboTipos: 'pys/listadoTipoServicioByIdCategoria',
    serviciosBusqueda_activarDesactivar: 'pys/reactivarBorradoFisicoLogicoServicios',
    fichaServicio_detalleServicio: 'pys/detalleServicio',
    fichaServicio_crearServicio: 'pys/nuevoServicio',
    fichaServicio_editarServicio: 'pys/editarServicio',
    fichaServicio_obtenerCodigosPorColegio: '/pys/obtenerCodigosPorColegioServicios',
    fichaServicio_comboCondicionSuscripcion: 'combo/CondicionSuscripcion',
    fichaServicio_crearFormaDePago: 'pys/formasPagoServicio',
    fichaServicio_borrarSuscripcionesBajas: 'pys/borrarSuscripcionesBajas',
    fichaServicio_obtenerPreciosServicio: 'pys/detalleTarjetaPrecios',
    fichaServicio_comboPeriodicidad: 'combo/comboPeriodicidad',
    fichaServicio_crearEditarPrecios: 'pys/crearEditarPrecios',
    fichaServicio_eliminarPrecios: 'pys/eliminarPrecios',
    constructorConsultas_obtenerDatosConsulta: 'consultas/pys/obtenerDatosConsulta',
    constructorConsultas_guardarDatosConstructor: 'consultas/pys/constructorConsultas',
    constructorConsultas_obtenerConfigColumnasQueryBuilder: 'consultas/pys/obtenerConfigColumnasQueryBuilder',
    constructorConsultas_obtenerCombosQueryBuilder: 'consultas/pys/obtenerCombosQueryBuilder'

    //FIN PRODUCTOS Y SERVICIOS
}